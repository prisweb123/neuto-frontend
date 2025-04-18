"use client"

import { useEffect, useRef } from "react"
import { Settings, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface SidebarMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const { logout, user } = useAuth()
  const router = useRouter()

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && isOpen) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose}></div>
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-40 bg-gray-50 shadow-lg flex flex-col transition-transform duration-300 ease-in-out rounded-r-3xl transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-5 font-bold text-gray-800 text-center">MENU</div>

        <div className="p-4">
          <div className="text-sm text-gray-500 mb-2">Bruker logget inn:</div>
          <div className="font-medium">{user?.name || "Guest"}</div>
          <div className="text-xs text-teal-600 mt-1">{user ? user.role === 'admin' ? 'Administrator' : 'Selger' : "None"}</div>
        </div>

        {/* Empty flex-1 space where navigation items were */}
        <div className="flex-1 border-r border-gray-200"></div>

        {/* Only keep the action buttons at the bottom */}
        <div className="p-6 flex flex-col items-center space-y-4">
          <button 
            onClick={() => router.push('/settings')} 
            className="p-3 rounded-full border border-teal-200 text-teal-600 hover:bg-teal-50"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button onClick={logout} className="p-3 rounded-full border border-teal-200 text-teal-600 hover:bg-teal-50">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

