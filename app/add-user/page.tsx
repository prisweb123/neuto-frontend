"use client"

import { useState, useEffect } from "react"
import { fetchWithInterceptor } from "@/lib/fetch-interceptor"
import AdminLayout from "@/components/layout/admin-layout"
import DataTable from "@/components/tables/data-table"
import StatusBadge from "@/components/ui/status-badge"
import ActionMenu from "@/components/ui/action-menu"
import UserTableHeader from "@/components/users/user-table-header"
import AddEditUserModal from "@/components/add-edit-user-modal"

export interface User {
  _id: string
  email: string
  role: string
  name: string
  mobile: string
  active: boolean
}

export default function AddUserPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUserIndex, setEditingUserIndex] = useState<number | null>(null)

  const fetchUsers = async () => {
    try {
      setIsLoading(true)

      const { data, success } = await fetchWithInterceptor<User[]>('/users')

      if (success) {
        setUsers(data)
      }
    } catch (err) {
      console.error('Error fetching users:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const toggleActive = async (id: string, index: number) => {
    try {
      const { success } = await fetchWithInterceptor(`/users/${id}/toggle-active`, {
        method: 'PATCH',
        body: JSON.stringify({})
      })

      if (success) {
        const updatedUsers = [...users]
        updatedUsers[index].active = !updatedUsers[index].active
        setUsers(updatedUsers)
      }
    } catch (err) {
    }
  }

  const handleAddUserClick = () => {
    setEditingUserIndex(null)
    setIsModalOpen(true)
  }

  const handleEditUserClick = (index: number) => {
    setEditingUserIndex(index)
    setIsModalOpen(true)
  }

  const handleDeleteUserClick = async (id: string, index: number) => {
    try {
      const { success } = await fetchWithInterceptor(`/users/${id}`, {
        method: 'DELETE'
      })


      if (success) {
        const updatedUsers = [...users]
        updatedUsers.splice(index, 1)
        setUsers(updatedUsers)
      }
    } catch (err) {
    }
  }

  const handleSaveUser = async (data: User) => {
    if (editingUserIndex !== null && editingUserIndex < users.length) {
      const updatedUsers = [...users]
      updatedUsers[editingUserIndex] = { ...updatedUsers[editingUserIndex], ...data }
      setUsers(updatedUsers)
    } else {
      setUsers([...users, data])
    }
    setIsModalOpen(false)
    setEditingUserIndex(null)
  }

  const columns = [
    { header: "Email", accessor: "email" as keyof User },
    { header: "Rolle", accessor: (user: User) => user.role === 'admin' ? 'Administrator' : 'Selger' },
    {
      header: "Navn/ Tlf",
      accessor: (user: User) => `${user.name} - ${user.mobile}`,
    },
    {
      header: "Status",
      accessor: (user: User) => <StatusBadge active={user.active} />,
    },
    {
      header: "",
      accessor: (user: User, index: number) => (
        <ActionMenu
          items={[
            {
              label: "Change",
              onClick: () => handleEditUserClick(index),
            },
            {
              label: user.active ? "Stop Access" : "Give Access",
              onClick: () => toggleActive(user._id, index),
            },
            {
              label: "Delete",
              onClick: () => handleDeleteUserClick(user._id, index),
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

  if (isLoading) {
    return (
      <AdminLayout title="">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="">
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <UserTableHeader onAddUser={handleAddUserClick} />

        <DataTable columns={columns} data={users} keyExtractor={(_, index) => index} />
      </div>

      {/* Add/Edit User Modal */}
      <AddEditUserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingUserIndex(null)
        }}
        onSave={handleSaveUser}
        initialData={
          editingUserIndex !== null && editingUserIndex < users.length
            ? {
              name: users[editingUserIndex].name,
              phone: users[editingUserIndex].mobile,
              email: users[editingUserIndex].email,
              password: "",
              role: users[editingUserIndex].role,
              active: users[editingUserIndex].active,
            }
            : {
              name: "",
              phone: "",
              email: "",
              password: "",
              role: "",
              active: true
            }
        }
        _id={editingUserIndex !== null && editingUserIndex < users.length ? users[editingUserIndex]._id : ''}
        isEditing={editingUserIndex !== null}
      />
    </AdminLayout>
  )
}

