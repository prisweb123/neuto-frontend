"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/layout/admin-layout"
import ProductCard from "@/components/products/product-card"
import AddEditPackageModal from "@/components/products/add-edit-package-modal"
import AddEditOptionsModal from "@/components/products/add-edit-options-modal"
import OptionProductCard from "@/components/products/option-product-card"
import { fetchWithInterceptor } from "@/lib/fetch-interceptor"
import { formatDate } from "@/lib/utils"
import { BASE_URL } from "@/lib/fetch-interceptor"


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

interface Product {
  _id: string
  name: string
  description: string
  image: string
  markeModels: MarkeModelPair[]
  // model: string
  price: number
  discount?: number
  endDate?: string
  include: string
  info: string
}

interface OptionProduct {
  _id: string
  name: string
  markeModels: MarkeModelPair[]
  info: string
  options: OptionItem[]
}

export default function ProductsPage() {
  const [mainPackages, setMainPackages] = useState<Product[]>([])
  const [optionPackages, setOptionPackages] = useState<OptionProduct[]>([])
  const [isMainPackageModalOpen, setIsMainPackageModalOpen] = useState(false)
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<Product | null>(null)
  const [editingOptionPackage, setEditingOptionPackage] = useState<OptionProduct | null>(null)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const [mainResponse, optionResponse] = await Promise.all([
        fetchWithInterceptor<Product[]>('/packages'),
        fetchWithInterceptor<OptionProduct[]>('/option-packages')
      ])
      if (mainResponse.success) {
        setMainPackages(mainResponse.data)
      }
      if (optionResponse.success) {
        setOptionPackages(optionResponse.data)
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
    }
  }

  const handleAddMainPackage = () => {
    setEditingPackage(null)
    setIsMainPackageModalOpen(true)
  }

  const handleAddOptionPackage = () => {
    setEditingOptionPackage(null)
    setIsOptionsModalOpen(true)
  }

  const handleEditProduct = (productId: string, isMainPackage: boolean = false) => {
    const mainPackage = mainPackages.find((p) => p._id === productId)
    const optionPackage = optionPackages.find((p) => p._id === productId)

    if (isMainPackage && mainPackage) {
      setEditingPackage(mainPackage)
      setIsMainPackageModalOpen(true)
    } else if (!isMainPackage && optionPackage) {
      setEditingOptionPackage(optionPackage)
      setIsOptionsModalOpen(true)
    }
  }

  const handleSaveMainPackage = async (formData: FormData) => {
    try {
      if (editingPackage) {
        // Update existing package
        const { data: updatedPackage, success } = await fetchWithInterceptor<Product>(`/packages/${editingPackage._id}`, {
          method: 'PUT',
          body: formData,
        })
        if (success) {
          setMainPackages(mainPackages.map((p) => (p._id === editingPackage._id ? updatedPackage : p)))
        }
      } else {
        // Add new package
        const { data: newPackage, success } = await fetchWithInterceptor<Product>('/packages', {
          method: 'POST',
          body: formData,
        })
        if (success) {
          setMainPackages([...mainPackages, newPackage])
        }
      }

      setIsMainPackageModalOpen(false)
      setEditingPackage(null)
    } catch (error) {
      console.error('Error saving package:', error)
    }
  }

  const handleDeleteProduct = async (productId: string, isMainPackage: boolean = false) => {
    try {
      if (isMainPackage) {
        const { success } = await fetchWithInterceptor(`/packages/${productId}`, {
          method: 'DELETE'
        })
        if (success) {
          setMainPackages(mainPackages.filter((p) => p._id !== productId))
        }
      } else {
        const { success } = await fetchWithInterceptor(`/option-packages/${productId}`, {
          method: 'DELETE'
        })
        if (success) {
          setOptionPackages(optionPackages.filter((p) => p._id !== productId))
        }
      }
    } catch (error) {
      console.error('Error deleting package:', error)
    }
  }

  const handleSaveOptionsPackage = async (data: {
    name: string
    markeModels: MarkeModelPair[]
    info: string
    options: OptionItem[]
  }) => {
    try {
      if (editingOptionPackage) {
        // Update existing package
        const { data: updatedPackage, success } = await fetchWithInterceptor<OptionProduct>(`/option-packages/${editingOptionPackage._id}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        })
        if (success) {
          setOptionPackages(optionPackages.map((p) => (p._id === editingOptionPackage._id ? updatedPackage : p)))
        }
      } else {
        // Add new package
        const { data: newPackage, success } = await fetchWithInterceptor<OptionProduct>('/option-packages', {
          method: 'POST',
          body: JSON.stringify(data)
        })
        if (success) {
          setOptionPackages([...optionPackages, newPackage])
        }
      }

      setIsOptionsModalOpen(false)
      setEditingOptionPackage(null)
    } catch (error) {
      console.error('Error saving option package:', error)
    }
  }

  return (
    <AdminLayout title="Tjenester/Varer">
      <div className="space-y-6">
        {/* Main Packages */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Pakke</h2>
            <button
              className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm"
              onClick={handleAddMainPackage}
            >
              Opprett ny pakke
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mainPackages.map((product) => (
              <ProductCard
                key={product._id}
                name={product.name}
                description={product.description}
                image={`${BASE_URL}/packages/image/${product._id}`}
                price={product.price}
                discount={product.discount}
                include={product.include}
                campaign={product.discount && product.discount > 0 && product.endDate ? `KAMPANJE - ${formatDate(product.endDate)}` : undefined}
                info={product.info}
                onEdit={() => handleEditProduct(product._id, true)}
                onDelete={() => handleDeleteProduct(product._id, true)}
              />
            ))}
          </div>
        </div>

        {/* Option Packages */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Tilvalg</h2>
            <button
              className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm"
              onClick={handleAddOptionPackage}
            >
             Opprett nytt tilvalg
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {optionPackages.map((product) => (
              <OptionProductCard
                key={product._id}
                name={product.name}
                campaign={undefined}
                onEdit={() => handleEditProduct(product._id)}
                onDelete={() => handleDeleteProduct(product._id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Main Package Modal */}
      <AddEditPackageModal
        isOpen={isMainPackageModalOpen}
        onClose={() => setIsMainPackageModalOpen(false)}
        onSave={handleSaveMainPackage}
        initialData={
          editingPackage
            ? {
              name: editingPackage.name,
              description: editingPackage.description || "",
              image: `${BASE_URL}/packages/image/${editingPackage._id}`,
              markeModels: editingPackage.markeModels || [],
              price: editingPackage.price.toString(),
              discount: editingPackage.discount
                ? (editingPackage.discount).toString()
                : "",
              endDate: editingPackage.endDate || "",
              include: editingPackage.include,
            }
            : {
              name: "",
              description: "",
              image: "",
              markeModels: [],
              price: "",
              discount: "",
              endDate: "",
              include: "",
            }
        }
      />

      {/* Add/Edit Options Package Modal */}
      <AddEditOptionsModal
        isOpen={isOptionsModalOpen}
        onClose={() => setIsOptionsModalOpen(false)}
        onSave={handleSaveOptionsPackage}
        initialData={
          editingOptionPackage
            ? {
              name: editingOptionPackage.name,
              markeModels: editingOptionPackage.markeModels || [],
              info: editingOptionPackage.info || "",
              options: editingOptionPackage.options || [],
            }
            : {
              name: "",
              markeModels: [],
              info: "",
              options: [],
            }
        }
      />
    </AdminLayout>
  )
}

