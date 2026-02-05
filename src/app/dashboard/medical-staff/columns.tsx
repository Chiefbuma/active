"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import type { EmergencyTechnician } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MedicalStaffColumnsProps {
  onEdit: (staff: EmergencyTechnician) => void
  onDelete: (staff: EmergencyTechnician) => void
}

export const getColumns = ({ onEdit, onDelete }: MedicalStaffColumnsProps): ColumnDef<EmergencyTechnician>[] => [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const staff = row.original;
      const name = staff.name;
      const fallback = name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '';
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={staff.avatarUrl} alt={name} />
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{name}</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const staff = row.original
      return (
        <div className="text-right">
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onEdit(staff)} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(staff)} className="cursor-pointer text-red-600 focus:text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
]
