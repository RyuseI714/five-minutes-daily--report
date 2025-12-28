"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function DeleteReportButton({ reportId }: { reportId: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

 const handleDelete = async () => {
  if (!confirm("このレポートを削除しますか？")) return

  console.log("DELETE START", reportId, "type:", typeof reportId)

  setLoading(true)

  const { data, error } = await supabase
    .from("reports")
    .delete()
    .eq("id", Number(reportId))
    .select()

  console.log("DELETE RESULT", { data, error })

  setLoading(false)

  if (error) {
    alert("削除に失敗しました")
    console.error(error)
    return
  }

  router.push("/reports")
}

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
    >
      {loading ? "削除中..." : "レポートを削除"}
    </button>
  )
}