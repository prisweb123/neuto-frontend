"use client"

import { Dispatch, SetStateAction } from "react";
import { getValidUntilDate } from "./utils";

export default function PricingFooter({ validDays, setValidDays, terms, setTerms, discount, setDiscount }: { validDays: string; setValidDays: Dispatch<SetStateAction<string>>; terms: string; setTerms: Dispatch<SetStateAction<string>>; discount: string; setDiscount: Dispatch<SetStateAction<string>>; }) {
  return (
    <>
      {/* Discount */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Avslag</label>
        <input
          type="text"
          placeholder="Prosent"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="block w-full max-w-xs rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>

      {/* Terms */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Fyll ut utfyllende informasjon</label>
        <textarea
          placeholder="Fyll ut farge/fargekode, viktige avtaler med kunde etc"
          rows={3}
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
          className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        ></textarea>
      </div>

      {/* Valid */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Hvor mange dager gjelder tilbud</label>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Skriv antall dager"
            value={validDays}
            onChange={(e) => setValidDays(e.target.value)}
            className="block w-40 rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          <span className="text-sm text-gray-500">Gjyldig til: {getValidUntilDate(validDays)}</span>
        </div>
      </div>
    </>
  )
}

