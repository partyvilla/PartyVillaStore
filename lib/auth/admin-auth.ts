import { createClient } from "@/lib/database/supabase";

const ADMIN_EMAILS: string[] = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(",").map((email) => email.trim())
  : ["partyvilla.store@gmail.com"];

export async function isAdminByEmail(email: string): Promise<boolean> {
  return ADMIN_EMAILS.includes(email);
}

export async function isCurrentUserAdmin() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return false;
  }

  return isAdminByEmail(session.user.email || "");
}

export async function syncAdminStatus() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return false;
  }

  const isAdmin = await isAdminByEmail(session.user.email || "");

  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: session.user.id,
      role: isAdmin ? "admin" : "customer",
    } as any,
    { onConflict: "user_id" }
  );

  if (error) {
    return false;
  }

  return isAdmin;
}
