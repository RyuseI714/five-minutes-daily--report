"use client"

import { supabase } from "@/lib/supabase/client"

export default function LoginPage() {
  const login = async () => {
    await supabase.auth.signInWithPassword({
      email: "test@example.com",
      password: "password",
    })
    window.location.href = "/"
  }

  return (
    <button onClick={login} className="p-3 bg-blue-600 text-white rounded">
      ログイン
    </button>
  )
}