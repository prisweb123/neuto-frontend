import { HelpCircle, Trash2 } from "lucide-react"
import { OptionProduct, Product } from "./type"
import { useMemo } from "react";
import { formatDate } from "@/lib/utils";

export default function PackageSummary({ packages, selectedPackage, addedOptionPackages, setAddedOptionPackages, setSelectedPackage }
  :
  { packages: Product[]; selectedPackage: string, addedOptionPackages: OptionProduct[]; setAddedOptionPackages: React.Dispatch<React.SetStateAction<OptionProduct[]>>, setSelectedPackage: React.Dispatch<React.SetStateAction<string>> }
) {
  const packageObject = useMemo(() => packages.find(_package => _package._id === selectedPackage), [selectedPackage, packages])

  const features = useMemo(() => {
    if (packageObject) {
      return packageObject.include[0]
        .split("\n")
        .map((line) => line.replace(/^[•\s]+/, "").trim())
        .filter((line) => line.length > 0)
    }
    return []
  }, [packageObject])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Package Summary */}
      {packageObject && <div className="bg-amber-100 border-l-4 border-blue-500 p-4 rounded-r-md relative">
        <div className="flex justify-between">
          <h3 className="font-medium">
            {packageObject.name} - <span className={`${packageObject.discount && 'line-through'}`}>{packageObject.price},-/</span>{" "}
            {packageObject.discount && <span className="text-red-600">{packageObject.price - packageObject.discount},- {packageObject.endDate && (`Kampanje ${formatDate(packageObject.endDate)}`)}</span>}
          </h3>
          <button className="text-gray-500">
            <Trash2 className="h-5 w-5" onClick={() => {
              setSelectedPackage("")
            }} />
          </button>
        </div>

        <div className="mt-2">
          <ul className="mt-2 space-y-1 text-sm">
            {features.map((feature, index) => <li key={index} className="flex items-start">
              <span className="mr-1">•</span>
              <span>{feature}</span>
            </li>)}
          </ul>
        </div>

        <button className="group absolute bottom-2 right-2 text-gray-500">
          <HelpCircle className="h-4 w-4 text-gray-400 ml-2 cursor-help" />
          <div className="invisible group-hover:visible absolute z-50 w-48 p-2  bg-gray-200 bg-opacity-50 text-black text-sm rounded-md shadow-lg -right-2 top-6">
            {packageObject.info}
          </div>
        </button>
      </div>}

      {addedOptionPackages.map((_package, index) => <div key={index} className="bg-amber-100 p-4 rounded-md relative">
        <div className="flex justify-between">
          <h3 className="font-medium">{_package.name}</h3>
          <button className="text-gray-500">
            <Trash2 className="h-5 w-5" onClick={() => {
              setAddedOptionPackages(addedOptionPackages.filter((_, _index) => _index !== index))
            }} />
          </button>
        </div>

        {_package.options.filter(_option => _option.isSelected).map((option) => (
          <div key={option.id} className="flex items-start">
            <div className="flex h-5 items-center">

            </div>
            <label htmlFor={option.id} className="ml-3 text-sm text-gray-700">
              <span className="mr-1">•</span>
              {option.name} {option.price},-
              {option.discountPrice && (
                <span className="text-red-600 ml-2">
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

      </div>)}


    </div>
  )
}

