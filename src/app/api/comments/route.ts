/* eslint-disable */

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function POST(req: Request) {
  const supabase = await createClient()

  const formData = await req.formData()
  const reportId = Number(formData.get("report_id"))
  const content = formData.get("content")

  if (!reportId || typeof content !== "string") {
    return redirect(`/reports/${reportId}`)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  await supabase.from("comments").insert({
    report_id: reportId,
    content,
    user_id: user.id,
    author_name: user.user_metadata?.full_name ?? "名無し",
  })

  return redirect(`/reports/${reportId}`)
}