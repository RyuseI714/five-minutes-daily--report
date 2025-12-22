import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const formData = await req.formData()

  const report_id = Number(formData.get("report_id"))
  const author = String(formData.get("author") || "")
  const content = String(formData.get("content") || "")

  const { error } = await supabase
    .from("comments")
    .insert({
      report_id,
      author,
      content,
    })

  if (error) {
    console.error("COMMENT INSERT ERROR", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.redirect(
    new URL(`/reports/${report_id}`, req.url),
    { status: 303 }
  )
}