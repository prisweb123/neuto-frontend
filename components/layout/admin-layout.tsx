import type React from "react"
import Navigation from "@/components/navigation"
import { Suspense } from "react"

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto bg-white rounded-3xl shadow-sm max-w-7xl overflow-hidden">
        <Navigation />

        {/* Main Content */}
        <main className="p-6 md:p-10">
          <h1 className="text-2xl font-bold mb-10">{title}</h1>
          <Suspense fallback={null}>
          {children}
          </Suspense>
        </main>
      </div>
    </div>
  )
}

