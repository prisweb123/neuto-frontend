"use client"

interface StatusBadgeProps {
  active: boolean
  onClick?: () => void
}

export default function StatusBadge({ active, onClick }: StatusBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={`${active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} text-xs px-3 py-1 rounded-full`}
    >
      {active ? "Aktiv" : "Ikke aktiv"}
    </button>
  )
}

