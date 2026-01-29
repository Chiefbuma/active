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
import type { Corporate } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { differenceInYears } from 'date-fns';

export default function RegisterPage() {
  const [corporates, setCorporates] = useState<Corporate[]>([]);
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    surname: '',
    dob: '',
    sex: '',
    phone: '',
    email: '',
    corporate_id: '',
  });
  const [age, setAge] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();


  useEffect(() => {
    fetch('/api/corporates')
      .then(res => res.json())
      .then(data => setCorporates(data))
      .catch(err => console.error("Failed to fetch corporates", err));
  }, []);

  useEffect(() => {
    if (formData.dob) {
      try {
        const birthDate = new Date(formData.dob);
        if (!isNaN(birthDate.getTime())) {
          const calculatedAge = differenceInYears(new Date(), birthDate);
          setAge(calculatedAge >= 0 ? calculatedAge : null);
        } else {
          setAge(null);
        }
      } catch (error) {
        setAge(null);
      }
    } else {
      setAge(null);
    }
  }, [formData.dob]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { corporate_id, ...rest } = formData;
    const payload = {
        ...rest,
        corporate_id: (corporate_id && corporate_id !== 'null') ? parseInt(corporate_id, 10) : null
    };

    try {
        const res = await fetch('/api/patients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to register patient.');
        }

        const data = await res.json();
        toast({
            title: 'Success!',
            description: 'Patient registered successfully.',
        });
        router.push(`/patient/${data.patientId}`);

    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: (error as Error).message,
        });
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-start py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>New Patient Registration</CardTitle>
          <CardDescription>
            Fill in the form below to register a new patient for the campaign.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="first_name" className="text-foreground">First Name</Label>
                  <Input id="first_name" placeholder="John" required onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="middle_name" className="text-foreground">Middle Name (Optional)</Label>
                  <Input id="middle_name" placeholder="Fitzgerald" onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="surname" className="text-foreground">Surname</Label>
                  <Input id="surname" placeholder="Doe" required onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="dob" className="text-foreground">Date of Birth</Label>
                  <Input id="dob" type="date" required onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="age" className="text-foreground">Age</Label>
                    <Input id="age" type="number" placeholder="Calculated from DOB" disabled value={age ?? ''} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sex" className="text-foreground">Sex</Label>
                  <Select required onValueChange={(value) => handleSelectChange('sex', value)}>
                    <SelectTrigger id="sex">
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+254 712 345 678" onChange={handleInputChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-foreground">Email Address</Label>
                  <Input id="email" type="email" placeholder="name@example.com" onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="corporate_id" className="text-foreground">Corporate (Optional)</Label>
                <Select onValueChange={(value) => handleSelectChange('corporate_id', value)}>
                  <SelectTrigger id="corporate_id">
                    <SelectValue placeholder="Select corporate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">None</SelectItem>
                    {corporates.map((corporate) => (
                      <SelectItem key={corporate.id} value={String(corporate.id)}>
                        {corporate.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-4">
              <Button variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
              <Button type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register Patient'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
