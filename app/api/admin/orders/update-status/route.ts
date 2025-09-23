import { NextResponse } from "next/server";
import {
  createRouteHandler,
  createAdminClient,
} from "@/lib/database/supabase-server";
import {
  updateOrderStatus,
  type OrderStatus,
} from "@/lib/database/services/supabase-orders";
import { sendOrderStatusUpdateEmail } from "@/lib/services/email-service";

// Load admin emails from environment variables
const ADMIN_EMAILS: string[] = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(",").map((email) => email.trim())
  : ["partyvilla.store@gmail.com"];

export async function PUT(request: Request) {
  try {
    const supabase = await createRouteHandler();

    // Check authentication and admin permissions
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const isAdmin = ADMIN_EMAILS.includes(session.user.email || "");

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { orderId, newStatus } = await request.json();

    if (!orderId || !newStatus) {
      return NextResponse.json(
        { error: "Missing required fields: orderId and newStatus" },
        { status: 400 }
      );
    }

    // First, get the current order details
    const { data: currentOrder, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchError || !currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const oldStatus = currentOrder.status;

    // Don't send notification if status hasn't actually changed
    if (oldStatus === newStatus) {
      return NextResponse.json(
        { error: "Order status is already " + newStatus },
        { status: 400 }
      );
    }

    // Update the order status
    let updatedOrder;
    try {
      updatedOrder = await updateOrderStatus(
        orderId,
        newStatus as OrderStatus,
        supabase
      );
    } catch (updateError) {
      return NextResponse.json(
        {
          error:
            updateError instanceof Error
              ? updateError.message
              : "Failed to update order status",
        },
        { status: 500 }
      );
    }

    // Deduct stock if order is being confirmed (pending -> confirmed)
    if (oldStatus === "pending" && newStatus === "confirmed") {
      const items = Array.isArray(currentOrder.items) ? currentOrder.items : [];

      // First, validate that we still have sufficient stock for all items
      for (const item of items) {
        const { data: product, error } = await supabase
          .from("products")
          .select("variants, name")
          .eq("id", item.id)
          .single();

        if (error || !product) {
          return NextResponse.json(
            { error: `Product ${item.name} not found during stock validation` },
            { status: 404 }
          );
        }

        let variants = [];
        try {
          variants =
            typeof product.variants === "string"
              ? JSON.parse(product.variants)
              : product.variants || [];
        } catch (e) {
          return NextResponse.json(
            { error: `Failed to parse variants for product ${item.name}` },
            { status: 500 }
          );
        }

        const variant = variants.find(
          (v: { name?: string; id?: string | number; stock?: number }) => {
            if (item.variant) {
              return v.name === item.variant || v.id === item.variant;
            }
            return variants.length === 1;
          }
        );

        if (!variant) {
          return NextResponse.json(
            {
              error: `Variant ${item.variant} not found for product ${product.name}`,
            },
            { status: 404 }
          );
        }

        if (typeof variant.stock !== "number" || variant.stock < item.qty) {
          return NextResponse.json(
            {
              error: `Insufficient stock to confirm order. Product: ${
                product.name
              } (${variant.name}). Available: ${
                variant.stock ?? 0
              }, Required: ${item.qty}`,
              productId: item.id,
              variant: variant.name,
              availableStock: variant.stock ?? 0,
              requestedQuantity: item.qty,
            },
            { status: 400 }
          );
        }
      }

      // Now proceed with stock deduction
      for (const item of items) {
        try {
          // Fetch product and variants
          const { data: product, error } = await supabase
            .from("products")
            .select("variants")
            .eq("id", item.id)
            .single();

          if (error || !product) {
            continue;
          }

          let variants = [];
          try {
            variants =
              typeof product.variants === "string"
                ? JSON.parse(product.variants)
                : product.variants || [];
          } catch (e) {
            continue;
          }

          // Find the correct variant
          const variantIndex = variants.findIndex(
            (v: { name?: string; id?: string | number }) => {
              if (item.variant) {
                return v.name === item.variant || v.id === item.variant;
              }
              return variants.length === 1;
            }
          );

          const originalStock = variants[variantIndex].stock;

          // Decrease stock
          if (typeof variants[variantIndex].stock === "number") {
            const newStock = Math.max(
              0,
              variants[variantIndex].stock - item.qty
            );
            variants[variantIndex].stock = newStock;
          }

          // Update the product variants in database
          const { error: updateError } = await supabase
            .from("products")
            .update({
              variants: variants,
              updated_at: new Date().toISOString(),
            })
            .eq("id", item.id);
        } catch (stockError) {}
      }
    }

    // Send email notification to customer
    try {
      let customerEmail: string = "";
      let customerName: string = "";

      // Get customer email using auth admin API (requires service role key)
      const adminClient = createAdminClient();
      const { data: userProfile, error: authError } =
        await adminClient.auth.admin.getUserById(currentOrder.user_id);

      if (authError || !userProfile?.user?.email) {
        return NextResponse.json({
          success: true,
          order: updatedOrder,
          message:
            "Order status updated successfully (email notification skipped - no email found)",
        });
      }

      customerEmail = userProfile.user.email;

      // Get customer name from profiles table
      const { data: profileData } = await supabase
        .from("profiles")
        .select("name")
        .eq("user_id", currentOrder.user_id)
        .single();

      customerName =
        profileData?.name ||
        userProfile.user.user_metadata?.name ||
        userProfile.user.user_metadata?.full_name ||
        customerEmail.split("@")[0] ||
        "Valued Customer";

      if (!customerEmail) {
        return NextResponse.json({
          success: true,
          order: updatedOrder,
          message:
            "Order status updated successfully (email notification skipped - no email found)",
        });
      }

      const emailResult = await sendOrderStatusUpdateEmail(customerEmail, {
        customerName,
        orderId: currentOrder.id,
        oldStatus,
        newStatus,
        items: Array.isArray(currentOrder.items)
          ? currentOrder.items.map((item: any) => ({
              name: item.name,
              qty: item.qty,
              price: item.price,
              variant: item.variant,
            }))
          : [],
        totalPrice: currentOrder.total_price,
      });

      if (!emailResult.success) {
        return NextResponse.json({
          success: true,
          order: updatedOrder,
          message: `Order status updated successfully (email failed: ${emailResult.error})`,
        });
      } else {
        return NextResponse.json({
          success: true,
          order: updatedOrder,
          message:
            "Order status updated successfully and customer notified via email",
        });
      }
    } catch (emailError) {
      return NextResponse.json({
        success: true,
        order: updatedOrder,
        message: `Order status updated successfully (email error: ${
          emailError instanceof Error ? emailError.message : "Unknown error"
        })`,
      });
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: "Order status updated successfully and customer notified",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
