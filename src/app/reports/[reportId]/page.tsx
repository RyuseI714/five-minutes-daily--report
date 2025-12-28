/* eslint-disable */

import DeleteButton from "../DeleteButton"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ReactionButton } from "@/components/ReactionButton"
import { CommentForm } from "@/components/CommentForm"

type ReactionUser = {
  id: number
  user_id: string
  user_name: string
}

export default async function ReportDetailPage({ params }: any) {
  const reportId = params.reportId
  const supabase = await createClient()

  // ★ レポート本体
  const { data: report, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", reportId)
    .single()

  // ★ コメント一覧
  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("report_id", reportId)
    .order("created_at", { ascending: true })

  // ★ ログインユーザー
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("page user =", user)

  // ★ 本文への自分のリアクション
  const { data: reportReactionRaw } = await supabase
    .from("report_reactions")
    .select("id")
    .eq("report_id", reportId)
    .eq("user_id", user?.id ?? "")
    .maybeSingle()

  const reportReaction = !!reportReactionRaw

  // ★ 本文リアクションを押したユーザー一覧
  const { data: reactionUsers } = await supabase
    .from("report_reactions")
    .select("id, user_id, user_name")
    .eq("report_id", reportId)

  // ★ コメントへの自分のリアクション一覧
  const { data: commentReactions } = await supabase
    .from("comment_reactions")
    .select("comment_id")
    .eq("user_id", user?.id ?? "")

  if (error || !report) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-bold">レポートが見つかりませんでした</h1>
      </main>
    )
  }

  return (
    <main className="p-6 space-y-10 text-[#171717]">
      {/* ← 一覧に戻る */}
      <Link
        href="/reports"
        className="inline-block text-sm text-[#3B82F6] hover:underline"
      >
        ← 一覧に戻る
      </Link>

      {/* タイトル */}
      <div className="bg-white p-4 rounded-xl border border-[#D9D2C3]/50 shadow-sm">
        <h1 className="text-2xl font-bold text-[#171717]">{report.title}</h1>
      </div>

      {/* 画像 */}
      {report.image_url && (
        <img
          src={report.image_url}
          alt={report.title}
          className="w-full max-w-xl rounded-lg"
        />
      )}

      {/* 本文 */}
      <div className="bg-white p-6 rounded-xl border border-[#DDEEE0]">
        <p className="text-[#171717] whitespace-pre-line leading-relaxed">
          {report.content}
        </p>

        {/* ★ 本文リアクションボタン */}
        <div className="mt-4 flex justify-end">
          <ReactionButton reportId={report.id} reacted={reportReaction} />
        </div>
      </div>

      {/* ★ リアクションしたユーザー一覧 */}
      <div className="mt-4 bg-white p-4 rounded-xl border border-[#D9D2C3]/50 shadow-sm">
        <h3 className="text-sm font-semibold text-[#5A5448] mb-2">
          リアクションしたユーザー
        </h3>

        {reactionUsers && reactionUsers.length > 0 ? (
          <ul className="text-sm text-[#171717] space-y-1">
            {reactionUsers.map((r) => (
              <li key={r.id}>{r.user_name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-500">まだ誰もリアクションしていません。</p>
        )}
      </div>

      {/* ステータス表示 */}
      <span
        className={`
          inline-block px-2 py-1 rounded-full text-xs font-medium border
          ${
            report.status === "todo"
              ? "bg-[#EFF6FF] text-[#3B82F6] border-[#BFDBFE]"
              : report.status === "doing"
              ? "bg-[#FEF9C3] text-[#CA8A04] border-[#FDE68A]"
              : "bg-[#DFF8DA] text-[#3F6B4F] border-[#A7E8A0]"
          }
        `}
      >
        {report.status}
      </span>

      {/* ステータス変更ボタン */}
      <form
        action={`/reports/${report.id}/status`}
        method="POST"
        className="space-x-2 mt-2"
      >
        {["todo", "doing", "done"].map((s) => (
          <button
            key={s}
            name="status"
            value={s}
            className={`
              px-3 py-1 rounded-full text-xs font-medium border transition
              ${
                report.status === s
                  ? "opacity-100"
                  : "bg-white text-[#6B7280] border-[#D1D5DB] hover:bg-[#F3F4F6]"
              }
            `}
          >
            {s}
          </button>
        ))}
      </form>

      {/* コメント欄 */}
      <section className="bg-[#add8e6]/40 p-6 rounded-xl border border-[#DDEEE0] space-y-6">
        <div className="bg-[#F7F5EF]/100 px-4 py-2 rounded-lg">
          <h2 className="text-lg font-semibold text-[#5A5448]">コメント</h2>
        </div>

        {/* コメント一覧 */}
        <div className="space-y-4">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F7F5EF] flex items-center justify-center text-[#5A5448] font-semibold">
                  {comment.author_name?.charAt(0) ?? "?"}
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#D9D2C3]/50 shadow-sm max-w-[80%]">
                  <div className="text-sm font-semibold text-[#5A5448] mb-1">
                    {comment.author_name ?? "不明"}
                  </div>

                  <p className="text-[#171717] whitespace-pre-line leading-relaxed">
                    {comment.content}
                  </p>

                  <div className="text-xs text-[#6B7280] mt-2 flex justify-between">
                    <span>{new Date(comment.created_at).toLocaleString()}</span>
                  </div>

                  {comment.user_id === user?.id && (
                    <div className="mt-2 flex justify-end">
                      <DeleteButton id={comment.id} type="comment" />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-[#6B7280] bg-white p-4 rounded-xl border border-[#D9D2C3]/50 shadow-sm">
              コメントはまだありません。
            </div>
          )}
        </div>

        <CommentForm reportId={report.id} />
      </section>
    </main>
  )
}