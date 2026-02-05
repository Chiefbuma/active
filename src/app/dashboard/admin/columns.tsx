"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { AmbulancePerformanceData } from "@/lib/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
    return `${value.toFixed(0)}%`;
}

export const columns: ColumnDef<AmbulancePerformanceData>[] = [
    {
        id: "rank",
        header: "#",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "reg_no",
        header: "Ambulance",
        cell: ({ row }) => {
            const ambulance = row.original;
            const fallback = ambulance.reg_no.substring(0, 3);
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 hidden sm:flex">
                        <AvatarFallback>{fallback}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{ambulance.reg_no}</span>
                </div>
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
    {
        accessorKey: "avg_performance",
        header: () => <div className="text-right">Performance</div>,
        cell: ({ row }) => {
            const performance = row.original.avg_performance;
            return (
                <div className="text-right">
                    <Badge variant={performance >= 100 ? "secondary" : "destructive"}>{formatPercentage(performance)}</Badge>
                </div>
            )
        }
    },
]
