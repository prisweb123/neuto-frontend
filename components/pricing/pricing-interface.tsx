import PricingForm from "./pricing-form"
import PackageSummary from "./package-summary"
import AddProductManually from "./add-product-manually"
import PricingFooter from "./pricing-footer"
import { useState, useEffect } from "react"
import { ManualProduct, Offer, OptionProduct, Product } from "./type"
import { generatePricePdf } from "../pdf/generate-pdf"
import { calculateTotals, getValidUntilDate } from "./utils"
import { fetchWithInterceptor } from "@/lib/fetch-interceptor"
import { useRouter } from "next/navigation"

export default function PricingInterface({ offerId }: { offerId: string | null }) {
  const router = useRouter()
  const [selectedPackage, setSelectedPackage] = useState<string>("")
  const [marke, setMarke] = useState("")
  const [model, setModel] = useState("")
  const [info, setInfo] = useState<string>('')
  const [optionPackages, setOptionPackages] = useState<OptionProduct[]>([])
  const [packages, setPackages] = useState<Product[]>([])
  const [addedOptionPackages, setAddedOptionPackages] = useState<OptionProduct[]>([])
  const [manualProducts, setManualProducts] = useState<ManualProduct[]>([])
  const [discount, setDiscount] = useState("")
  const [terms, setTerms] = useState("")
  const [validDays, setValidDays] = useState("")

  // Fetch offer data when offerId is present
  useEffect(() => {
    const fetchOffer = async () => {
      if (!offerId) return;

      try {
        const { data, success } = await fetchWithInterceptor<Offer>(`/priceoffers/${offerId}`);


        if (success) {
          // Update all the state with fetched data
          setSelectedPackage(data.selectedPackage ? data.selectedPackage._id : '');
          setMarke(data.marke || '');
          setModel(data.model || '');
          setInfo('');
          setAddedOptionPackages(data.addedOptionPackages || []);
          setManualProducts(data.manualProducts || []);
          setDiscount(data.discount || '');
          setTerms(data.terms || '');
          setValidDays(data.validDays || '');
        }
      } catch (error) {
        console.error('Failed to fetch offer:', error);
        alert('Failed to load the offer. Please try again.');
      }
    };

    fetchOffer();
  }, [offerId]);

  const totals = calculateTotals(packages, selectedPackage, addedOptionPackages, manualProducts, discount)

  const handleDownloadPdf = async () => {
    const selectedPkg = packages.find(pkg => pkg._id === selectedPackage)

    try {
      // Save the offer to backend first
      const { success, data } = await fetchWithInterceptor<Offer>('/priceoffers', {
        method: 'POST',
        body: JSON.stringify({
          ...(selectedPackage && { selectedPackage }), marke, model, info,
          addedOptionPackages, manualProducts, discount, terms, validDays
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const pdfData = {
        offerNumber: data.offerNo,
        date: new Date().toLocaleDateString("nb-NO"),
        validUntil: getValidUntilDate(validDays),
        createdBy: data.createdBy.username,
        terms: terms || "Please pay within 15 days from the date of invoice.",
        VatValue: totals.VATValue,
        total: totals.total,
        campaignDiscount: totals.campaignDiscount,
        additionalDiscount: totals.additionalDiscount,
        totalWithoutVAT: totals.totalWithoutVAT,
        package: selectedPkg ? selectedPkg : null,
        optionPackages: addedOptionPackages,
        manualProducts: manualProducts,
        info,
      }

      generatePricePdf(pdfData)


      if (success) {
        router.push(`/offer`)
      }
    } catch (error) {
      console.error('Failed to save offer:', error)
      alert('Failed to save the offer. Please try again.')
    }
  }

  const isFormValid = marke && model && info && (selectedPackage || addedOptionPackages.length > 0 || manualProducts.length > 0)

  return (
    <div className="max-w-6xl mx-auto">
      <PricingForm
        selectedPackage={selectedPackage} setSelectedPackage={setSelectedPackage}
        marke={marke} setMarke={setMarke}
        model={model} setModel={setModel}
        info={info} setInfo={setInfo}
        optionPackages={optionPackages} setOptionPackages={setOptionPackages}
        packages={packages} setPackages={setPackages}
        addedOptionPackages={addedOptionPackages} setAddedOptionPackages={setAddedOptionPackages}
      />
      <PackageSummary
        packages={packages} selectedPackage={selectedPackage} setSelectedPackage={setSelectedPackage}
        addedOptionPackages={addedOptionPackages} setAddedOptionPackages={setAddedOptionPackages}
      />
      <AddProductManually products={manualProducts} setProducts={setManualProducts} />
      <PricingFooter
        validDays={validDays} setValidDays={setValidDays}
        discount={discount} setDiscount={setDiscount}
        terms={terms} setTerms={setTerms}
      />

      {/* Totals */}
      <div className="border-t pt-4">
        <div className="flex justify-end">
          <div className="w-full max-w-xs">
            <div className="flex justify-between py-1">
              <span className="text-sm">Pris uten MVA:</span>
              <span className="font-small">{totals.totalWithoutVAT.toLocaleString()},00,-</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm">MVA (25%):</span>
              <span className="font-small">{totals.VATValue.toLocaleString()},00,-</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm">Rabatt AND PROSENT ({discount}%):</span>
              <span className="font-small">{totals.additionalDiscount.toLocaleString()},00,-</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm">Kampanje rabatt:</span>
              <span className="font-small">{totals.campaignDiscount.toLocaleString()},00,-</span>
            </div>
            <div className="flex justify-between py-1 border-t border-gray-300 mt-1 pt-1">
              <span className="text-sm font-medium">Totalt:</span>
              <span className="font-bold">{totals.total.toLocaleString()},00,-</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            className={`ml-2 bg-teal-600 text-white px-6 py-2 rounded-md ${isFormValid ? 'hover:bg-teal-700' : 'opacity-50 cursor-not-allowed'}`}
            onClick={handleDownloadPdf}
            disabled={!isFormValid}
          >
             Opprett tilbud
          </button>
        </div>
      </div>
    </div>
  )
}

