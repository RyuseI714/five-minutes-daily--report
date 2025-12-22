"use client"

import { useState } from "react"
import { supabase} from "@/lib/supabase/client"

export default function ImageDeleteButton({
  reportId,
  imageUrl,
}: {
  reportId: number
  imageUrl: string
}) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm("画像を削除しますか？")) return

    setLoading(true)

    // 1. Storage から画像を削除
    const path = imageUrl.split("/").slice(-1)[0] // ファイル名だけ取得
    await supabase.storage.from("report-images").remove([path])

    // 2. DB の image_url を null に更新
    await supabase
      .from("reports")
      .update({ image_url: null })
      .eq("id", reportId)

    setLoading(false)
    location.reload()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
    >
      {loading ? "削除中..." : "画像を削除"}
    </button>
  )
}