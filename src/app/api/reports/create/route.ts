import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()

  // ★ 通常の Supabase クライアント（セッション用）
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

  // ★ 認証ユーザー取得（ID だけ使う）
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  // ★ 最新のユーザー情報を取得（ここが最重要）
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // ← .env に入っているはず
  )

  const { data: fullUser } = await admin.auth.admin.getUserById(user.id)

  const displayName = fullUser?.user?.user_metadata?.full_name ?? "名無し"

  // ★ CreateForm から送られてくる FormData を受け取る
  const formData = await req.formData()
  const title = formData.get("title") as string
  const content = formData.get("content") as string

  // ★ INSERT
  const { error } = await supabase.from("reports").insert({
    title,
    content,
    user_id: user.id,
    author: user.id,
    author_name: displayName,
  })

  if (error) {
    console.error("INSERT ERROR:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}