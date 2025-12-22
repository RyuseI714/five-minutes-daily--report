import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

// 型定義
type Report = {
  id: number
  author: string | null
  title: string
  content: string
  image_url: string | null
  status: string
  progress: number
  created_at: string
  updated_at: string
}

export default async function ReportsPage() {
  const reports = await loadReports()

  return (
    <main className="p-6 space-y-6">
      {/* タイトル + 新規作成ボタン */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">日報一覧</h1>

        <Link
          href="/reports/new"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          ＋ 新規作成
        </Link>
      </div>

      {/* 一覧 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Link
            key={report.id}
            href={`/reports/${report.id}`}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border"
          >
            {report.image_url ? (
              <img
                src={report.image_url}
                alt={report.title}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}

            <div className="p-4 space-y-2">
              <h2 className="text-lg font-semibold line-clamp-1">
                {report.title}
              </h2>

              <p className="text-sm text-gray-600 line-clamp-2">
                {report.content}
              </p>

              <p className="text-xs text-gray-400">
                {new Date(report.created_at).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}

/* -------------------------------------------------------
   ★ Supabase を呼ぶ処理は Server Action にまとめる
------------------------------------------------------- */
async function loadReports(): Promise<Report[]> {
  "use server"

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Report[]>()

  if (error) {
    console.error(error)
    return []
  }

  return data ?? []
}