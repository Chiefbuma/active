"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Eye } from "lucide-react"
import type { Ambulance } from "@/lib/types"
import Link from "next/link"

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KES' }).format(value);

export const columns: ColumnDef<Ambulance>[] = [
  {
    accessorKey: "reg_no",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Registration No.
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("reg_no")}</div>,
  },
  {
    accessorKey: "target",
    header: "Daily Target",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("target"))
      return <div className="font-medium">{formatCurrency(amount)}</div>
    },
  },
    {
    accessorKey: "fuel_cost",
    header: "Default Fuel Cost",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("fuel_cost"))
      return <div className="font-medium">{formatCurrency(amount)}</div>
    },
  },
  {
    accessorKey: "operation_cost",
    header: "Default Operation Cost",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("operation_cost"))
      return <div className="font-medium">{formatCurrency(amount)}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const ambulance = row.original
      return (
        <div className="text-right">
            <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/ambulance/${ambulance.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Dashboard
                </Link>
            </Button>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
]
