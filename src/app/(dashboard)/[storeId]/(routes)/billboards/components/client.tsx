"use client"

import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation"

const BillboardClient = () => {
    const params = useParams();
    const router = useRouter();
  return (
    <div className="flex items-center justify-between">
        <Heading title={`Billboards (0)`} description="Manage billboards for you store" />
        <Button onClick={() => router.push(`/${params.storeId}/billboards/create`)}><Plus className="h-4 w-4 mr-2" /> Add New</Button>
    </div>
  )
}

export default BillboardClient