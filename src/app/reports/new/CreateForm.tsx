"use client"

export default function CreateForm() {
  return (
    <form action="/api/reports/create" method="POST">
      <input
        type="text"
        name="title"
        placeholder="タイトル"
        className="border p-2"
      />
      <input
        type="text"
        name="author"
        placeholder="作成者"
        className="border p-2"
      />
      <textarea
        name="content"
        placeholder="内容"
        className="border p-2"
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        登録
      </button>
    </form>
  )
}