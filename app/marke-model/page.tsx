"use client"

import { useState, useEffect } from "react"
import { fetchWithInterceptor } from "@/lib/fetch-interceptor"
import AdminLayout from "@/components/layout/admin-layout"
import DataTable from "@/components/tables/data-table"
import StatusBadge from "@/components/ui/status-badge"
import ActionMenu from "@/components/ui/action-menu"
import EditMarkeModelModal from "@/components/edit-marke-model-modal"

interface Vehicle {
  _id: string
  name: string
  model: string
  active: boolean
}

export default function MarkeModelPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVehicleIndex, setEditingVehicleIndex] = useState<number | null>(null)

  const fetchVehicles = async () => {
    try {
      setIsLoading(true)

      const { data, success } = await fetchWithInterceptor<Vehicle[]>('/products')

      if (success) {
        setVehicles(data)
      }
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  const toggleActive = async (id: string, index: number) => {
    try {
      const { success } = await fetchWithInterceptor(`/products/${id}/toggle-active`, {
        method: 'PATCH',
        body: JSON.stringify({})
      })

      if (success) {
        const updatedVehicles = [...vehicles]
        updatedVehicles[index].active = !updatedVehicles[index].active
        setVehicles(updatedVehicles)
      }
    } catch (err) {
    }
  }

  const handleAddVehicleClick = () => {
    setEditingVehicleIndex(null)
    setIsModalOpen(true)
  }

  const handleChangeClick = (index: number) => {
    setEditingVehicleIndex(index)
    setIsModalOpen(true)
  }

  const handleDeleteClick = async (id: string, index: number) => {
    try {
      const { success } = await fetchWithInterceptor(`/products/${id}`, {
        method: 'DELETE'
      })

      if (success) {
        const updatedVehicles = [...vehicles]
        updatedVehicles.splice(index, 1)
        setVehicles(updatedVehicles)
      }
    } catch (err) {
    }
  }

  const handleSaveVehicle = async (data: { name: string; model: string; active: boolean }) => {
    try {
      if (editingVehicleIndex !== null) {
        // Edit existing vehicle
        const { success } = await fetchWithInterceptor(`/products/${vehicles[editingVehicleIndex]._id}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        })

        if (success) {
          const updatedVehicles = [...vehicles]
          updatedVehicles[editingVehicleIndex] = { ...data, _id: vehicles[editingVehicleIndex]._id }
          setVehicles(updatedVehicles)
        }
      } else {
        // Add new vehicle
        const { data: newVehicle, } = await fetchWithInterceptor<Vehicle>('/products', {
          method: 'POST',
          body: JSON.stringify(data)
        })


        setVehicles([...vehicles, newVehicle])
      }
      setIsModalOpen(false)
      setEditingVehicleIndex(null)
    } catch (err) {
    }
  }

  const columns = [
    { header: "Merke", accessor: "name" as keyof Vehicle },
    { header: "Modell", accessor: "model" as keyof Vehicle },
    {
      header: "Aktiv/Ikke aktive",
      accessor: (vehicle: Vehicle, index: number) => (
        <StatusBadge active={vehicle.active} onClick={() => toggleActive(vehicle._id, index)} />
      ),
    },
    {
      header: "",
      accessor: (vehicle: Vehicle, index: number) => (
        <ActionMenu
          items={[
            {
              label: "Endre",
              onClick: () => handleChangeClick(index),
            },
            {
              label: "Slett",
              onClick: () => handleDeleteClick(vehicle._id, index),
              color: "text-red-500",
              requireConfirm: true,
              confirmDescription: "Are you sure you want to delete this?",
            },
          ]}
        />
      ),
      className: "w-10",
    },
  ]

  // Default values for a new vehicle
  const defaultVehicle: Omit<Vehicle, '_id'> = {
    name: "",
    model: "",
    active: true,
  }

  if (isLoading) {
    return (
      <AdminLayout title="Marke - Model">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Marke - Model">
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-lg font-medium">Oversikt</h2>
          <button className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm" onClick={handleAddVehicleClick}>
          Legg til ny
          </button>
        </div>

        <DataTable columns={columns} data={vehicles} keyExtractor={(vehicle) => vehicle._id} />
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <EditMarkeModelModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingVehicleIndex(null)
          }}
          onSave={handleSaveVehicle}
          initialData={editingVehicleIndex !== null ? vehicles[editingVehicleIndex] : defaultVehicle}
        />
      )}
    </AdminLayout>
  )
}

