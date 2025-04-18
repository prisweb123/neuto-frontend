"use client"
import { User } from "@/app/add-user/page"
import { fetchWithInterceptor } from "@/lib/fetch-interceptor"
import { useState, useEffect } from "react"

interface AddEditUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: User) => void
  initialData?: { name: string; phone: string; email: string; password: string; role: string, active: boolean }
  isEditing: boolean
  _id: string
}

export default function AddEditUserModal({
  isOpen,
  onClose,
  onSave,
  initialData = { name: "", phone: "", email: "", password: "", role: "", active: true },
  isEditing,
  _id
}: AddEditUserModalProps) {
  const [name, setName] = useState(initialData.name)
  const [phone, setPhone] = useState(initialData.phone)
  const [email, setEmail] = useState(initialData.email)
  const [password, setPassword] = useState(initialData.password)
  const [role, setRole] = useState(initialData.role)
  const [active, setActive] = useState(initialData.active)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Update state when initialData changes
  useEffect(() => {
    if (isOpen) {
      setName(initialData.name)
      setPhone(initialData.phone)
      setEmail(initialData.email)
      setPassword(initialData.password)
      setRole(initialData.role)
      setActive(initialData.active)
      setError(null)
    }
  }, [initialData, isOpen])

  const validateForm = () => {
    if (!name || !phone || !email || (!isEditing && !password) || !role) {
      setError("Please fill in all required fields")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return false
    }
    return true
  }

  const handleSave = async () => {
    try {
      if (!validateForm()) return

      setIsLoading(true)

      if (!isEditing) {
        const { data, success } = await fetchWithInterceptor<User>('/users/register', {
          method: "POST",
          body: JSON.stringify({
            name,
            mobile: phone,
            email,
            password,
            role,
          }),
        })
        if (success) {
          onSave({ name, mobile: phone, email, role, _id: data._id, active })
        }
      } else {
        const { success } = await fetchWithInterceptor(`/users/${_id}`, {
          method: "PUT",
          body: JSON.stringify({
            name,
            mobile: phone,
            email,
            role,
            active
          }),
        })

        if (success) {
          onSave({ name, mobile: phone, email, role, active, _id })
        }
      }

      onClose()
    } catch (err) {
      setError("An error occurred while saving the user")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-8">
        <h2 className="text-2xl font-semibold text-center mb-8">Legg til selger</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ditt navn*</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ditt navn"
              className="block w-full rounded-md border border-gray-300 py-2 px-3 bg-gray-50 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobilnummer*</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="12345678"
              className="block w-full rounded-md border border-gray-300 py-2 px-3 bg-gray-50 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">E-postadresse*</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@epost.no"
              className="block w-full rounded-md border border-gray-300 py-2 px-3 bg-gray-50 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          {!isEditing && <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Passord{!isEditing && "*"}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="**********"
              className="block w-full rounded-md border border-gray-300 py-2 px-3 bg-gray-50 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Velg rolle*</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 appearance-none"
              >
                <option value="">Velg rolle</option>
                <option value="admin">Administrator</option>
                <option value="seller">Selger</option>

              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 focus:outline-none"
            disabled={isLoading}
          >
            Gå tilbake
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-8 py-2 bg-teal-600 border border-transparent rounded-full text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : isEditing ? "Legg til" : "Opprett"}
          </button>
        </div>
      </div>
    </div>
  )
}

