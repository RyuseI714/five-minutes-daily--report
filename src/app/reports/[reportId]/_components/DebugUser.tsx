"use client"

export default function DebugUser({
  user,
  author,
}: {
  user: any
  author: string | null
}) {
  return (
    <div className="p-3 bg-gray-100 rounded text-sm text-gray-700 space-y-1">
      <p>ログイン中のユーザーID: {user?.id}</p>
      <p>この日報の author: {author}</p>
    </div>
  )
}