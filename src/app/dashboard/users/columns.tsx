"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import type { User } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface UsersColumnsProps {
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  currentUserId?: number
}

export const getColumns = ({ onEdit, onDelete, currentUserId }: UsersColumnsProps): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
   {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return <Badge variant="secondary" className="capitalize">{role}</Badge>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      const isCurrentUser = user.id === currentUserId;

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
                <DropdownMenuItem onClick={() => onEdit(user)} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(user)} 
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  disabled={isCurrentUser}
                >
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
