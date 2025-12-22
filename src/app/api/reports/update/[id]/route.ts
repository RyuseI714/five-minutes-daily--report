import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const body = await req.formData()

  const title = body.get("title")
  const author = body.get("author")
  const content = body.get("content")

  const { error } = await supabase
    .from("reports")
    .update({ title, author, content })
    .eq("id", Number(id))

  if (error) {
    console.error("UPDATE ERROR", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.redirect(new URL(`/reports/${id}`, req.url))
}