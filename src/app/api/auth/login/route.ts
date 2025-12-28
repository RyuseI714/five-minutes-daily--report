import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function POST(req: Request) {
  const supabase = await createClient()
  const formData = await req.formData()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return new Response(error.message, { status: 400 })
  }

  return redirect("/reports")
}