import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(
  req: NextRequest,
  context: { params: { reportId: string } }
) {
  const { reportId } = context.params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const body = await req.json()
  const type = body.type ?? "like"

  // 既存リアクションがあるか確認
  const { data: existing } = await supabase
    .from("report_reactions")
    .select("id")
    .eq("report_id", reportId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (existing) {
    // OFF（削除）
    await supabase
      .from("report_reactions")
      .delete()
      .eq("id", existing.id)

    return NextResponse.json({ success: true, toggled: "off" })
  }

  // ON（追加）
  await supabase.from("report_reactions").insert({
  report_id: reportId,
  user_id: user.id,
  user_name: user.user_metadata.full_name ?? "名無し",
  type,
})

  return NextResponse.json({ success: true, toggled: "on" })
}

