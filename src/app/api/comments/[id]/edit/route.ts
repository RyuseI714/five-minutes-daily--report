export const dynamic = "force-dynamic"
export const revalidate = 0

import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params
  const numericId = Number(id)

  const body = await req.json()
  const { content } = body

  const { error } = await supabase
    .from("comments")
    .update({ content })
    .eq("id", numericId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}