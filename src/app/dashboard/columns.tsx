"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { placeholderImages } from "@/lib/placeholder-images"
import type { Patient } from "@/lib/types"
import Link from "next/link"

const patientAvatar = placeholderImages.find(p => p.id === 'patient-avatar');

export const columns: ColumnDef<Patient>[] = [
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
    accessorKey: "first_name",
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
      const patient = row.original
      const name = `${patient.first_name} ${patient.surname || ''}`
      const fallback = `${patient.first_name[0]}${patient.surname ? patient.surname[0] : ''}`

      return (
        <div className="flex items-center gap-4">
            <Avatar className="hidden h-10 w-10 sm:flex">
                {patientAvatar && <AvatarImage src={patientAvatar.imageUrl} alt={name} />}
                <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
                <p className="font-medium leading-none">{name}</p>
                <p className="text-sm text-muted-foreground">{patient.corporate_name || 'No Corporate'}</p>
            </div>
        </div>
      )
    },
  },
  {
    accessorKey: "wellness_date",
    header: "Wellness Date",
    cell: ({ row }) => {
        const date = row.getValue("wellness_date") as string | null;
        if (!date) return <span className="text-muted-foreground">-</span>
        return <div>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const patient = row.original
      return (
        <div className="text-right">
            <Button asChild size="sm" variant="outline">
            <Link href={`/patient/${patient.id}`}>
                View <ArrowUpRight className="h-4 w-4 ml-2" />
            </Link>
            </Button>
        </div>
      )
    },
  },
]
