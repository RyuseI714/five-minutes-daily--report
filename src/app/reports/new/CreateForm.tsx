"use client"

import { useState } from "react"

export default function CreateForm() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [image, setImage] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", content)
    if (image) formData.append("image", image)

   await fetch("/api/reports/create", {
  method: "POST",
  body: formData,
})

    window.location.href = "/reports"
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-10 text-[#171717]">
      {/* ヘッダー */}
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">デイリーレポート</h1>
        <p className="text-sm text-[#6B7280]">
          今日の努力を5分で共有✨
        </p>
      </header>

      {/* 投稿セクション */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold">日報を投稿</h2>
        <p className="text-sm text-[#6B7280]">
          今日の頑張りを共有しましょう ✨
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* タイトル */}
          <div className="space-y-2">
            <label className="text-sm font-medium">タイトル</label>
            <input
              type="text"
              placeholder="今日のタイトルを入力..."
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg bg-white text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 本文 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">今日の成果</label>
            <textarea
              placeholder="今日達成したことを記録しましょう..."
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg bg-white text-sm h-32 resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* 画像 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">画像を添付</label>
            <input
              type="file"
              accept="image/png, image/jpeg, image/gif"
              className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg bg-white text-sm"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-[#6B7280]">
              PNG, JPG, GIF (MAX. 5MB)
            </p>
          </div>

          {/* 投稿ボタン */}
          <button
            type="submit"
            className="w-full bg-[#3B82F6] text-white px-4 py-2 rounded-lg shadow hover:bg-[#2563EB] transition text-sm font-medium"
          >
            投稿する
          </button>

<button
  type="button"
  onClick={() => (window.location.href = "/reports")}
  className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
>
  一覧ページへ戻る
</button>
        </form>
      </section>
    </main>
  )
}