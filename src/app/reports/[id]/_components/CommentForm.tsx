"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"

export default function CommentForm({ reportId }: { reportId: number }) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)

    // ★ ログイン中のユーザーを取得
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      alert("ログインが必要です")
      setLoading(false)
      return
    }

    // ★ user_id を必ず渡す
    const { error } = await supabase.from("comments").insert({
      report_id: reportId,
      user_id: user.id,
      content,
    })

    if (error) {
      console.error(error)
      alert("コメント投稿に失敗しました")
      setLoading(false)
      return
    }

    setContent("")
    setLoading(false)
    location.reload()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="コメントを入力..."
        className="w-full border rounded p-2"
        rows={3}
      />

      <button
        type="submit"
        disabled={loading}
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "投稿中..." : "コメントを投稿"}
      </button>
    </form>
  )
}