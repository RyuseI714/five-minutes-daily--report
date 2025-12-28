"use client"

import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const login = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    // 成功したらトップへ
    if (res.ok) {
      window.location.href = "/reports"
      return
    }

    // リダイレクト対応（必要なら）
    if (res.redirected) {
      window.location.href = res.url
      return
    }

    // エラー時だけ JSON を読む
    const { error } = await res.json()
    alert("ログイン失敗: " + error)
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">ログイン</h1>

      <input
        type="email"
        placeholder="メールアドレス"
        className="w-full p-3 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="パスワード"
        className="w-full p-3 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={login}
        className="w-full p-3 bg-blue-600 text-white rounded"
      >
        ログイン
      </button>
    </main>
  )
}