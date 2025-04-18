"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import Image from "next/image"

interface PackageOption {
  id: string
  title: string
  description?: string
  image: string
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

  const selectedOption = options.find((option) => option.id === value)

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleOptionClick = (optionId: string) => {
    onChange(optionId)
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
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
                  className="flex w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  onClick={() => handleOptionClick(option.id)}
                >
                  <div className="w-36 h-24 rounded-md overflow-hidden mr-4 flex-shrink-0">
                    <Image
                      src={option.image || "/placeholder.svg"}
                      alt={option.title}
                      width={144}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-lg">{option.title}</div>
                    {option.description && <div className="text-sm text-gray-500 mt-1">{option.description}</div>}
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

