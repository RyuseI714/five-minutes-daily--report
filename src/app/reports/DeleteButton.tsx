"use client"

import { useRouter } from "next/navigation"

export default function DeleteButton({
  id,
  type,
}: {
  id: number
  type: "report" | "comment"
}) {
  const router = useRouter()

  const handleDelete = async () => {
    const endpoint =
      type === "report"
        ? `/api/reports/delete/${id}`
        : `/api/comments/delete/${id}`

    await fetch(endpoint, {
      method: "POST",
    })

    router.refresh() // ★ これが正しい
  }

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
    >
      削除
    </button>
  )
}