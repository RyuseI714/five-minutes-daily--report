/* eslint-disable */

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function PATCH(req: Request, context: any) {
  const id = Number(context.params.id)
  const supabase = await createClient()

  const formData = await req.formData()
  const content = formData.get("content")

  if (typeof content !== "string") {
    return redirect(`/reports/${id}`)
  }

  await supabase
    .from("comments")
    .update({ content })
    .eq("id", id)

  return redirect(`/reports/${id}`)
}