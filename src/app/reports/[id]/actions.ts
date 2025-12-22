"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function loadReportData(id: string) {
  const supabase = await createClient()

  const { data: report } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single()

  const { data: comments } = await supabase
    .from("comments")
    .select("id, content, user_id, created_at")
    .eq("report_id", id)
    .order("created_at", { ascending: true })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { report, comments, user }
}

/* -------------------------------------------------------
   ★ 日報削除機能（本人のみ削除可能）
------------------------------------------------------- */
export async function deleteReport(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("reports")
    .delete()
    .eq("id", id)

  console.log("DELETE RESULT:", data)
  console.error("DELETE ERROR:", error)

  if (error) {
    throw new Error("削除に失敗しました")
  }

  redirect("/reports")
}

