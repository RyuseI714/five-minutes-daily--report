export const dynamic = "force-dynamic"
export const revalidate = 0

import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> } // ✅ Promise として受け取る
) {
  const { id } = await ctx.params              // ✅ await が必須
  console.log("🔥 API params:", id)

  const numericId = Number(id)

  if (isNaN(numericId)) {
    return NextResponse.json(
      { error: "Invalid ID" },
      { status: 400 }
    )
  }

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", numericId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}