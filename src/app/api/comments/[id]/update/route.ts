import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const body = await req.formData()

  const author = body.get("author")
  const content = body.get("content")

  const { error } = await supabase
    .from("comments")
    .update({ author, content })
    .eq("id", Number(id))

  if (error) {
    console.error("COMMENT UPDATE ERROR", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 元のレポートに戻る
  const reportId = req.headers.get("referer")?.split("/reports/")[1]?.split("/")[0]
  return NextResponse.redirect(new URL(`/reports/${reportId}`, req.url))
}