'use client';

import { useState } from 'react';
import type { Ambulance } from '@/lib/types';
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

export default function AmbulancesClient({ initialAmbulances }: { initialAmbulances: Ambulance[] }) {
  const [ambulances, setAmbulances] = useState<Ambulance[]>(initialAmbulances);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAmbulance, setEditingAmbulance] = useState<Ambulance | null>(null);
  const [formData, setFormData] = useState({ reg_no: '', fuel_cost: 0, operation_cost: 0, target: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [ambulanceToDelete, setAmbulanceToDelete] = useState<Ambulance | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const handleOpenModal = (ambulance: Ambulance | null) => {
    setEditingAmbulance(ambulance);
    if (ambulance) {
      setFormData(ambulance);
    } else {
      setFormData({ reg_no: '', fuel_cost: 0, operation_cost: 0, target: 0 });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAmbulance(null);
    setFormData({ reg_no: '', fuel_cost: 0, operation_cost: 0, target: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      if (editingAmbulance) {
        setAmbulances(ambulances.map(a => a.id === editingAmbulance.id ? { ...editingAmbulance, ...formData } : a));
      } else {
        setAmbulances([...ambulances, { ...formData, id: Math.random() }]);
      }
      toast({
        title: "Success",
        description: `Ambulance ${editingAmbulance ? 'updated' : 'created'} successfully.`,
      });
      setIsSubmitting(false);
      handleCloseModal();
    }, 500);
  };

  const handleOpenDeleteDialog = (ambulance: Ambulance) => {
    setAmbulanceToDelete(ambulance);
    setIsDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
     if (!ambulanceToDelete) return;
     setIsDeleting(true);
     setTimeout(() => {
      setAmbulances(ambulances.filter(a => a.id !== ambulanceToDelete.id));
      toast({
          title: "Success",
          description: "Ambulance deleted successfully.",
      });
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setAmbulanceToDelete(null);
    }, 500);
  };

  const handleConfirmBulkDelete = async (ids: number[], onDone: () => void) => {
    if (ids.length === 0) return;
    setIsBulkDeleting(true);
    setTimeout(() => {
        setAmbulances(ambulances.filter(a => !ids.includes(a.id)));
        toast({
            title: "Success",
            description: `${ids.length} ambulance(s) deleted successfully.`,
        });
        setIsBulkDeleting(false);
        onDone();
    }, 500);
  };
  
  const columns = getColumns({
    onEdit: handleOpenModal,
    onDelete: handleOpenDeleteDialog,
  });

  const CustomToolbarActions = (
    <Button onClick={() => handleOpenModal(null)}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Add Ambulance
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
                        This action cannot be undone. This will permanently delete the selected ambulances.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            const idsToDelete = selectedRows.map((row: any) => row.original.id);
                            handleConfirmBulkDelete(idsToDelete, () => table.toggleAllPageRowsSelected(false));
                        }}
                        disabled={isBulkDeleting}
                    >
                        {isBulkDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
  }

  return (
    <div className="flex flex-col gap-4">
       <DataTable 
        columns={columns} 
        data={ambulances}
        customActions={CustomToolbarActions}
        bulkActions={BulkActions}
      />
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[425px]">
           <DialogHeader>
            <DialogTitle>{editingAmbulance ? 'Edit Ambulance' : 'Add New Ambulance'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reg_no">Registration No.</Label>
                <Input
                  id="reg_no"
                  value={formData.reg_no}
                  onChange={(e) => setFormData({ ...formData, reg_no: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuel_cost">Fuel Cost (KES)</Label>
                <Input
                  id="fuel_cost"
                  type="number"
                  value={formData.fuel_cost}
                  onChange={(e) => setFormData({ ...formData, fuel_cost: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="operation_cost">Operation Cost (KES)</Label>
                <Input
                  id="operation_cost"
                  type="number"
                  value={formData.operation_cost}
                  onChange={(e) => setFormData({ ...formData, operation_cost: Number(e.target.value) })}
                  required
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="target">Target (KES)</Label>
                <Input
                  id="target"
                  type="number"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: Number(e.target.value) })}
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
                  {editingAmbulance ? 'Save Changes' : 'Create Ambulance'}
                </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the ambulance.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setAmbulanceToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting}>
                    {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Continue
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
