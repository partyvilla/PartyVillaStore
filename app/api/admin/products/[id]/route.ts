import { NextRequest, NextResponse } from "next/server";
import { createRouteHandler } from "@/lib/database/supabase-server";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
  extractPublicIdFromUrl,
} from "@/lib/services/cloudinary";
import {
  updateProduct,
  deleteProduct,
  getProductById,
} from "@/lib/database/services/supabase-products";

// Admin emails - should match middleware
const ADMIN_EMAILS: string[] = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(",").map((email) => email.trim())
  : ["jsc.21905@gmail.com"];

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and admin permissions
    const supabase = await createRouteHandler();
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
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const productId = params.id;

    // Check content type to determine how to parse the body
    const contentType = request.headers.get("content-type") || "";

    let body: any = null;
    let isJsonRequest = false;

    if (contentType.includes("application/json")) {
      try {
        body = await request.json();
        isJsonRequest = true;
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid JSON format" },
          { status: 400 }
        );
      }
    } else {
      isJsonRequest = false;
    }

    if (isJsonRequest && body && body.variants && !body.name) {
      const product = await updateProduct(productId, {
        variants: body.variants,
      });
      return NextResponse.json(product);
    }

    if (isJsonRequest && body && body.name) {
      // Handle full product update from JSON data
      const { name, category, description, variants, image_url } = body;

      // Validate required fields
      if (!name || !category) {
        return NextResponse.json(
          { error: "Name and category are required" },
          { status: 400 }
        );
      }
      if (!Array.isArray(variants) || variants.length === 0) {
        return NextResponse.json(
          { error: "At least one variant is required" },
          { status: 400 }
        );
      }

      // Get existing product
      const existingProduct = await getProductById(productId);
      if (!existingProduct) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      // Update product in database
      const productData = {
        name,
        category,
        description: description || null,
        image_url: image_url || null,
        variants,
      };

      try {
        const product = await updateProduct(productId, productData);
        return NextResponse.json({
          success: true,
          product,
          message: "Product updated successfully",
        });
      } catch (error: any) {
        return NextResponse.json(
          { error: error?.message || "Internal server error" },
          { status: 500 }
        );
      }
    }

    // Process as FormData
    if (!isJsonRequest) {
      const formData = await request.formData();
      const name = formData.get("name") as string;
      const category = formData.get("category") as string;
      const description = formData.get("description") as string;
      const images = formData.getAll("images") as File[];
      let variantsRaw = formData.get("variants");
      let variants: any = null;
      if (variantsRaw instanceof Blob) {
        // Read Blob as text and parse JSON
        const text = await variantsRaw.text();
        try {
          variants = JSON.parse(text);
        } catch (error) {
          return NextResponse.json(
            { error: "Invalid variants format (Blob)" },
            { status: 400 }
          );
        }
      } else if (typeof variantsRaw === "string") {
        try {
          variants = JSON.parse(variantsRaw);
        } catch (error) {
          return NextResponse.json(
            { error: "Invalid variants format (string)" },
            { status: 400 }
          );
        }
      } else {
        variants = null;
      }
      const existingImages: string[] = formData.getAll(
        "existingImage"
      ) as string[];
      const removeExistingImage =
        formData.get("removeExistingImage") === "true";

      // Validate required fields
      if (!name || !category) {
        return NextResponse.json(
          { error: "Name and category are required" },
          { status: 400 }
        );
      }
      if (!Array.isArray(variants) || variants.length === 0) {
        return NextResponse.json(
          { error: "At least one variant is required" },
          { status: 400 }
        );
      }
      // No price/stock validation needed for variants

      // Get existing product to preserve existing images
      const existingProduct = await getProductById(productId);
      if (!existingProduct) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      // Support multiple images for update
      let finalImageUrls: string[] = [];
      const oldImageUrls = Array.isArray(existingProduct.image_url)
        ? existingProduct.image_url
        : existingProduct.image_url
        ? [existingProduct.image_url]
        : [];

      // Use all kept images directly
      finalImageUrls = [...existingImages];

      // Upload new images to Cloudinary and add to finalImageUrls
      if (images && images.length > 0) {
        try {
          for (const image of images) {
            if (image && image.size > 0) {
              const { url } = await uploadImageToCloudinary(image);
              finalImageUrls.push(url);
            }
          }
        } catch (error) {
          return NextResponse.json(
            { error: "Failed to upload image" },
            { status: 500 }
          );
        }
      }

      // Delete only images that were removed from the array
      const removedImages = oldImageUrls.filter(
        (url: string) => !finalImageUrls.includes(url)
      );
      for (const oldUrl of removedImages) {
        try {
          const publicId = extractPublicIdFromUrl(oldUrl);
          if (publicId) {
            await deleteImageFromCloudinary(publicId);
          }
        } catch (error) {
          // Continue with product update even if image deletion fails
        }
      }

      // Update product in database
      const productData = {
        name,
        category,
        description: description || null,
        image_url: finalImageUrls.length > 0 ? finalImageUrls : null,
        variants,
      };

      try {
        const product = await updateProduct(productId, productData);
        return NextResponse.json({
          success: true,
          product,
          message: "Product updated successfully",
        });
      } catch (error: any) {
        // Log full error details from Supabase/Postgres
        return NextResponse.json(
          {
            error: error?.message || "Internal server error",
            details: error?.details,
            code: error?.code,
          },
          { status: 500 }
        );
      }
    } // Close the FormData processing block
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and admin permissions
    const supabase = await createRouteHandler();
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
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const productId = params.id;

    // Get existing product to delete images from Cloudinary
    const existingProduct = await getProductById(productId);
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete image from Cloudinary if it exists
    if (existingProduct.image_url) {
      try {
        // Extract public_id from Cloudinary URL properly
        const publicId = extractPublicIdFromUrl(existingProduct.image_url);
        if (publicId) {
          await deleteImageFromCloudinary(publicId);
        }
      } catch (error) {
        // Continue with product deletion even if image deletion fails
      }
    }

    // Delete product from database
    await deleteProduct(productId);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
