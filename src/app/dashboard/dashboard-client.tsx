'use client';

import { useState } from 'react';
import type { Ambulance } from '@/lib/types';
import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

export default function DashboardClient({ initialAmbulances }: { initialAmbulances: Ambulance[] }) {
  const [ambulances, setAmbulances] = useState<Ambulance[]>(initialAmbulances);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAmbulance, setEditingAmbulance] = useState<Ambulance | null>(null);
  const [formData, setFormData] = useState({ reg_no: '', fuel_cost: 0, operation_cost: 0, target: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
        description: `Ambulance ${editingAmbulance ? 'updated' : 'added'} successfully.`,
      });
      setIsSubmitting(false);
      handleCloseModal();
    }, 500);
  };
  
  const CustomToolbarActions = (
    <Button onClick={() => handleOpenModal(null)}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Add Ambulance
    </Button>
  );


  return (
    <div className="flex flex-col gap-4">
       <DataTable 
        columns={columns} 
        data={ambulances}
        customActions={CustomToolbarActions}
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
                <Label htmlFor="fuel_cost">Default Fuel Cost (KES)</Label>
                <Input
                  id="fuel_cost"
                  type="number"
                  value={formData.fuel_cost}
                  onChange={(e) => setFormData({ ...formData, fuel_cost: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="operation_cost">Default Operation Cost (KES)</Label>
                <Input
                  id="operation_cost"
                  type="number"
                  value={formData.operation_cost}
                  onChange={(e) => setFormData({ ...formData, operation_cost: Number(e.target.value) })}
                  required
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="target">Daily Target (KES)</Label>
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
    </div>
  );
}
