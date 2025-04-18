"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown, X } from "lucide-react"
import { fetchWithInterceptor } from "@/lib/fetch-interceptor"

interface MarkeModelPair {
  marke: string
  model: string
}

interface SelectMarkeModelModalProps {
  isOpen: boolean
  onClose: () => void
  pairs: MarkeModelPair[]
  setPairs: React.Dispatch<React.SetStateAction<MarkeModelPair[]>>
}

export default function SelectMarkeModelModal({ isOpen, onClose, pairs, setPairs }: SelectMarkeModelModalProps) {
  const [marke, setMarke] = useState("")
  const [model, setModel] = useState("")

  const [markeOptions, setMarkeOptions] = useState<string[]>([])
  const [modelOptions, setModelOptions] = useState<Record<string, string[]>>({})

  const [showMarkeDropdown, setShowMarkeDropdown] = useState(false)
  const [showModelDropdown, setShowModelDropdown] = useState(false)

  // Fetch marke and model options when modal opens
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, success } = await fetchWithInterceptor<{ name: string; model: string }[]>('/products/get-all')
        if (success) {
          // Extract unique marke options
          const markes = Array.from(new Set(data.map(vehicle => vehicle.name)))
          setMarkeOptions(markes)

          // Create model options mapping
          const modelMap: Record<string, string[]> = {}
          data.forEach(vehicle => {
            if (!modelMap[vehicle.name]) {
              modelMap[vehicle.name] = []
            }
            if (!modelMap[vehicle.name].includes(vehicle.model)) {
              modelMap[vehicle.name].push(vehicle.model)
            }
          })
          setModelOptions(modelMap)
        }
      } catch (err) {
        console.error('Error fetching products:', err)
      }
    }

    if (isOpen) {
      fetchProducts()
    }
  }, [isOpen])

  const addPair = () => {
    const isDuplicate = pairs.some(pair => pair.marke === marke && pair.model === model)
    if (!isDuplicate) {
      setPairs([...pairs, { marke, model }])
      setMarke("")
      setModel("")
    }
  }

  const removePair = (index: number) => {
    setPairs(pairs.filter((_, i) => i !== index))
  }


  const handleSave = () => {
    onClose()
  }


  const markeDropdownRef = useRef<HTMLDivElement>(null)
  const modelDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (markeDropdownRef.current && !markeDropdownRef.current.contains(event.target as Node)) {
        setShowMarkeDropdown(false)
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setShowModelDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Velg merke og modell</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative" ref={markeDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Merke</label>
              <div className="relative cursor-pointer" onClick={() => setShowMarkeDropdown(!showMarkeDropdown)}>
                <input
                  type="text"
                  value={marke}
                  readOnly
                  placeholder="Velg..."
                  className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>

              {showMarkeDropdown && (
                <div className="absolute z-[70] mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                  {markeOptions.map((option) => (
                    <div
                      key={option}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setMarke(option)
                        setModel("")
                        setShowMarkeDropdown(false)
                      }}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full border ${marke === option ? "bg-teal-600 border-teal-600" : "border-gray-300"} flex items-center justify-center mr-2`}
                        >
                          {marke === option && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                        <span>{option}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={modelDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Modell</label>
              <div
                className="relative cursor-pointer"
                onClick={() => marke && setShowModelDropdown(!showModelDropdown)}
              >
                <input
                  type="text"
                  value={model}
                  readOnly
                  placeholder="Velg..."
                  className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>

              {showModelDropdown && marke && (
                <div className="absolute z-[70] mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                  {modelOptions[marke as keyof typeof modelOptions]?.map((option) => (
                    <div
                      key={option}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setModel(option)
                        setShowModelDropdown(false)
                      }}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full border ${model === option ? "bg-teal-600 border-teal-600" : "border-gray-300"} flex items-center justify-center mr-2`}
                        >
                          {model === option && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                        <span>{option}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 justify-between">
            <button
              onClick={() => {
                const allModels = markeOptions.flatMap(marke => 
                  modelOptions[marke]?.map(model => ({ marke, model })) || []
                )
                setPairs(allModels)
              }}
              className="px-3 py-2 bg-gray-100 text-white bg-teal-600 hover:bg-teal-700 rounded-3xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Velg alle merker og modeller
            </button>
            <button
              onClick={addPair}
              disabled={!marke || !model}
              className="px-3 py-2 bg-teal-600 text-white rounded-3xl hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>

          <div className="mt-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Valgte merker og modell den vil være synlig for</div>
            <div className="overflow-x-auto max-h-[300px]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Merke</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Modell</th>
                    <th className="px-4 py-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {pairs.map((pair, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">{pair.marke}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{pair.model}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        <button
                          onClick={() => removePair(index)}
                          className="text-teal-600 hover:text-teal-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"/>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6 border-t pt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
            >
              Lagre
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

