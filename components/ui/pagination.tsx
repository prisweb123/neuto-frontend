"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-center mt-6">
      <nav className="flex items-center space-x-1">
        <button
          className="p-2 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNumber = i + 1
          return (
            <button
              key={pageNumber}
              className={`px-3 py-1 rounded-md ${
                currentPage === pageNumber ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          )
        })}

        {totalPages > 5 && (
          <>
            <span className="px-2">...</span>
            <button
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          className="p-2 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </nav>
    </div>
  )
}

