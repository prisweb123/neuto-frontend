"use client"

import AdminLayout from "@/components/layout/admin-layout"
import PricingInterface from "@/components/pricing/pricing-interface"
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PriceOfferContent() {
  const searchParams = useSearchParams();
  const offerId = searchParams.get('id');
  
  return <PricingInterface offerId={offerId} />;
}

export default function PriceOfferPage() {
  return (
    <AdminLayout title="">
      <Suspense fallback={<div>Loading...</div>}>
        <PriceOfferContent />
      </Suspense>
    </AdminLayout>
  )
}

