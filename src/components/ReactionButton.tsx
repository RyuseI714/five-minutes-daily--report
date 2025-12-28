"use client"

import { useTransition } from "react"

export function ReactionButton({
  reportId,
  reacted,
}: {
  reportId: string
  reacted: boolean
}) {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      await fetch(`/reports/${reportId}/reaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "like" }),
      })

      // ★ これが UI を更新する
      location.reload()
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`text-2xl transition transform ${
        reacted
          ? "opacity-100 text-green-600 scale-110"
          : "opacity-40 text-gray-400 scale-100"
      }`}
    >
      ✅
    </button>
  )
}