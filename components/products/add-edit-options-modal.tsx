"use client"

import { useState, useEffect, useRef } from "react"
import { X, Calendar, Plus } from "lucide-react"
import SelectMarkeModelModal from "./select-marke-model-modal"
import ActionMenu from "../ui/action-menu"

interface OptionItem {
  id: string
  name: string
  price: string
  discountPrice?: string
  isActive: boolean
  discountEndDate?: string
  isSelected: boolean
}

interface MarkeModelPair {
  marke: string
  model: string
}

interface AddEditOptionsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    name: string
    markeModels: MarkeModelPair[]
    info: string
    options: OptionItem[]
  }) => void
  initialData: {
    name: string
    markeModels: MarkeModelPair[]
    info: string
    options: OptionItem[]
  }
}

export default function AddEditOptionsModal({
  isOpen,
  onClose,
  onSave,
  initialData = {
    name: "",
    markeModels: [],
    info: "",
    options: [],
  },
}: AddEditOptionsModalProps) {
  const [name, setName] = useState(initialData.name)
  const [markeModels, setMarkeModels] = useState<MarkeModelPair[]>(initialData.markeModels)
  const [info, setInfo] = useState(initialData.info)
  const [options, setOptions] = useState<OptionItem[]>(initialData.options)

  // Form state for adding new option
  const [optionName, setOptionName] = useState("")
  const [optionPrice, setOptionPrice] = useState("")
  const [optionDiscount, setOptionDiscount] = useState("")
  const [optionDiscountEndDate, setOptionDiscountEndDate] = useState("")

  const [showCalendar, setShowCalendar] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)

  const [isMarkeOpen, setIsMarkeOpen] = useState(false)

  // Calendar data
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  // Update state when initialData changes
  useEffect(() => {
    if (isOpen) {
      setName(initialData.name)
      setMarkeModels(initialData.markeModels)
      setInfo(initialData.info)
      setOptions(initialData.options)
    }
  }, [initialData, isOpen])

  const [error, setError] = useState<string>('')
  const validateForm = () => {
    let newError = ""
    if (!name || !info || markeModels.length === 0) {
      newError = "Vennligst fyll ut nødvendig felt"
    } else if (options.some(opt => Number(opt.price) < 0)) {
      newError = "Option prices cannot be negative"
    } else if (options.some(opt => opt.discountPrice && (Number(opt.discountPrice) < 0 || Number(opt.discountPrice) > Number(opt.price)))) {
      newError = "Option discount prices must be between 0 and the option price"
    } else {
      newError = ""
    }

    setError(newError)
    return newError;
  }

  const handleSave = () => {
    if (validateForm() !== '') return
    onSave({
      name,
      markeModels,
      info,
      options,
    })
  }

  const handleAddOption = () => {
    if (!optionName || !optionPrice) return

    const newOption: OptionItem = {
      id: `option-${Date.now()}`,
      name: optionName,
      price: optionPrice,
      discountPrice: optionDiscount || undefined,
      isActive: true,
      discountEndDate: optionDiscountEndDate || undefined,
      isSelected: false,
    }

    setOptions([...options, newOption])

    // Reset form
    setOptionName("")
    setOptionPrice("")
    setOptionDiscount("")
    setOptionDiscountEndDate("")
  }

  const handleRemoveOption = (id: string) => {
    setOptions(options.filter((option) => option.id !== id))
  }

  const handleToggleOptionActive = (id: string) => {
    setOptions(options.map((option) => (option.id === id ? { ...option, isActive: !option.isActive } : option)))
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const handleSelectDate = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()}`
    setOptionDiscountEndDate(formattedDate)
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

          <h2 className="text-lg font-semibold mb-2.5">Opprett/Endre tilvalg</h2>
          {error && <p className="text-xs font-semibold mb-3 text-red-400">{error}</p>}

          <div className="space-y-3 overflow-y-auto flex-1 pr-2">
            {/* Header (Package Name) */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Navn</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter here..."
                className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>




            {/* Add marke-model pair */}
            <button
              onClick={() => setIsMarkeOpen(true)}
              className="mt-2 text-sm text-teal-600 hover:text-teal-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Velg merke & model ved å klikke her
            </button>

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

            <div className="border-t pt-4">

              {/* Option Name */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">Tilvalg navn</label>
                <input
                  type="text"
                  value={optionName}
                  onChange={(e) => setOptionName(e.target.value)}
                  placeholder=""
                  className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              {/* Price and Discount */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ny pris</label>
                  <input
                    type="text"
                    value={optionDiscount}
                    onChange={(e) => setOptionDiscount(e.target.value)}
                    placeholder=""
                    className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ordinær pris</label>
                  <input
                    type="text"
                    value={optionPrice}
                    onChange={(e) => setOptionPrice(e.target.value)}
                    placeholder=""
                    className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Discount End Date */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">Velg dato for kampanje slutt</label>
                <div className="relative" ref={calendarRef}>
                  <div className="relative cursor-pointer" onClick={() => setShowCalendar(!showCalendar)}>
                    <input
                      type="text"
                      value={optionDiscountEndDate}
                      readOnly
                      placeholder="Velg dato..."
                      className="block w-full rounded-md border border-gray-300 py-1.5 px-2 text-sm pr-10 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>

                  {showCalendar && (
                    <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-md border border-gray-200 p-3">
                      <div className="flex justify-between items-center mb-3">
                        <button onClick={handlePrevMonth} className="p-1">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <div className="font-medium">
                          {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
                        </div>
                        <button onClick={handleNextMonth} className="p-1">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                          const formattedDate = `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()}`
                          const isSelected = optionDiscountEndDate === formattedDate
                          const isToday = new Date().toDateString() === date.toDateString()

                          return (
                            <div
                              key={day}
                              onClick={() => handleSelectDate(day)}
                              className={`py-1.5 rounded-full cursor-pointer hover:bg-gray-100 ${isSelected ? "bg-teal-600 text-white hover:bg-teal-700" : ""
                                } ${isToday && !isSelected ? "border border-teal-600" : ""}`}
                            >
                              {day}
                            </div>
                          )
                        })}
                      </div>

                      <div className="mt-3 flex justify-between items-center">
                        <div className="text-xs font-medium">Time</div>
                        <div className="text-xs">14:30</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Add Option Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleAddOption}
                  className="py-1.5 px-2 text-sm  bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none"
                >
                 Legg til
                </button>
              </div>
            </div>

            {/* Options Table */}
            {options.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-gray-700 mb-2">Tilvalg</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Vare/Tjeneste
                        </th>
                        <th
                          scope="col"
                          className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Pris
                        </th>
                        <th
                          scope="col"
                          className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                         Aktiv/ Ikke Aktiv
                        </th>
                        <th
                          scope="col"
                          className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                         Gjelder til
                        </th>
                        <th scope="col" className="relative py-2 px-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {options.map((option) => (
                        <tr key={option.id}>
                          <td className="py-2 px-3 whitespace-nowrap text-xs font-medium text-gray-900">{option.name}</td>
                          <td className="py-2 px-3 whitespace-nowrap text-xs text-gray-500">
                            {option.price}
                            {option.discountPrice && <span className="text-red-500 ml-2">/ {option.discountPrice}</span>}
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap text-xs text-gray-500">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${option.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                            >
                              {option.isActive ? "Aktiv" : "Ikke aktiv"}
                            </span>
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap text-xs text-gray-500">
                            {option.discountEndDate || "-"}
                          </td>
                          <td className="py-2 px-3 whitespace-nowrap text-right text-xs font-medium">
                            <ActionMenu items={[
                              {
                                label: option.isActive ? "Deaktiver" : "Aktivere",
                                onClick: () => handleToggleOptionActive(option.id),
                              },
                              {
                                label: "Slett",
                                onClick: () => handleRemoveOption(option.id),
                              },
                            ]} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4 pt-3 border-t">
            <button
              onClick={handleSave}
              className="py-1.5 px-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 focus:outline-none"
            >
              Legg til
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

