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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { placeholderImages } from '@/lib/placeholder-images';

export default function DashboardPage() {
  const patients = mockData.patients;
  const corporates = mockData.corporates;
  const patientAvatar = placeholderImages.find(p => p.id === 'patient-avatar');

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
                  <TableHead className="hidden md:table-cell">Corporate</TableHead>
                  <TableHead className="hidden sm:table-cell">Wellness Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => {
                  const corporate = patient.corporate_id ? corporates.find(c => c.id === patient.corporate_id) : null;
                  return (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Avatar className="hidden h-10 w-10 sm:flex">
                            {patientAvatar && <AvatarImage src={patientAvatar.imageUrl} alt={`${patient.first_name} ${patient.surname}`} />}
                            <AvatarFallback>{`${patient.first_name[0]}${patient.surname ? patient.surname[0] : ''}`}</AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1">
                            <p className="font-medium leading-none">{`${patient.first_name} ${patient.surname || ''}`}</p>
                            <p className="text-sm text-muted-foreground">{patient.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {corporate ? (
                          <Badge variant="outline">{corporate.name}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {corporate ? (
                          new Date(corporate.wellness_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
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
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
