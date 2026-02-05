'use client';
import { useState } from 'react';
import type { Transaction } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function DashboardClient({ initialTransactions }: { initialTransactions: Transaction[] }) {
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const { toast } = useToast();

    const handleBulkDelete = async (ids: number[]) => {
        if (ids.length === 0) return;
        // Mock API call
        setTimeout(() => {
            setTransactions(transactions.filter(t => !ids.includes(t.id)));
            toast({
                title: "Success",
                description: `${ids.length} transaction(s) deleted successfully.`,
            });
        }, 500);
    };

    const BulkActions = (table: any) => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        if (selectedRows.length === 0) return null;
    
        return (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="h-8 ml-2">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete ({selectedRows.length})
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the selected transactions.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                const idsToDelete = selectedRows.map((row: any) => row.original.id);
                                await handleBulkDelete(idsToDelete);
                                table.toggleAllPageRowsSelected(false);
                            }}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
      }

    return (
        <DataTable
            columns={columns}
            data={transactions}
            bulkActions={BulkActions}
        />
    );
}
