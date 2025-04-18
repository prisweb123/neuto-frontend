"use client"

import { UserPlus } from "lucide-react"

interface UserTableHeaderProps {
  onAddUser: () => void
}

export default function UserTableHeader({ onAddUser }: UserTableHeaderProps) {
  return (
    <div className="p-6 flex justify-between items-center border-b">
      <h2 className="text-lg font-medium">Roller</h2>
      <button className="p-2 rounded-full hover:bg-gray-100" onClick={onAddUser}>
        <UserPlus className="h-5 w-5" />
      </button>
    </div>
  )
}

