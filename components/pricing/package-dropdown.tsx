"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import Image from "next/image"

interface PackageOption {
  id: string
  title: string
  description?: string
  price: number
  discount?: number
  endDate?: string
  include?: string[]
}

interface PackageDropdownProps {
  options: PackageOption[]
  value: string
  onChange: (value: string) => void
  label: string
}

export default function PackageDropdown({ options, value, onChange, label }: PackageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  console.log('PackageDropdown rendered with:', { options, value, label })

  const selectedOption = options.find((option) => option.id === value)
  console.log('Selected option:', selectedOption)

  const formatPrice = (price: number) => {
    return `Kr ${price.toLocaleString('no-NO')},-`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('no-NO', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })
  }

  const toggleDropdown = () => {
    console.log('Dropdown toggled. Current state:', isOpen)
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (optionId: string) => {
    console.log('Option clicked:', optionId)
    onChange(optionId)
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    console.log('Dropdown mount/update effect triggered')
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        console.log('Clicked outside dropdown, closing it')
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      console.log('Dropdown cleanup - removing event listener')
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="mb-6" ref={dropdownRef}>
      <label className="block text-sm font-medium text-teal-600 mb-1">{label}</label>
      <div className="relative">
        <button
          type="button"
          className="flex items-center w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOption ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div>
                  <div className="font-medium">{selectedOption.title}</div>
                </div>
              </div>
              {selectedOption.price && (
                <div className="text-right">
                  {selectedOption.discount && (
                    <div className="text-sm line-through text-gray-500">
                      Kr {selectedOption.price.toLocaleString('no-NO')},-
                    </div>
                  )}
                  <div className="font-medium">
                    Kr {(selectedOption.price - (selectedOption.discount || 0)).toLocaleString('no-NO')},-
                  </div>
                </div>
              )}
            </div>
          ) : options.length === 0 ? (
            <div className="text-gray-500">Ingen pakker tilgjengelig</div>
          ) : (
            <div className="text-gray-500">Velg en pakke</div>
          )}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <ChevronDown className="h-4 w-4" />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg max-h-96 overflow-auto">
            <div className="py-1">
              {options.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">Ingen pakker tilgjengelig</div>
              ) : (
                options.map((option) => (
                  <button
                    key={option.id}
                    className="flex flex-col md:flex-row justify-between w-full px-4 md:px-6 py-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 items-start md:items-center space-y-4 md:space-y-0"
                    onClick={() => {
                      onChange(option.id)
                      setIsOpen(false)
                    }}
                  >
                    <div className="flex flex-row justify-start md:mr-6 w-full md:w-auto">
                      <div>
                        <div className="text-lg md:text-xl font-medium">{option.title}</div>
                        {option.description && (
                          <div className="text-xs md:text-sm text-gray-600">{option.description}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 px-4">
                      {option.include && option.include.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-700 mb-2">Inkluderer:</div>
                          <ul className="space-y-1 list-disc list-inside">
                            {option.include[0].split('\r\n').filter(item => item.trim() !== '').map((item, index) => (
                              <li key={index} className="text-sm text-gray-600">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0 md:ml-6 text-right w-full md:w-auto">
                      {option.discount && option.endDate && (
                        <div className="inline-block px-2 md:px-3 py-1 bg-red-500 text-white text-xs md:text-sm rounded mb-1">
                          KAMPANJE - {formatDate(option.endDate)}
                        </div>
                      )}
                      {option.discount && (
                        <div className="text-gray-500 line-through text-sm md:text-base">
                          Kr {option.price.toLocaleString('no-NO')},-
                        </div>
                      )}
                      <div className="text-lg md:text-xl font-medium">
                        Kr {(option.price - (option.discount || 0)).toLocaleString('no-NO')},-
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

