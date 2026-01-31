'use client';

import { useState } from 'react';
import type { Corporate } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { getColumns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

export default function CorporatesClient({ initialCorporates }: { initialCorporates: Corporate[] }) {
  const [corporates, setCorporates] = useState<Corporate[]>(initialCorporates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCorporate, setEditingCorporate] = useState<Corporate | null>(null);
  const [formData, setFormData] = useState({ name: '', wellness_date: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchCorporates = async () => {
    try {
      const res = await fetch('/api/corporates');
      const data = await res.json();
      setCorporates(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch corporates.",
      });
    }
  };

  const handleOpenModal = (corporate: Corporate | null) => {
    setEditingCorporate(corporate);
    if (corporate) {
      const formattedDate = corporate.wellness_date ? new Date(corporate.wellness_date).toISOString().split('T')[0] : '';
      setFormData({ name: corporate.name, wellness_date: formattedDate });
    } else {
      setFormData({ name: '', wellness_date: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCorporate(null);
    setFormData({ name: '', wellness_date: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const url = editingCorporate ? `/api/corporates/${editingCorporate.id}` : '/api/corporates';
    const method = editingCorporate ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`Failed to ${editingCorporate ? 'update' : 'create'} corporate`);

      toast({
        title: "Success",
        description: `Corporate ${editingCorporate ? 'updated' : 'created'} successfully.`,
      });
      await fetchCorporates();
      handleCloseModal();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: (error as Error).message });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSingleDelete = async (id: number) => {
    try {
        const res = await fetch(`/api/corporates/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to delete corporate');
        }

        toast({
            title: "Success",
            description: "Corporate deleted successfully.",
        });
        await fetchCorporates();
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: (error as Error).message,
        });
    }
  };

  const handleBulkDelete = async (ids: number[]) => {
    if (ids.length === 0) return;
    try {
        const res = await fetch(`/api/corporates`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids }),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to delete corporates');
        }
        toast({
            title: "Success",
            description: `${ids.length} corporate(s) deleted successfully.`,
        });
        await fetchCorporates();
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: (error as Error).message });
    }
  };
  
  const columns = getColumns({
    onEdit: handleOpenModal,
    onDelete: handleSingleDelete,
  });

  const CustomToolbarActions = (
    <Button onClick={() => handleOpenModal(null)}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Add Corporate
    </Button>
  );

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
                        This action cannot be undone. This will permanently delete the selected corporates and all their associated data.
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
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Manage Corporates
          </h1>
          <p className="text-muted-foreground">
            A list of all corporate partners in the system.
          </p>
        </div>
      </div>
       <DataTable 
        columns={columns} 
        data={corporates}
        customActions={CustomToolbarActions}
        bulkActions={BulkActions}
      />
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[425px]">
           <DialogHeader>
            <DialogTitle>{editingCorporate ? 'Edit Corporate' : 'Add New Corporate'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wellness_date">Wellness Date</Label>
                <Input
                  id="wellness_date"
                  type="date"
                  value={formData.wellness_date}
                  onChange={(e) => setFormData({ ...formData, wellness_date: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingCorporate ? 'Save Changes' : 'Create Corporate'}
                </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
