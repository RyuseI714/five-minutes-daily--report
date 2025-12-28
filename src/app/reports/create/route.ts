import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("CREATE API HIT", body)

    const { title, content, status, progress, image_url } = body

    // ★ ログイン中のユーザーを取得
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // ★ author は body から受け取らず、user.id を使う
    const { error } = await supabase.from("reports").insert({
      author: user.id,
      title,
      content,
      status,
      progress,
      image_url,
    })

    if (error) {
      console.error("SUPABASE ERROR", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "ok" })
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
}