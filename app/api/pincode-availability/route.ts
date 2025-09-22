import { NextRequest, NextResponse } from "next/server"
import { createGenericClient } from "@/lib/database/supabase"
import type { Database } from "@/lib/database/database.types"

export async function GET(req: NextRequest) {
  const pincode = req.nextUrl.searchParams.get("pincode")
  if (!pincode || !/^[0-9]{6}$/.test(pincode)) {
    return NextResponse.json({ available: false, error: "Invalid pincode" }, { status: 400 })
  }

  const supabase = createGenericClient()
  const { data, error } = await supabase
    .from("delivery_address")
    .select("id,delivery_charge")
    .eq("pincode", pincode)
    .maybeSingle<Database['public']['Tables']['delivery_address']['Row']>()

  if (error) {
    return NextResponse.json({ available: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ available: !!data, delivery_charge: data?.delivery_charge ?? 0 })
}
