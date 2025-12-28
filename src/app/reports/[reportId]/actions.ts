"use server"

import { createClient } from "@/lib/supabase/server"

export async function loadReportData(id: string) {
  const supabase = await createClient()

  // ログインユーザー取得
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ① 日報データを取得（author_name を含む）
  const { data: reportRaw, error: reportError } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .single()

  if (reportError || !reportRaw) {
    console.error("REPORT ERROR:", reportError)
    return { report: null, comments: [], user }
  }

  // ② そのまま返す（users オブジェクト不要）
  const report = {
    ...reportRaw,
  }

  // ③ コメント取得
  const { data: comments, error: commentsError } = await supabase
    .from("comments")
    .select("*")
    .eq("report_id", id)
    .order("created_at", { ascending: true })

  if (commentsError) {
    console.error("COMMENTS ERROR:", commentsError)
  }

  return {
    report,
    comments: comments ?? [],
    user,
  }
}