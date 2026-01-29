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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockData } from '@/lib/data';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function DashboardPage() {
  const patients = mockData.patients;
  const corporates = mockData.corporates;

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Phone</TableHead>
                <TableHead className="hidden md:table-cell">Age</TableHead>
                <TableHead className="hidden md:table-cell">Corporate</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="font-medium">{`${patient.first_name} ${patient.surname || ''}`}</div>
                    <div className="text-sm text-muted-foreground md:hidden">{patient.email}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{patient.email}</TableCell>
                  <TableCell className="hidden sm:table-cell">{patient.phone}</TableCell>
                   <TableCell className="hidden md:table-cell">{patient.age}</TableCell>
                   <TableCell className="hidden md:table-cell">
                    {patient.corporate_id ? (
                      <Badge variant="outline">{corporates.find(c => c.id === patient.corporate_id)?.name}</Badge>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
