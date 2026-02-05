'use client';

import { useState } from 'react';
import type { EmergencyTechnician } from '@/lib/types';
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

export default function MedicalStaffClient({ initialMedicalStaff }: { initialMedicalStaff: EmergencyTechnician[] }) {
  const [medicalStaff, setMedicalStaff] = useState<EmergencyTechnician[]>(initialMedicalStaff);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<EmergencyTechnician | null>(null);
  const [formData, setFormData] = useState({ first_name: '', last_name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleOpenModal = (staff: EmergencyTechnician | null) => {
    setEditingStaff(staff);
    if (staff) {
      setFormData({ first_name: staff.first_name, last_name: staff.last_name });
    } else {
      setFormData({ first_name: '', last_name: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
    setFormData({ first_name: '', last_name: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      if (editingStaff) {
        setMedicalStaff(medicalStaff.map(d => d.id === editingStaff.id ? { ...editingStaff, ...formData } : d));
      } else {
        setMedicalStaff([...medicalStaff, { ...formData, id: Math.random() }]);
      }
      toast({
        title: "Success",
        description: `Emergency Technician ${editingStaff ? 'updated' : 'created'} successfully.`,
      });
      setIsSubmitting(false);
      handleCloseModal();
    }, 500);
  };
  
  const handleSingleDelete = async (id: number) => {
     setTimeout(() => {
      setMedicalStaff(medicalStaff.filter(d => d.id !== id));
      toast({
          title: "Success",
          description: "Emergency Technician deleted successfully.",
      });
    }, 500);
  };

  const handleBulkDelete = async (ids: number[]) => {
    if (ids.length === 0) return;
    setTimeout(() => {
        setMedicalStaff(medicalStaff.filter(d => !ids.includes(d.id)));
        toast({
            title: "Success",
            description: `${ids.length} technician(s) deleted successfully.`,
        });
    }, 500);
  };
  
  const columns = getColumns({
    onEdit: handleOpenModal,
    onDelete: handleSingleDelete,
  });

  const CustomToolbarActions = (
    <Button onClick={() => handleOpenModal(null)}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Add Technician
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
                        This action cannot be undone. This will permanently delete the selected technicians.
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
    <div className="flex flex-col gap-4">
       <DataTable 
        columns={columns} 
        data={medicalStaff}
        customActions={CustomToolbarActions}
        bulkActions={BulkActions}
      />
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[425px]">
           <DialogHeader>
            <DialogTitle>{editingStaff ? 'Edit Technician' : 'Add New Technician'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
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
                  {editingStaff ? 'Save Changes' : 'Create Technician'}
                </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
