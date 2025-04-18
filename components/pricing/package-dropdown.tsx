"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import Image from "next/image"

interface PackageOption {
  id: string
  title: string
  description?: string
  image: string
  price: number
  discount?: number
  endDate?: string
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
    return new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK' })
      .format(price)
      .replace('NOK', 'Kr')
      .trim()
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
          onClick={toggleDropdown}
        >
          {selectedOption ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                  <Image
                    src={selectedOption.image || "/placeholder.svg"}
                    alt={selectedOption.title}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <div className="font-medium">{selectedOption.title}</div>
                </div>
              </div>
              {selectedOption.price && (
                <div className="text-right">
                  {selectedOption.discount && (
                    <div className="text-sm line-through text-gray-500">
                      {formatPrice(selectedOption.price)}
                    </div>
                  )}
                  <div className="font-medium">
                    {formatPrice(selectedOption.price - (selectedOption.discount || 0))}
                  </div>
                </div>
              )}
            </div>
          ) : options.length === 0 ? (
            <div className="text-gray-500">Velg merke og modell først</div>
          ) : <div className="text-gray-500">Ingen pakke er valgt</div>}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <ChevronDown className="h-4 w-4" />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg max-h-96 overflow-auto">
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.id}
                  className="flex flex-row justify-between w-full px-6 py-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 items-center"
                  onClick={() => handleOptionClick(option.id)}
                >
                  {/* Left section - Image and Title */}
                  <div className="flex flex-row justify-between  mr-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0 bg-gray-50">
                      <Image
                        src={option.image || "/placeholder.svg"}
                        alt={option.title}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <div className="text-xl font-medium">{option.title}</div>
                      {option.description && (
                        <div className="text-sm text-gray-600">{option.description}</div>
                      )}
                    </div>
                  </div>

                  {/* Middle section - Bullet Points */}
                  <div className="flex justify-between grid grid-cols-2 gap-x-8">
                    <ul className="space-y-1">
                      <li className="flex items-center text-gray-600 text-sm">
                        <span className="mr-2">•</span>
                        Instegslister
                      </li>
                      <li className="flex items-center text-gray-600 text-sm">
                        <span className="mr-2">•</span>
                        Hjulbuer
                      </li>
                      <li className="flex items-center text-gray-600 text-sm">
                        <span className="mr-2">•</span>
                        Bakfanger
                      </li>
                      <li className="flex items-center text-gray-600 text-sm">
                        <span className="mr-2">•</span>
                        panser
                      </li>
                      <li className="flex items-center text-gray-600 text-sm">
                        <span className="mr-2">•</span>
                        Skjermer
                      </li>
                    </ul>
                    <ul className="space-y-1">
                      <li className="flex items-center text-gray-600 text-sm">
                        <span className="mr-2">•</span>
                        Instegslister
                      </li>
                      <li className="flex items-center text-gray-600 text-sm">
                        <span className="mr-2">•</span>
                        Hjulbuer
                      </li>
                      <li className="flex items-center text-gray-600 text-sm">
                        <span className="mr-2">•</span>
                        Bakfanger
                      </li>
                      <li className="flex items-center text-gray-600 text-sm">
                        <span className="mr-2">•</span>
                        panser
                      </li>
                      <li className="flex items-center text-gray-600 text-sm">
                        <span className="mr-2">•</span>
                        Skjermer
                      </li>
                    </ul>
                  </div>

                  {/* Right section - Price and Campaign */}
                  <div className="flex-shrink-0 ml-6 text-right">
                    {option.discount && option.endDate && (
                      <div className="inline-block px-3 py-1 bg-red-500 text-white text-sm rounded mb-1">
                        KAMPANJE - {formatDate(option.endDate)}
                      </div>
                    )}
                    {option.discount && (
                      <div className="text-gray-500 line-through">
                        Kr {option.price.toLocaleString('no-NO')},-
                      </div>
                    )}
                    <div className="text-xl font-medium">
                      Kr {(option.price - (option.discount || 0)).toLocaleString('no-NO')},-
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

