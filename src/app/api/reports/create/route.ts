import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    const body = await req.json()
    console.log("CREATE API HIT", body)

    const { title, content, status, progress, image_url } = body

    // ★ サーバー側でログイン中のユーザーを取得
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // ★ author は user.id（UUID）
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

    console.log("CREATE SUCCESS")
    return NextResponse.json({ message: "ok" })
  } catch (e) {
    console.error("CREATE API CRASH", e)
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
}