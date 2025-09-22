import { NextResponse } from "next/server";
import { createClient } from "@/lib/database/supabase";
import { isCurrentUserAdmin } from "@/lib/auth/admin-auth";

export async function GET(request: Request) {
  try {
    // Check if the user is admin based on their email
    const isAdmin = await isCurrentUserAdmin();

    // Also get the profile data to compare
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({
        isAdmin: false,
        error: "No session",
      });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single<{ role: string | null }>();

    return NextResponse.json({
      isAdmin,
      role: profile?.role || null,
      email: session.user.email,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check admin status", isAdmin: false },
      { status: 500 }
    );
  }
}
