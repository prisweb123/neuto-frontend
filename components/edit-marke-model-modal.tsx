"use client"

import { X } from "lucide-react"
import { useState, useEffect } from "react"

interface EditMarkeModelModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { name: string; model: string; active: boolean }) => void
  initialData: { name: string; model: string; active: boolean }
}

export default function EditMarkeModelModal({ isOpen, onClose, onSave, initialData }: EditMarkeModelModalProps) {
  // Ensure initialData has default values to prevent undefined errors
  const safeInitialData = {
    name: initialData?.name || "",
    model: initialData?.model || "",
    active: initialData?.active ?? true,
  }

  const [name, setName] = useState(safeInitialData.name)
  const [model, setModel] = useState(safeInitialData.model)
  const [active, setActive] = useState(safeInitialData.active)

  // Update state when initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name || "")
      setModel(initialData.model || "")
      setActive(initialData.active ?? true)
    }
  }, [initialData, isOpen])

  const handleSave = () => {
    if(!name || !model) return
    onSave({ name, model, active })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-6 pb-4">
          <h2 className="text-xl font-semibold">Legg til/ Endre</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 pt-2">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Merke</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Eks. Porsche..."
              className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Modell</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Eks. 911 TurboS..."
              className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center mb-6">
            <label className="inline-flex items-center cursor-pointer">
              <div
                className={`relative ${active ? "bg-blue-500" : "bg-gray-200"} w-10 h-6 rounded-full transition-colors duration-200 ease-in-out`}
              >
                <input type="checkbox" className="sr-only" checked={active} onChange={() => setActive(!active)} />
                <span
                  className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${active ? "transform translate-x-4" : ""}`}
                ></span>
              </div>
              <span className="ml-2 text-sm text-gray-700">Aktiv</span>
            </label>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Gå tilbake
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-teal-600 border border-transparent rounded-md text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Legg til
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

