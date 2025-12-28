/* eslint-disable */

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function POST(req: Request, context: any) {
  const reportId = Number(context.params.reportId)
  const supabase = await createClient()

  // 画像削除
  await supabase
    .from("reports")
    .update({ image_url: null })
    .eq("id", reportId)

  return redirect(`/reports/${reportId}`)
}