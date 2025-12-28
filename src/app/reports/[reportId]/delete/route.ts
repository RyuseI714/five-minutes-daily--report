export const dynamic = "force-dynamic"
export const revalidate = 0

import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const numericId = Number(id)
  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", numericId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}