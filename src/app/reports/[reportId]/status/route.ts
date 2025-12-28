/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { redirect } from "next/navigation"

export async function POST(req: Request, context: any) {
  const id = Number(context.params.reportId)

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

  const formData = await req.formData()
  const status = formData.get("status")

  if (typeof status !== "string") {
    return redirect(`/reports/${id}`)
  }

  const { error } = await supabase
    .from("reports")
    .update({ status })
    .eq("id", id)

  console.log("UPDATE ERROR:", error)

  return redirect(`/reports/${id}`)
}