"use client"

import { DataTable } from "@/components/data-table";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BillBoard } from "@/types/types-db";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BillboardColumns, columns } from "./columns";

interface BillboardClientProps {
  data: BillboardColumns[],
}

const BillboardClient = ({data}: BillboardClientProps) => {
    const params = useParams();
    const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (0)`}
          description="Manage billboards for you store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/create`)}
        >
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </div>

      <Separator />

      <DataTable columns={columns} data={data} />
    </>
  );
}

export default BillboardClient