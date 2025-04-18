"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { X, Calendar, Plus } from "lucide-react"
import Image from "next/image"
import { fetchWithInterceptor } from "@/lib/fetch-interceptor"
import SelectMarkeModelModal from "./select-marke-model-modal"

interface MarkeModelPair {
  marke: string
  model: string
}

interface AddEditPackageModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: FormData) => void
  initialData?: {
    name: string
    description: string
    image: string
    markeModels: MarkeModelPair[]
    price: string
    discount: string
    endDate: string
    include: string
    info: string
  }
}

export default function AddEditPackageModal({
  isOpen,
  onClose,
  onSave,
  initialData = {
    name: "",
    description: "",
    image: "",
    markeModels: [],
    price: "",
    discount: "",
    endDate: "",
    include: "",
    info: "",
  },
}: AddEditPackageModalProps) {
  const [name, setName] = useState(initialData.name)
  const [description, setDescription] = useState(initialData.description)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(initialData.image)
  const [markeModels, setMarkeModels] = useState<MarkeModelPair[]>(initialData.markeModels)
  const [price, setPrice] = useState(initialData.price)
  const [discount, setDiscount] = useState(initialData.discount)
  const [endDate, setEndDate] = useState(initialData.endDate)
  const [include, setInclude] = useState(initialData.include)
  const [info, setInfo] = useState(initialData.info)

  const [showCalendar, setShowCalendar] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)

  // Calendar data
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  const [isMarkeOpen, setIsMarkeOpen] = useState(false)

  // Update state when initialData changes
  useEffect(() => {
    if (isOpen) {
      setName(initialData.name)
      setDescription(initialData.description)
      setImagePreview(initialData.image)
      setMarkeModels(initialData.markeModels)
      setPrice(initialData.price)
      setDiscount(initialData.discount)
      setEndDate(initialData.endDate)
      setInclude(initialData.include)
      setInfo(initialData.info)
    }
  }, [initialData, isOpen])


  const [error, setError] = useState<string>('')
  const validateForm = () => {
    let newError = ""
    if (!name || !price || (!imageFile && !imagePreview) || !price || markeModels.length === 0) {
      newError = "Vennligst fyll ut felt som mangler"
    } else if (Number(price) < 0) {
      newError = "Price cannot be negative"
    } else if (discount && (Number(discount) < 0 || Number(discount) > Number(price))) {
      newError = "Discount must be between 0 and the price"
    } else {
      newError = ""
    }

    setError(newError)
    return newError;
  }

  const handleSave = () => {

    if (validateForm() !== '') return

    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    if (imageFile) {
      formData.append('image', imageFile)
    }
    markeModels.forEach((pair, index) => {
      formData.append(`markeModels[${index}][marke]`, pair.marke)
      formData.append(`markeModels[${index}][model]`, pair.model)
    })
    formData.append('price', price)
    formData.append('discount', discount)
    formData.append('endDate', endDate)
    formData.append('include', include)
    formData.append('info', info)

    onSave(formData)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const handleSelectDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setEndDate(date.toLocaleDateString())
    setShowCalendar(false)
  }

  if (!isOpen) return null

  return (
    <>
      <SelectMarkeModelModal
        isOpen={isMarkeOpen}
        onClose={() => setIsMarkeOpen(false)}
        pairs={markeModels}
        setPairs={setMarkeModels}
      />
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-3 relative flex flex-col max-h-[90vh]">
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
            <X className="h-4 w-4" />
          </button>

          <h2 className="text-lg font-semibold mb-2.5">Opprett/Endre Pakke</h2>
          {error && <p className="text-xs font-semibold mb-2 text-red-400">{error}</p>}

          <div className="space-y-3 overflow-y-auto flex-1 pr-2">
            {/* Package Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Navn</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Vennligst fyll ut følgende felt..."
                className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Beskrivelse</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Vennligst fyll ut følgende felt..."
                className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            {/* Product Picture */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Bilde</label>
              <div className="border border-gray-300 rounded-md p-2 w-40 h-28 flex items-center justify-center">
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <Image src={imagePreview || "/placeholder.svg"} alt="Product" fill className="object-cover rounded" />
                    <button
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview("")
                      }}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                    <Plus className="h-8 w-8 text-gray-400" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>

            {/* Information Section */}
            <div>
              {/* Add marke-model pair */}
              <button
                onClick={() => setIsMarkeOpen(true)}
                className="mt-2 text-sm text-teal-600 hover:text-teal-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Velg merke & model ved å klikke her
              </button>
            </div>

            {/* Price and Discount */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Avslag</label>
                <input
                  type="text"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder=""
                  className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Ordinær pris</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder=""
                  className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Discount End Date */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Velg dato for kampanje slutt</label>
              <div className="relative" ref={calendarRef}>
                <div className="relative cursor-pointer" onClick={() => setShowCalendar(!showCalendar)}>
                  <input
                    type="text"
                    value={endDate}
                    readOnly
                    placeholder="Velg dato..."
                    className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                  </div>
                </div>

                {showCalendar && (
                  <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-md border border-gray-200 p-4">
                    <div className="flex justify-between items-center mb-4">
                      <button onClick={handlePrevMonth} className="p-1">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <div className="font-medium">
                        {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
                      </div>
                      <button onClick={handleNextMonth} className="p-1">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                      {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                        <div key={day} className="py-1">
                          {day}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center">
                      {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                        <div key={`empty-${index}`} className="py-2"></div>
                      ))}

                      {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1
                        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                        const isSelected = endDate === date.toLocaleDateString()
                        const isToday = new Date().toDateString() === date.toDateString()

                        return (
                          <div
                            key={day}
                            onClick={() => handleSelectDate(day)}
                            className={`py-2 rounded-full cursor-pointer hover:bg-gray-100 ${isSelected ? "bg-teal-600 text-white hover:bg-teal-700" : ""
                              } ${isToday && !isSelected ? "border border-teal-600" : ""}`}
                          >
                            {day}
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm font-medium">Time</div>
                      <div className="text-sm">14:30</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* What's Included */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Hva er inkludert i pakke</label>
              <textarea
                value={include}
                onChange={(e) => setInclude(e.target.value)}
                rows={3}
                className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Other Info */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Info til selger
              </label>
              <textarea
                value={info}
                onChange={(e) => setInfo(e.target.value)}
                rows={3}
                className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 focus:outline-none"
            >
              Lagre
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

