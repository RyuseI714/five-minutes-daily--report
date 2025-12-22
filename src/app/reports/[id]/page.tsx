import Link from "next/link"
import { loadReportData } from "./actions"
import DebugUser from "./_components/DebugUser"
import CommentForm from "./_components/CommentForm"

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { report, comments, user } = await loadReportData(id)

  if (!report) return <p>データが見つかりませんでした</p>

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-8">
      {/* ← 一覧に戻る */}
      <Link href="/reports" className="text-blue-500 underline text-sm">
        ← 一覧に戻る
      </Link>

      <DebugUser user={user} author={report.author} />

      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{report.title}</h1>

        {user && user.id === report.author && (
          <form action={`/reports/${id}/delete`} method="POST">
            <button
              type="submit"
              className="text-red-500 text-sm underline"
            >
              日報を削除する
            </button>
          </form>
        )}

        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="px-3 py-1 rounded-full bg-gray-100 border">
            {report.status}
          </span>
          <span className="text-gray-400">
            {new Date(report.created_at).toLocaleString()}
          </span>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${report.progress}%` }}
          />
        </div>
      </header>

      {report.image_url && (
        <img
          src={report.image_url}
          alt={report.title}
          className="w-full rounded-xl shadow-sm"
        />
      )}

      <article className="prose prose-neutral max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">
        {report.content}
      </article>

      <section className="mt-10 border-t pt-6 space-y-4">
        <h2 className="text-lg font-semibold mb-4">コメント</h2>

        {comments && comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.id} className="border p-3 rounded bg-gray-50 relative">
              <p className="text-gray-800 whitespace-pre-wrap">{c.content}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(c.created_at).toLocaleString()}
              </p>

              {user && user.id === c.user_id && (
                <form action={`/reports/${id}/delete-comment`} method="POST">
                  <input type="hidden" name="commentId" value={c.id} />
                  <button
                    type="submit"
                    className="text-red-500 text-xs absolute top-2 right-2"
                  >
                    削除
                  </button>
                </form>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">まだコメントはありません</p>
        )}
      </section>

      <CommentForm reportId={report.id} />
    </main>
  )
}