import { NextResponse } from "next/server";
import { createRouteHandler } from "@/lib/database/supabase-server";
import { sendOrderConfirmationEmail } from "@/lib/services/email-service";

export async function POST(request: Request) {
  try {
    const supabase = await createRouteHandler();

    // Get the current user session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderData = await request.json();
    const { items, delivery_address, total_price, upi_ref, payee_name } =
      orderData;

    // Validate stock availability for all items
    for (const item of items) {
      // item should have variant info (e.g. variant name or id)
      const { data: product, error } = await supabase
        .from("products")
        .select("variants, name")
        .eq("id", item.id)
        .single();

      if (error || !product) {
        return NextResponse.json(
          { error: `Product ${item.name} not found` },
          { status: 404 }
        );
      }

      // Parse variants array
      let variants = [];
      try {
        variants =
          typeof product.variants === "string"
            ? JSON.parse(product.variants)
            : product.variants || [];
      } catch (e) {
        variants = [];
      }

      // Find the correct variant (by name or id)
      const variant = variants.find(
        (v: { name?: string; id?: string | number; stock?: number }) => {
          if (item.variant) {
            // Match by variant name or id
            return v.name === item.variant || v.id === item.variant;
          }
          // Fallback: match by name if only one variant
          return variants.length === 1;
        }
      );

      if (!variant) {
        return NextResponse.json(
          { error: `Variant not found for product ${product.name}` },
          { status: 404 }
        );
      }

      if (typeof variant.stock !== "number" || variant.stock < item.qty) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${product.name} (${
              variant.name
            }). Available: ${variant.stock ?? 0}, Requested: ${item.qty}`,
            productId: item.id,
            variant: variant.name,
            availableStock: variant.stock ?? 0,
            requestedQuantity: item.qty,
          },
          { status: 400 }
        );
      }
    }

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: session.user.id,
        items,
        total_price,
        delivery_address,
        upi_ref,
        payee_name,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json(
        { error: "Failed to create order", details: orderError.message },
        { status: 500 }
      );
    }

    // Clear the user's cart after successful order creation
    try {
      const { error: clearCartError } = await supabase
        .from("cart")
        .delete()
        .eq("user_id", session.user.id);
    } catch (cartError) {
      // Don't fail the order creation if cart clearing fails
    }

    // Send Telegram notification after successful order creation
    try {
      // Get customer name from profiles table
      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("user_id", session.user.id)
        .single();

      // Use profile name, or fallback to email, or finally 'Unknown Customer'
      const customerName =
        profile?.name || session.user.email || "Unknown Customer";

      // Send notification to admin via Telegram
      const notificationResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/api/notify-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: order.id,
            customerName,
            payeeName: payee_name,
            upiRef: upi_ref,
            amount: total_price,
          }),
        }
      );
    } catch (notificationError) {
      // Don't fail the order creation if notification fails
    }

    // Send email confirmation to user
    try {
      // Get customer profile for email notification
      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("user_id", session.user.id)
        .single();

      const customerName =
        profile?.name || session.user.email || "Valued Customer";
      const customerEmail = session.user.email;

      if (customerEmail) {
        const emailResult = await sendOrderConfirmationEmail(customerEmail, {
          customerName,
          orderId: order.id,
          items: items.map((item: any) => ({
            name: item.name,
            qty: item.qty,
            price: item.price,
            variant: item.variant,
          })),
          totalPrice: total_price,
          deliveryAddress: delivery_address,
        });
      }
    } catch (emailError) {
      // Don't fail the order creation if email fails
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createRouteHandler();

    // Get the current user session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 }
      );
    }

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
