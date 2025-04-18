"use client"

import { useEffect, useState } from "react"
import { Search, Plus } from "lucide-react"
import AdminLayout from "@/components/layout/admin-layout"
import OfferTable from "@/components/offers/offer-table"
import Pagination from "@/components/ui/pagination"
import { fetchWithInterceptor } from "@/lib/fetch-interceptor"
import { Offer } from "@/components/pricing/type"


export default function OfferPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const itemsPerPage = 15

  const fetchOffers = async () => {
    try {
      const response = await fetchWithInterceptor<Offer[]>('/priceoffers')
      if (response.success) {
        setOffers(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch offers:', error)
    }
  }

  useEffect(() => {
    fetchOffers()
  }, [])

  // Filter offers based on search query
  const filteredOffers = offers.filter(
    (offer) =>
      offer.createdBy.username.toLowerCase().includes(searchQuery.toLowerCase()) || offer.info.toLowerCase().includes(searchQuery.toLowerCase()) || offer.offerNo.toString().toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOffers = filteredOffers.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetchWithInterceptor(`/priceoffers/${id}`, {
        method: 'DELETE',
      })
      if (response.success) {
        setOffers(offers.filter((offer) => offer._id !== id))
      }
    } catch (error) {
      console.error('Failed to delete offer:', error)
    }
  }

  return (
    <AdminLayout title="Tilbud">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">Oversikt over tilbud som har blitt opprettet</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Søk etter tilbud"
                className="pl-10 pr-4 py-2 w-80 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <OfferTable offers={paginatedOffers} onDelete={handleDelete} />

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>

      {/* Add New Button */}
      {/* <button className="fixed bottom-8 right-8 bg-teal-600 text-white p-3 rounded-full shadow-lg hover:bg-teal-700">
        <Plus className="h-6 w-6" />
      </button> */}
    </AdminLayout>
  )
}

