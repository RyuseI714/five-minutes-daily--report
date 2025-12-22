import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params   // ← ここが重要！

  console.log("DELETE API HIT, id =", id)

  const { error } = await supabase.from("reports").delete().eq("id", Number(id))

  console.log("DELETE RESULT", { error })

  return NextResponse.redirect(new URL("/reports", req.url))
}