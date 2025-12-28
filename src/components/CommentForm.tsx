"use client"

import { useState } from "react"

export function CommentForm({ reportId }: { reportId: number }) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/comments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report_id: reportId, content }),
      })

      const json = await res.json()
      console.log("コメントAPI status =", res.status)
      console.log("コメントAPI response =", json)

      if (!res.ok) {
        alert("コメント投稿に失敗しました")
        setLoading(false)
        return
      }

      // 成功時
      setContent("")
    } catch (err) {
      console.error("コメント送信エラー:", err)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="コメントを入力..."
        className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg bg-white text-sm resize-none"
      />

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg shadow hover:bg-[#2563EB] transition text-sm font-medium"
      >
        コメントする
      </button>
    </form>
  )
}