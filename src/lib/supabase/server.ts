import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function createClient() {
  const cookieStore = await cookies() // ← ★ Next.js 15 では await が必須

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // ★ ページ内では Cookie を書き換えない（Next.js 15 の制限）
        set() {},
        remove() {},
      },
    }
  )
}
