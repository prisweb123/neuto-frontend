"use client"

import { MoreHorizontal } from "lucide-react"
import Image from "next/image"
import ActionMenu from "@/components/ui/action-menu"
import { useMemo } from "react"

interface ProductCardProps {
  name: string
  description: string
  image: string
  price: number
  discount?: number
  campaign?: string
  include: string
  info: string
  onEdit?: () => void
  onDelete?: () => void
}

export default function ProductCard({
  name,
  description,
  image,
  price,
  discount,
  campaign,
  include,
  info,
  onEdit,
  onDelete,
}: ProductCardProps) {

  const features = useMemo(() => {
    if (include) {
      return include[0]
        .split("\n")
        .map((line) => line.replace(/^[•\s]+/, "").trim())
        .filter((line) => line.length > 0)
    }
    return []
  }, [include])

  return (
    <div className="bg-white rounded-lg border p-6 relative">
      <div className="flex mb-4">
        <div className="w-16 h-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={64}
            height={64}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium text-lg">{name}</h3>
              {description && <p className="text-sm text-gray-600">{description}</p>}
            </div>
            <div className="text-right">
              {discount ? (
                <>
                  <div className="text-gray-500 line-through text-sm">Kr {price.toLocaleString()},-</div>
                  <div className="text-red-500">Kr {(price-discount).toLocaleString()},-</div>
                </>
              ) : (
                <div>
                  Kr {price.toLocaleString()}
                  {price % 1 === 0 ? ",-" : ""}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {campaign && (
        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded absolute top-2 left-2">{campaign}</div>
      )}

      {include ? (
         <ul className="mt-2 space-y-1 text-sm">
         {features.map((feature, index) => <li key={index} className="flex items-start">
           <span className="mr-1">•</span>
           <span>{feature}</span>
         </li>)}
       </ul>
      ) : info ? (
        <p className="mt-4 text-gray-700">{info}</p>
      ) : null}

      <div className="absolute bottom-4 right-4">
        <ActionMenu
          items={[
            {
              label: "Endre",
              onClick: onEdit || (() => { }),
            },
            {
              label: "Slett",
              onClick: onDelete || (() => { }),
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

