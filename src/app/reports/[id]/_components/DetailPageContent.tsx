"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import ImageDeleteButton from "./ImageDeleteButton"
import DeleteReportButton from "./DeleteReportButton"
import CommentForm from "./CommentForm"
import CommentList from "./CommentList"
import { useRouter } from "next/navigation"

export default function DetailPageContent({ id }: { id: string }) {
  const router = useRouter()

  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReport = async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("id", id)
        .single()

      if (!error) setReport(data)
      setLoading(false)
    }

    fetchReport()
  }, [id])

  if (loading) return <p>読み込み中...</p>
  if (!report) return <p>レポートが見つかりません。</p>

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-8">

      {/* ✅ 戻るボタン */}
      <button
        onClick={() => router.push("/reports")}
        className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
      >
        一覧に戻る
      </button>

      {/* ✅ Instagram 風の大きな画像 */}
      {report.image_url && (
        <div>
          <img
            src={report.image_url}
            alt="report image"
            className="w-full rounded-xl object-cover shadow"
          />
          <div className="mt-2">
            <ImageDeleteButton reportId={report.id} imageUrl={report.image_url} />
          </div>
        </div>
      )}

      {/* ✅ Note 風のタイトル・本文 */}
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">{report.title}</h1>

        <p className="text-sm text-gray-500">
          作成日時: {new Date(report.created_at).toLocaleString()}
        </p>

        <p className="whitespace-pre-wrap leading-relaxed text-gray-800">
          {report.content}
        </p>
      </div>

      {/* ✅ 削除ボタン */}
      <DeleteReportButton reportId={report.id} />

      {/* ✅ コメントセクション */}
      <div className="pt-6 border-t space-y-4">
        <h2 className="text-xl font-semibold">コメント</h2>
        <CommentList reportId={report.id} />
        <CommentForm reportId={report.id} />
      </div>

    </main>
  )
}