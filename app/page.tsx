"use client"

import { useAuth } from "@/contexts/auth-context"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default function Home() {
  const { user } = useAuth()
  if (user) redirect("/price-offer")
  else redirect("/login")
}

