"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { AmbulancePerformanceData } from "@/lib/types"

const formatCurrency = (value: number) => {
    if (typeof value !== 'number') return '-';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

export const columns: ColumnDef<AmbulancePerformanceData>[] = [
    {
        accessorKey: "reg_no",
        header: "Bus",
        cell: ({ row }) => {
            return (
                <div className="font-medium">{row.original.reg_no}</div>
            )
        },
    },
    {
        accessorKey: "total_target",
        header: () => <div className="text-right">Target</div>,
        cell: ({ row }) => <div className="text-right">{formatCurrency(row.original.total_target)}</div>
    },
    {
        accessorKey: "total_net_banked",
        header: () => <div className="text-right">Net Banked</div>,
        cell: ({ row }) => <div className="text-right">{formatCurrency(row.original.total_net_banked)}</div>
    },
]
