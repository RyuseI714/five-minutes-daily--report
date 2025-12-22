"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

export default function CommentList({ reportId }: { reportId: number }) {
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("report_id", reportId)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setComments(data)
      }

      setLoading(false)
    }

    fetchComments()
  }, [reportId])

  if (loading) return <p>読み込み中...</p>

  if (comments.length === 0)
    return <p className="text-gray-500">まだコメントはありません。</p>

  return (
    <div className="space-y-4 mt-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="border rounded p-3 bg-gray-50 shadow-sm"
        >
          <p className="whitespace-pre-wrap">{comment.content}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(comment.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  )
}