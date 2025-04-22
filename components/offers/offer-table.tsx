import { Offer, } from "../pricing/type"
import OfferActions from "./offer-actions"

interface OfferTableProps {
  offers: Offer[]
  onDelete: (id: string) => void
}

export default function OfferTable({ offers, onDelete }: OfferTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-3 font-medium text-gray-600">Tilbudsnr</th>
            <th className="pb-3 font-medium text-gray-600">Kunde informasjon</th>
            <th className="pb-3 font-medium text-gray-600">Opprettet av</th>
            <th className="pb-3"></th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer._id} className="border-b hover:bg-gray-50">
              <td className="py-4">{offer.offerNo}</td>
              <td className="py-4">{offer.info}</td>
              <td className="py-4">{offer.createdBy?.username}</td>
              <td className="py-4">
                <OfferActions
                  offer={offer}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

