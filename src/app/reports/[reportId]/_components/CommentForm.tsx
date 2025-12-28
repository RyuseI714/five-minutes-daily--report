"use client"

import { useState } from "react"

export default function CommentForm({ reportId }: { reportId: number }) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!content.trim()) return

    setLoading(true)

    const formData = new FormData()
    formData.append("content", content)

    // 🔥 正しい API パスに POST
    const res = await fetch(`/api/reports/${reportId}/comments`, {
      method: "POST",
      body: formData,
    })

    setLoading(false)
    setContent("")

    // 🔥 POST 成功時のみリロード
    if (res.ok) {
      window.location.reload()
    } else {
      console.error("コメント送信失敗:", await res.text())
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-4">
      <textarea
        className="w-full p-3 border border-gray-300 rounded-xl h-28 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800"
        placeholder="コメントを入力してください..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={submit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold shadow hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "送信中..." : "コメントを投稿する"}
      </button>
    </div>
  )
}