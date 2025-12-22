import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  const body = await req.json()
  const { report_id, author, content } = body

  const { data, error } = await supabase
    .from("comments")
    .insert([{ report_id, author, content }])
    .select()

  if (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ data }), { status: 200 })
}