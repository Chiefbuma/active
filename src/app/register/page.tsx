'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Ambulance, Driver, MedicalStaff } from '@/lib/types';
import { getAmbulances, getDrivers, getMedicalStaff } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [medicalStaff, setMedicalStaff] = useState<MedicalStaff[]>([]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    ambulance_id: '',
    driver_id: '',
    medical_staff_id: '',
    total_till: '',
    target: '',
    fuel: '',
    operation: '',
    police: '',
    cash_deposited_by_staff: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Fetch mock data
    Promise.all([getAmbulances(), getDrivers(), getMedicalStaff()]).then(
      ([ambulanceData, driverData, staffData]) => {
        setAmbulances(ambulanceData);
        setDrivers(driverData);
        setMedicalStaff(staffData);
      }
    );
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });

    if (name === 'ambulance_id') {
        const selectedAmbulance = ambulances.find(a => a.id === Number(value));
        if (selectedAmbulance) {
            setFormData(prev => ({
                ...prev,
                fuel: String(selectedAmbulance.fuel_cost),
                operation: String(selectedAmbulance.operation_cost),
                target: String(selectedAmbulance.target),
            }));
        }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("Submitting form data:", formData);

    // Mock submission
    setTimeout(() => {
      toast({
        title: 'Success!',
        description: 'Transaction logged successfully.',
      });
      setLoading(false);
      router.push('/dashboard');
    }, 1000);
  }

  return (
    <div className="flex justify-center items-start py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Add Daily Transaction</CardTitle>
          <CardDescription>
            Fill in the form below to log a new financial record for an ambulance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-8">
                <div className="grid gap-2">
                    <Label htmlFor="date">Transaction Date</Label>
                    <Input id="date" type="date" value={formData.date} onChange={handleInputChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ambulance_id">Ambulance</Label>
                  <Select required onValueChange={(value) => handleSelectChange('ambulance_id', value)}>
                    <SelectTrigger id="ambulance_id">
                      <SelectValue placeholder="Select Ambulance" />
                    </SelectTrigger>
                    <SelectContent>
                      {ambulances.map((ambulance) => (
                        <SelectItem key={ambulance.id} value={String(ambulance.id)}>
                          {ambulance.reg_no}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="driver_id">Driver</Label>
                  <Select required onValueChange={(value) => handleSelectChange('driver_id', value)}>
                    <SelectTrigger id="driver_id">
                      <SelectValue placeholder="Select Driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.map((driver) => (
                        <SelectItem key={driver.id} value={String(driver.id)}>
                          {`${driver.first_name} ${driver.last_name}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="medical_staff_id">Medical Staff</Label>
                  <Select required onValueChange={(value) => handleSelectChange('medical_staff_id', value)}>
                    <SelectTrigger id="medical_staff_id">
                      <SelectValue placeholder="Select Medical Staff" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicalStaff.map((staff) => (
                        <SelectItem key={staff.id} value={String(staff.id)}>
                          {`${staff.first_name} ${staff.last_name}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="grid gap-2">
                  <Label htmlFor="total_till">Total Till (KES)</Label>
                  <Input id="total_till" type="number" required onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="target">Target (KES)</Label>
                  <Input id="target" type="number" value={formData.target} required onChange={handleInputChange} />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="fuel">Fuel Cost (KES)</Label>
                  <Input id="fuel" type="number" value={formData.fuel} required onChange={handleInputChange} />
                </div>
                 <div className="grid gap-2">
                  <Label htmlFor="operation">Operation Cost (KES)</Label>
                  <Input id="operation" type="number" value={formData.operation} required onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="police">Police Payments (KES)</Label>
                  <Input id="police" type="number" required onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cash_deposited_by_staff">Cash Deposited (KES)</Label>
                  <Input id="cash_deposited_by_staff" type="number" required onChange={handleInputChange} />
                </div>
              </div>

            </div>
            <div className="mt-8 flex justify-end gap-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Saving...' : 'Save Transaction'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
