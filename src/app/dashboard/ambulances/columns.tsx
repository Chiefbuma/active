"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown, Edit, Trash2 } from "lucide-react"
import type { Ambulance } from "@/lib/types"
import { TransactButton } from "../view-ambulance-button"
import { Badge } from "@/components/ui/badge"

interface AmbulancesColumnsProps {
  onEdit: (ambulance: Ambulance) => void
  onDelete: (ambulance: Ambulance) => void
}

export const getColumns = ({ onEdit, onDelete }: AmbulancesColumnsProps): ColumnDef<Ambulance>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
     cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <Badge variant={status === 'active' ? "secondary" : "destructive"} className="capitalize">{status}</Badge>
    }
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const ambulance = row.original
      return (
        <div className="text-right flex items-center justify-end gap-1">
            <TransactButton ambulanceId={ambulance.id} />
             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(ambulance)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-600" onClick={() => onDelete(ambulance)}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
            </Button>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
]
