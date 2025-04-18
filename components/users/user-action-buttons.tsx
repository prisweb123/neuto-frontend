"use client"

interface UserActionButtonsProps {
  onStopAccess: () => void
  onDelete: () => void
}

export default function UserActionButtons({ onStopAccess, onDelete }: UserActionButtonsProps) {
  return (
    <div className="fixed right-10 bottom-10 flex flex-col gap-2 items-end">
      <div className="bg-white p-4 rounded-lg shadow-md border">
        <button
          onClick={onStopAccess}
          className="block w-full text-left py-2 px-4 rounded hover:bg-gray-100 font-medium"
        >
          Stop Access
        </button>
        <button onClick={onDelete} className="block w-full text-left py-2 px-4 rounded hover:bg-gray-100 text-red-500">
          Delete
        </button>
      </div>
    </div>
  )
}

