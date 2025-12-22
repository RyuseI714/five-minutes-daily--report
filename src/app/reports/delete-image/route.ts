import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { filePath, reportId } = await req.json()

    // ✅ 1. Storage から削除
    const { error: storageError } = await supabase
      .storage
      .from("report-images")
      .remove([filePath])

    if (storageError) {
      console.error("STORAGE DELETE ERROR", storageError)
      return NextResponse.json({ error: storageError.message }, { status: 500 })
    }

    // ✅ 2. DB の image_url を null に更新
    const { error: dbError } = await supabase
      .from("reports")
      .update({ image_url: null })
      .eq("id", reportId)

    if (dbError) {
      console.error("DB UPDATE ERROR", dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ message: "ok" })
  } catch (e) {
    console.error("DELETE API CRASH", e)
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
}