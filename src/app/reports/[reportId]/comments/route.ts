/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { redirect } from "next/navigation"

export async function POST(req: Request) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    }
  )

  const url = new URL(req.url)
  const reportId = Number(url.pathname.split("/")[2])

  const formData = await req.formData()
  const content = formData.get("content")

  const { data: user } = await supabase.auth.getUser()
  console.log("USER:", user)

  if (!user.user) {
    console.log("NO USER → redirect to login")
    return redirect("/login")
  }

  const { error } = await supabase.from("comments").insert({
    report_id: reportId,
    user_id: user.user.id,
    content,
  })

  console.log("INSERT ERROR:", error)

  return redirect(`/reports/${reportId}`)
}