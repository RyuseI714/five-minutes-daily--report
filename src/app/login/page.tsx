"use client"

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">ログイン</h1>

      <form action="/api/auth/login" method="POST" className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="メールアドレス"
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="パスワード"
          className="w-full p-3 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded"
        >
          ログイン
        </button>
      </form>
    </main>
  )
}