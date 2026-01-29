'use client';
import { useState } from 'react';
import type { Patient } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
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

export default function DashboardClient({ initialPatients }: { initialPatients: Patient[] }) {
    const [patients, setPatients] = useState<Patient[]>(initialPatients);
    const { toast } = useToast();

    const fetchPatients = async () => {
        try {
            const res = await fetch('/api/patients');
            const data = await res.json();
            setPatients(data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch patients.",
            });
        }
    };

    const handleBulkDelete = async (ids: number[]) => {
        if (ids.length === 0) return;
        try {
            const res = await fetch(`/api/patients`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to delete patients');
            }
            toast({
                title: "Success",
                description: `${ids.length} patient(s) deleted successfully.`,
            });
            await fetchPatients();
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: (error as Error).message });
        }
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
                            This action cannot be undone. This will permanently delete the selected patients and all their associated data.
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
            data={patients}
            bulkActions={BulkActions}
        />
    );
}
