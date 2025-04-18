"use client"

import ActionMenu from "@/components/ui/action-menu"

interface ProductCardProps {
  name: string
  campaign?: string
  onEdit?: () => void
  onDelete?: () => void
}

export default function OptionProductCard({
  name,
  campaign,
  onEdit,
  onDelete,
}: ProductCardProps) {

  return (
    <div className="bg-white rounded-lg border p-6 relative">
      <div className="flex mb-4">
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium text-lg">{name}</h3>
            </div>
          </div>
        </div>
      </div>

      {campaign && (
        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded absolute top-2 left-2">{campaign}</div>
      )}

      <div className="absolute bottom-4 right-4">
        <ActionMenu
          items={[
            {
              label: "Endre",
              onClick: onEdit || (() => {}),
            },
            {
              label: "Slett",
              onClick: onDelete || (() => {}),
              color: "text-red-600",
              requireConfirm: true,
              confirmDescription: "Er du sikker på at du ønsker å utføre følgende handling?",
            }
          ]}
        />
      </div>
    </div>
  )
}

