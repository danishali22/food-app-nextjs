"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BillboardColumns = {
  id: string;
  label: string;
  imageUrl: string;
  createdAt: string;
};

export const columns: ColumnDef<BillboardColumns>[] = [
  {
    accessorKey: "imageUrl",
    header: "Image",
  },
  {
    accessorKey: "label",
    header: "Billboard Name",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
];
