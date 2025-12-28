import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function POST(
  req: NextRequest,
  context: { params: Record<string, string> }
) {
  const reportId = Number(context.params.reportId)

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const user = session?.user
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 })
  }

  const displayName = user.user_metadata?.full_name ?? "名無し"

  const { data: existing } = await supabase
    .from("report_reactions")
    .select("*")
    .eq("report_id", reportId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (existing) {
    await supabase
      .from("report_reactions")
      .delete()
      .eq("id", existing.id)

    return NextResponse.json({ reacted: false })
  }

  const { data, error } = await supabase
    .from("report_reactions")
    .insert([
      {
        report_id: reportId,
        user_id: user.id,
        user_name: displayName,
      },
    ])
    .select()

  if (error) {
    console.error(error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ reacted: true, data })
}