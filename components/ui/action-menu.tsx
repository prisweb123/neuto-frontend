"use client"

import type React from "react"
import { Fragment, useState } from "react"
import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface ActionMenuItem {
  label: string
  onClick: () => void
  color?: string
  requireConfirm?: boolean
  confirmTitle?: string
  confirmDescription?: string
}

interface ActionMenuProps {
  items: ActionMenuItem[]
}

export default function ActionMenu({ items }: ActionMenuProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    onConfirm: () => void
    description?: string
  } | null>(null)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <MoreVertical className="h-5 w-5 text-gray-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className="w-48"
        style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
      >
        {items.map((item, index) => (
          <Fragment key={index}>
            <DropdownMenuItem
              onClick={() => {
                if (item.requireConfirm) {
                  setConfirmDialog({
                    isOpen: true,
                    onConfirm: item.onClick,
                    description: item.confirmDescription
                  })
                } else {
                  item.onClick()
                }
              }}
              className={item.color || "text-gray-700"}
            >
              {item.label}
            </DropdownMenuItem>
            {index < items.length - 1 && <DropdownMenuSeparator />}
          </Fragment>
        ))}
      </DropdownMenuContent>
      {confirmDialog && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog(null)}
          onConfirm={() => {
            confirmDialog.onConfirm()
            setConfirmDialog(null)
          }}
          description={confirmDialog.description}
        />
      )}
    </DropdownMenu>
  )
}