"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"   // ✅ 追加

export default function NewReportPage() {
  const router = useRouter()  // ✅ 追加

  const [author, setAuthor] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const submit = async () => {
    let imageUrl = null

    if (imageFile) {
      const ext = imageFile.name.split(".").pop()
      const safeBaseName =
        imageFile.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "") ||
        "image"

      const fileName = `${Date.now()}-${safeBaseName}.${ext}`

      const { data, error } = await supabase.storage
        .from("report-images")
        .upload(fileName, imageFile)

      if (!error) {
        const { data: publicUrlData } = supabase.storage
          .from("report-images")
          .getPublicUrl(fileName)

        imageUrl = publicUrlData.publicUrl
      }
    }

    const res = await fetch("/api/reports/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author,
        title,
        content,
        status: "todo",
        progress: 0,
        image_url: imageUrl ?? null,
      }),
    })

    const json = await res.json()
    console.log(json)
    alert("登録完了")
  }

  return (
    <main className="p-6 space-y-4">

      {/* ✅ 一覧に戻るボタン */}
      <button
        onClick={() => router.push("/reports")}
        className="px-3 py-1 text-sm bg-blue-200 rounded hover:bg-gray-300"
      >
        一覧に戻る
      </button>

      <h1 className="text-2xl font-bold">日報を作成</h1>

      <input
        className="border p-2 w-full"
        placeholder="記入者"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        placeholder="タイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 w-full h-40"
        placeholder="内容"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null
          setImageFile(file)
          setPreviewUrl(file ? URL.createObjectURL(file) : null)
        }}
        className="border p-2 w-full"
      />

      {previewUrl && (
        <img
          src={previewUrl}
          alt="プレビュー"
          className="mt-4 max-h-60 rounded border"
        />
      )}

      <button
        onClick={submit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        登録
      </button>
    </main>
  )
}