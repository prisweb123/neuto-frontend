"use client"

import { Trash2, Printer, Copy } from "lucide-react"
import { generatePricePdf } from "../pdf/generate-pdf"
import { calculateTotals, getValidUntilDate } from "../pricing/utils"
import { Offer } from "../pricing/type"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { ConfirmDialog } from "../ui/confirm-dialog"
import { toast } from "sonner"

interface OfferActionsProps {
  offer: Offer
  onDelete: (id: string) => void
}

export default function OfferActions({ offer, onDelete }: OfferActionsProps) {
  const router = useRouter()
  const { user } = useAuth()
  const totals = calculateTotals(offer.selectedPackage ? [offer.selectedPackage] : [], offer.selectedPackage ? offer.selectedPackage._id : '', offer.addedOptionPackages, offer.manualProducts, offer.discount)

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    onConfirm: () => void
    description?: string
  } | null>(null)

  const handleCopy = async () => {
    router.push(`/price-offer?id=${offer._id}`)
  }

  const handlePrint = async () => {
    try {
      const selectedPkg = offer.selectedPackage

      const pdfData = {
        offerNumber: offer.offerNo,
        date: new Date().toLocaleDateString("nb-NO"),
        validUntil: getValidUntilDate(offer.validDays),
        createdBy: offer.createdBy.username,
        terms: offer.terms || "",
        discount: offer.discount,
        VatValue: totals.VATValue,
        total: totals.total,
        campaignDiscount: totals.campaignDiscount,
        additionalDiscount: totals.additionalDiscount,
        totalWithoutVAT: totals.totalWithoutVAT,
        package: selectedPkg,
        optionPackages: offer.addedOptionPackages,
        manualProducts: offer.manualProducts,
        info: offer.info
      }

      await generatePricePdf(pdfData)
      toast.success("PDF generated successfully")
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error("Failed to generate PDF")
    }
  }

  return (
    <>
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
      <div className="flex space-x-2 justify-end">
        {user?.role === "admin" && <button className="text-gray-400 hover:text-red-500" onClick={() => {
          setConfirmDialog({
            isOpen: true,
            onConfirm: () => { onDelete(offer._id) },
            description: "Are you sure you want to delete this?"
          })
        }} aria-label="Delete offer">
          <Trash2 className="h-5 w-5" />
        </button>}
        <button 
          className="text-gray-400 hover:text-gray-600" 
          onClick={handlePrint} 
          aria-label="Download PDF"
        >
          <Printer className="h-5 w-5" />
        </button>
        <button className="text-gray-400 hover:text-gray-600" onClick={handleCopy} aria-label="Copy offer">
          <Copy className="h-5 w-5" />
        </button>
      </div>
    </>
  )
}

