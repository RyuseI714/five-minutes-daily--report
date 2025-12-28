"use client"

import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = new FormData(e.currentTarget)
    const name = String(form.get("name") || "")
    const email = String(form.get("email") || "")
    const password = String(form.get("password") || "")

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    if (res.ok) {
      router.push("/login") // ← ここでログイン画面へ移動
    } else {
      const { error } = await res.json()
      alert(`登録失敗: ${error}`)
    }
  }

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-6 text-gray-800">新規登録</h1>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">名前</label>
          <input name="name" className="border p-2 w-full rounded text-gray-800" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
          <input name="email" type="email" className="border p-2 w-full rounded text-gray-800" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
          <input name="password" type="password" className="border p-2 w-full rounded text-gray-800" />
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded w-full">登録</button>
      </form>
    </main>
  )
}