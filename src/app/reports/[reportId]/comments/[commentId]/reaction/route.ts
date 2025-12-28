import { createRouteClient } from "@/lib/supabase/route"
import { redirect } from "next/navigation"

export async function POST(req: Request) {
  const supabase = await createRouteClient()

  const url = new URL(req.url)
  const paths = url.pathname.split("/")
  const reportId = Number(paths[2])
  const commentId = Number(paths[4])

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return redirect("/login")

  const { data: existing } = await supabase
    .from("comment_reactions")
    .select("id")
    .eq("comment_id", commentId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (existing) {
    await supabase.from("comment_reactions").delete().eq("id", existing.id)
  } else {
    await supabase.from("comment_reactions").insert({
      comment_id: commentId,
      user_id: user.id,
    })
  }

  return redirect(`/reports/${reportId}`)
}