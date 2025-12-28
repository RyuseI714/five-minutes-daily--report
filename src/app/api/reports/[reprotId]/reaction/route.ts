import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function POST(
  req: NextRequest,
  { params }: { params: { reportId: string } }
) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  // セッション取得
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const user = session?.user
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  const reportId = Number(params.reportId)

  // ユーザー名（コメントと同じ仕様）
  const displayName = user.user_metadata?.full_name ?? "名無し"

  // すでにリアクションしているか確認
  const { data: existing } = await supabase
    .from("report_reactions")
    .select("*")
    .eq("report_id", reportId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (existing) {
    // すでにリアクション済み → 削除（トグル）
    await supabase
      .from("report_reactions")
      .delete()
      .eq("id", existing.id)

    return NextResponse.json({ reacted: false })
  }

  // 新規リアクション → user_name を保存
  const { data, error } = await supabase
    .from("report_reactions")
    .insert([
      {
        report_id: reportId,
        user_id: user.id,
        user_name: displayName, // ← これが author_name と同じ役割
      },
    ])
    .select()

  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ reacted: true, data })
}