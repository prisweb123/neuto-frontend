"use client"

import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import PackageDropdown from "./package-dropdown"
import { fetchWithInterceptor } from "@/lib/fetch-interceptor"
import { OptionProduct, Product } from "./type"

const transformToPackageOption = (product: Product) => ({
  id: product._id,
  title: product.name,
  description: product.description,
  image: product.image || "/images/package-1.png",
  price: product.price,
  discount: product.discount,
  endDate: product.endDate,
  include: product.include || [] // Provide default empty array if include is undefined
})

export default function PricingForm({
  selectedPackage,
  setSelectedPackage,
  marke,
  setMarke,
  model,
  setModel,
  info,
  setInfo,
  optionPackages,
  setOptionPackages,
  packages,
  setPackages,
  addedOptionPackages,
  setAddedOptionPackages,
}: {
  selectedPackage: string;
  setSelectedPackage: Dispatch<SetStateAction<string>>;
  marke: string;
  setMarke: Dispatch<SetStateAction<string>>;
  model: string;
  setModel: Dispatch<SetStateAction<string>>;
  info: string;
  setInfo: Dispatch<SetStateAction<string>>;
  optionPackages: OptionProduct[];
  setOptionPackages: Dispatch<SetStateAction<OptionProduct[]>>;
  packages: Product[];
  setPackages: Dispatch<SetStateAction<Product[]>>;
  addedOptionPackages: OptionProduct[];
  setAddedOptionPackages: Dispatch<SetStateAction<OptionProduct[]>>;
}) {
  const [showMarkeDropdown, setShowMarkeDropdown] = useState(false)
  const [showModelDropdown, setShowModelDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [allPackages, setAllPackages] = useState<Product[]>([])
  const [allOptionPackages, setAllOptionPackages] = useState<OptionProduct[]>([])

  const [markeOptions, setMarkeOptions] = useState<string[]>([])
  const [modelOptions, setModelOptions] = useState<Record<string, string[]>>({})

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

    fetchProducts()

  }, [])

  // Fetch packages once when component mounts
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const [mainResponse, optionResponse] = await Promise.all([
          fetchWithInterceptor<Product[]>('/packages'),
          fetchWithInterceptor<OptionProduct[]>('/option-packages')
        ])

        if (mainResponse.success) {
          console.log('Fetched packages:', mainResponse.data)
          setAllPackages(mainResponse.data)
        }

        if (optionResponse.success) {
          console.log('Fetched option packages:', optionResponse.data)
          setAllOptionPackages(optionResponse.data)
        }
      } catch (err) {
        console.error('Error fetching packages:', err)
        setError(err instanceof Error ? err.message : 'An error occurred while fetching packages')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPackages()
  }, []) // Only fetch once when component mounts

  // Filter packages when marke or model changes
  useEffect(() => {
    console.log('Filtering packages with:', { marke, model, allPackages, allOptionPackages })
    
    // Filter main packages
    const filteredPackages = marke 
      ? allPackages.filter(pkg =>
        pkg.markeModels.some(mm => {
          if (model) {
            // If model is selected, match both marke and model
            return mm.marke.toLowerCase() === marke.toLowerCase() && 
                   mm.model.toLowerCase() === model.toLowerCase()
          } else {
            // If only marke is selected, match just the marke
            return mm.marke.toLowerCase() === marke.toLowerCase()
          }
        })
      )
      : allPackages; // Show all packages if no marke selected

    console.log('Filtered packages:', filteredPackages)
    setPackages(filteredPackages)

    // Filter option packages with the same logic
    const filteredOptionPackages = marke
      ? allOptionPackages.filter(pkg =>
        pkg.markeModels.some(mm => {
          if (model) {
            return mm.marke.toLowerCase() === marke.toLowerCase() && 
                   mm.model.toLowerCase() === model.toLowerCase()
          } else {
            return mm.marke.toLowerCase() === marke.toLowerCase()
          }
        })
      )
      : allOptionPackages;

    console.log('Filtered option packages:', filteredOptionPackages)
    setOptionPackages(filteredOptionPackages)
  }, [marke, model, allPackages, allOptionPackages])


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

  return (
    <>
      {/* Vehicle Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative" ref={markeDropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bilmerke</label>
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
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Modell</label>
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
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
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

      {/* Customer Info */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Kunde informasjon</label>
        <textarea
          value={info}
          onChange={(e) => setInfo(e.target.value)}
          rows={4}
          className="block w-full max-w-xl  rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
      </div>

      {/* Main Package - Custom Dropdown */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <PackageDropdown
          options={packages.map(transformToPackageOption)}
          value={selectedPackage}
          onChange={setSelectedPackage}
          label="Velg pakke"
        />
      )}

      {/* Option Packages */}
      {marke && model && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-teal-600 mb-1">Tilvalg</label>

          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : (
            <div className="border rounded-md p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {optionPackages.map((optionPackage) => (
                  <div key={optionPackage._id}>
                    <div className="flex justify-between">
                      <h3 className="font-medium mb-4">{optionPackage.name}</h3>
                      <div className="group relative inline-block">
                        <HelpCircle className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
                        <div className="invisible group-hover:visible absolute z-50 w-48 p-2  bg-gray-200 bg-opacity-50 text-black text-sm rounded-md shadow-lg -right-2 top-6">
                          {optionPackage.info}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {optionPackage.options.filter(option => option.isActive).map((option) => (
                        <div key={option.id} className="flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              id={option.id}
                              type="checkbox"
                              checked={option.isSelected}
                              onChange={() => {
                                const updatedOptions = optionPackage.options.map((opt) =>
                                  opt.id === option.id ? { ...opt, isSelected: !opt.isSelected } : opt
                                )
                                const updatedPackages = optionPackages.map((pkg) =>
                                  pkg._id === optionPackage._id
                                    ? { ...pkg, options: updatedOptions }
                                    : pkg
                                )
                                setOptionPackages(updatedPackages)
                              }}
                              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                            />
                          </div>
                          <label htmlFor={option.id} className="ml-3 text-sm text-gray-700">
                            {option.name} {option.price},-
                            {option.discountPrice && (
                              <span className="text-teal-600 ml-2">
                                / {Number(option.price) - Number(option.discountPrice)},-
                                {option.discountEndDate && (
                                  <>Kampanje
                                    <span className="text-gray-500 text-xs ml-1">
                                      ({(option.discountEndDate)})
                                    </span>
                                  </>
                                )}
                              </span>
                            )}
                          </label>
                        </div>
                      ))}
                      <button
                        className="mt-4 bg-teal-600 text-white px-4 py-1 rounded-md text-sm"
                        disabled={!optionPackage.options.find((opt) =>
                          opt.isSelected === true
                        )}
                        onClick={() => {
                          const selectedOptionPackage = optionPackages.find((pkg) => pkg._id === optionPackage._id)
                          if (selectedOptionPackage) {
                            const alreadyAddedPackage = addedOptionPackages.find(pkg => pkg._id === selectedOptionPackage._id)
                            if (alreadyAddedPackage) {
                              setAddedOptionPackages(prevVal => prevVal.map(val => {
                                if (val._id === selectedOptionPackage._id) return selectedOptionPackage
                                return val;
                              }))
                            } else {
                              setAddedOptionPackages(prevVal => [...prevVal, selectedOptionPackage])
                            }
                          }
                        }}>Legg til</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}


