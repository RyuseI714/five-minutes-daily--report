import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const supabase = await createClient()
  const formData = await req.formData()
  const commentId = formData.get("commentId")

  // コメント削除
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)

  if (error) {
    console.error(error)
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 400 })
  }

  // 元のページに戻る
  return NextResponse.redirect(req.headers.get("referer") || "/")
}