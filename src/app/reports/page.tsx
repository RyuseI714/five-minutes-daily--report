export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"
export const runtime = "nodejs"

import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import DeleteButton from "./DeleteButton"

type Report = {
  id: number
  author: string | null
  author_name: string | null
  title: string
  content: string
  image_url: string | null
  status: string
  progress: number
  created_at: string
  updated_at: string
  user_id: string | null   // ← これも必要
}

const statusColor: Record<string, string> = {
  todo: "bg-[#EFF6FF] text-[#3B82F6] border-[#BFDBFE]",
  doing: "bg-[#FEF9C3] text-[#CA8A04] border-[#FDE68A]",
  done: "bg-[#DFF8DA] text-[#3F6B4F] border-[#A7E8A0]",
}

export default async function ReportsPage() {
  const supabase = await createClient()

  // ★ ログイン中のユーザーを取得
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const reports = await loadReports()

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-12 text-[#171717] bg-white">
      {/* ヘッダー */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">日報一覧</h1>
        <p className="text-sm text-[#6B7280]">
          毎日の積み重ねが成長につながる ✨
        </p>
      </div>

      {/* 新規作成ボタン */}
      <div className="flex justify-end">
        <Link
          href="/reports/new"
          className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg shadow hover:bg-[#2563EB] transition text-sm font-medium"
        >
          ＋ 新規作成
        </Link>
      </div>

      {/* 一覧グリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="
              bg-[#F7F5EF]
              rounded-xl
              border border-[#D9D2C3]/60
              shadow-sm hover:shadow-md
              transition
              overflow-hidden
            "
          >
            {/* カード本体 */}
            <Link href={`/reports/${report.id}`}>
              {report.image_url ? (
                <img
                  src={report.image_url}
                  alt={report.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-50 flex items-center justify-center text-[#6B7280] text-sm italic">
                  画像はありません 📄
                </div>
              )}

              <div className="p-5 space-y-4">
                <h2 className="text-lg font-semibold mb-2 line-clamp-1">
                  {report.title}
                </h2>

                <p className="text-sm text-[#6B7280] line-clamp-2">
                  {report.content}
                </p>

                <div className="text-sm text-[#6B7280] flex items-center gap-2">
                  <span>{new Date(report.created_at).toLocaleString()}</span>
                  <span>・</span>
                  <span>投稿者: {report.author_name ?? "不明"}</span>
                </div>

                <div className="pt-2">
                  <span
                    className={`
                      inline-block px-2 py-1 rounded-full text-xs font-medium border
                      ${statusColor[report.status]}
                    `}
                  >
                    {report.status}
                  </span>
                </div>
              </div>
            </Link>

            {/* ★ 自分の投稿だけ削除ボタンを表示 */}
            <div className="p-4 border-t flex justify-end">
              {report.user_id === user?.id && (
                <DeleteButton id={report.id} type="report" />
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

async function loadReports(): Promise<Report[]> {
  "use server"

  const supabase = await createClient()

  const { data: reports, error } = await supabase
    .from("reports")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .throwOnError()

  if (error || !reports) {
    console.error(error)
    return []
  }

  return reports as Report[]
}