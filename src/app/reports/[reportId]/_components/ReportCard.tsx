"use client"

import Link from "next/link"

export default function ReportCard({ report }: { report: any }) {
  return (
    <Link
      href={`/reports/${report.id}`}
      className="block rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow p-6 space-y-4 border border-gray-100"
    >
      {/* 画像（あれば） */}
      {report.image_url && (
        <img
          src={report.image_url}
          alt={report.title}
          className="w-full aspect-video object-cover rounded-xl"
        />
      )}

      {/* タイトル */}
      <h2 className="text-xl font-semibold text-gray-900 leading-snug line-clamp-2">
        {report.title}
      </h2>

      {/* 成果（本文の冒頭だけ） */}
      <p className="text-sm text-gray-700 line-clamp-3 whitespace-pre-wrap">
        {report.content}
      </p>

      {/* 投稿者・日付 */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{report.author_name ?? "不明"}</span>
        <span>{new Date(report.created_at).toLocaleDateString()}</span>
      </div>

      {/* ステータスタグ */}
      <span className="inline-block text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
        {report.status}
      </span>

      {/* 進捗バー */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all"
          style={{ width: `${report.progress}%` }}
        />
      </div>
    </Link>
  )
}