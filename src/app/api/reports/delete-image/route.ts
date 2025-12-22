import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { filePath, reportId } = await req.json()

    console.log("DELETE IMAGE API HIT", { filePath, reportId })

    // ✅ Storage 削除
    const { error: storageError } = await supabase
      .storage
      .from("report-images")
      .remove([filePath])

    console.log("STORAGE DELETE ERROR", storageError)

    if (storageError) {
      return NextResponse.json({ error: storageError.message }, { status: 500 })
    }

    // ✅ DB 更新
    const { error: dbError } = await supabase
      .from("reports")
      .update({ image_url: null })
      .eq("id", reportId)

    console.log("DB UPDATE ERROR", dbError)

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ message: "ok" })
  } catch (e) {
    console.error("DELETE IMAGE API CRASH", e)
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
}