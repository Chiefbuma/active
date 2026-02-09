"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Transaction } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

const formatCurrency = (value: number) => {
    if (typeof value !== 'number') return '-';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const formatPercentage = (value: number) => {
    if (typeof value !== 'number') return '-';
    return `${(value * 100).toFixed(0)}%`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getColumns = (): ColumnDef<Transaction>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const date = row.getValue("date") as string | null;
        if (!date) return <span className="text-muted-foreground">-</span>
        return <div>{new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
    },
  },
  {
    accessorKey: "driver",
    header: "Driver",
    cell: ({ row }) => {
      const driver = row.original.driver
      return <div>{driver.name}</div>
    }
  },
  {
    accessorKey: "emergency_technicians",
    header: "Technicians",
    cell: ({ row }) => {
      const technicians = row.original.emergency_technicians
      if (!technicians || technicians.length === 0) return '-';
      return <div className="truncate max-w-xs">{technicians.map(t => t.name).join(', ')}</div>
    }
  },
  {
    accessorKey: "total_till",
    header: () => <div className="text-right">Total Till</div>,
    cell: ({row}) => <div className="text-right font-medium">{formatCurrency(row.original.total_till)}</div>
  },
  {
    accessorKey: "performance",
    header: () => <div className="text-center">Performance</div>,
    cell: ({row}) => {
      const performance = row.original.performance;
      return <div className="text-center"><Badge variant={performance >= 1 ? "secondary" : "destructive"}>{formatPercentage(performance)}</Badge></div>
    }
  },
  {
    accessorKey: "net_banked",
    header: () => <div className="text-right">Net Banked</div>,
    cell: ({row}) => <div className="text-right font-medium">{formatCurrency(row.original.net_banked)}</div>
  },
  {
    accessorKey: "deficit",
    header: () => <div className="text-right">Deficit</div>,
    cell: ({row}) => {
      const deficit = row.original.deficit;
      const formattedDeficit = formatCurrency(deficit);
      return <div className={`text-right font-medium ${deficit > 0 ? 'text-red-500' : ''}`}>{formattedDeficit}</div>
    }
  },
]
