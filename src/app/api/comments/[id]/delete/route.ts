export const dynamic = "force-dynamic"
export const revalidate = 0

import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params
  console.log("🔥 API params:", id)

  const numericId = Number(id)

  if (isNaN(numericId)) {
    return NextResponse.json(
      { error: "Invalid ID" },
      { status: 400 }
    )
  }

  // ★ ここが最重要：サーバー用 Supabase クライアント
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