"use client"

import { supabase } from "@/lib/supabase/client"

export default function UpdateUser() {
  async function update() {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        name: "竜生",
      },
    })

    console.log("UPDATED:", data, error)
  }

  return (
    <button onClick={update} className="p-4 bg-blue-500 text-white">
      Update User Metadata
    </button>
  )
}