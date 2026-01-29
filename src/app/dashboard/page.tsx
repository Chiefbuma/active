'use client';

import { Suspense } from 'react';
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
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { placeholderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import type { Patient } from '@/lib/types';


function PatientTable() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const patientAvatar = placeholderImages.find(p => p.id === 'patient-avatar');

    useEffect(() => {
        fetch('/api/patients')
        .then((res) => res.json())
        .then((data) => {
            setPatients(data);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Failed to fetch patients:", error);
            setLoading(false);
        });
    }, []);

  if (loading) {
    return <PatientTableSkeleton />;
  }

  return (
    <TableBody>
      {patients.length > 0 ? (
        patients.map((patient) => (
          <TableRow key={patient.id}>
            <TableCell>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-10 w-10 sm:flex">
                  {patientAvatar && <AvatarImage src={patientAvatar.imageUrl} alt={`${patient.first_name} ${patient.surname}`} />}
                  <AvatarFallback>{`${patient.first_name[0]}${patient.surname ? patient.surname[0] : ''}`}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="font-medium leading-none">{`${patient.first_name} ${patient.surname || ''}`}</p>
                  <p className="text-sm text-muted-foreground">{patient.corporate_name || 'No Corporate'}</p>
                </div>
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              {patient.wellness_date ? (
                new Date(patient.wellness_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell className="text-right">
                <Button asChild size="sm" variant="outline">
                <Link href={`/patient/${patient.id}`}>
                  View <ArrowUpRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={3} className="text-center h-24">
            No patients found.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}

function PatientTableSkeleton() {
    return (
        <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
            <TableCell>
                <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="grid gap-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
                </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
                <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell className="text-right">
                <Skeleton className="h-9 w-24 ml-auto" />
            </TableCell>
            </TableRow>
        ))}
        </TableBody>
    );
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Campaign Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of patient registrations for the current campaign.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Registrations</CardTitle>
          <CardDescription>
            A list of patients registered in the campaign.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Wellness Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <PatientTable />
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
