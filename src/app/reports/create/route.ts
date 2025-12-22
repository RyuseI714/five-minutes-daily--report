import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("CREATE API HIT", body)

    const { author, title, content, status, progress, image_url } = body

    const { error } = await supabase.from("reports").insert({
      author,
      title,
      content,
      status,
      progress,
      image_url,   // ✅ これが無いと絶対に保存されない
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