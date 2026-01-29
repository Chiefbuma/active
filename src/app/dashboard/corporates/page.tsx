'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import type { Corporate } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function CorporatesPage() {
  const [corporates, setCorporates] = useState<Corporate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCorporate, setEditingCorporate] = useState<Corporate | null>(null);
  const [formData, setFormData] = useState({ name: '', wellness_date: '' });
  const { toast } = useToast();

  const fetchCorporates = async () => {
    setLoading(true);
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
      console.error("Failed to fetch corporates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCorporates();
  }, []);

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
    const url = editingCorporate ? `/api/corporates/${editingCorporate.id}` : '/api/corporates';
    const method = editingCorporate ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Failed to ${editingCorporate ? 'update' : 'create'} corporate`);
      }

      toast({
        title: "Success",
        description: `Corporate ${editingCorporate ? 'updated' : 'created'} successfully.`,
      });
      fetchCorporates();
      handleCloseModal();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as Error).message,
      });
    }
  };
  
  const handleDelete = async (id: number) => {
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
        fetchCorporates();
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: (error as Error).message,
        });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Manage Corporates
          </h1>
          <p className="text-muted-foreground">
            Add, edit, or remove corporate partners.
          </p>
        </div>
        <Button onClick={() => handleOpenModal(null)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Corporate
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Corporate List</CardTitle>
          <CardDescription>
            A list of all corporate partners in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Wellness Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-9 w-40 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : corporates.length > 0 ? (
                  corporates.map((corporate) => (
                    <TableRow key={corporate.id}>
                      <TableCell className="font-medium">{corporate.name}</TableCell>
                      <TableCell>
                        {new Date(corporate.wellness_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" size="sm" onClick={() => handleOpenModal(corporate)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the corporate and all associated patient registrations.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(corporate.id)}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">
                      No corporates found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

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
                <Button type="submit">{editingCorporate ? 'Save Changes' : 'Create Corporate'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
