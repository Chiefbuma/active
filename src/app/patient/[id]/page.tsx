import { mockData } from '@/lib/data';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ArrowLeft,
  Stethoscope,
  HeartPulse,
  Scale,
  Target,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const patientId = parseInt(params.id, 10);
  const patient = mockData.patients.find((p) => p.id === patientId);
  const corporates = mockData.corporates;

  if (!patient) {
    notFound();
  }

  const corporate = patient.corporate_id
    ? corporates.find((c) => c.id === patient.corporate_id)
    : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Dashboard</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">{`${
            patient.first_name
          } ${patient.surname || ''}`}</h1>
          <p className="text-muted-foreground">Patient Assessment and Details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="grid gap-1">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium">{`${patient.first_name} ${
                patient.middle_name || ''
              } ${patient.surname || ''}`}</dd>
            </div>
            <div className="grid gap-1">
              <dt className="text-muted-foreground">Age</dt>
              <dd className="font-medium">{patient.age}</dd>
            </div>
            <div className="grid gap-1">
              <dt className="text-muted-foreground">Sex</dt>
              <dd className="font-medium">{patient.sex}</dd>
            </div>
            <div className="grid gap-1">
              <dt className="text-muted-foreground">DOB</dt>
              <dd className="font-medium">{patient.dob}</dd>
            </div>
            <div className="grid gap-1">
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="font-medium">{patient.phone}</dd>
            </div>
            <div className="grid gap-1">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium">{patient.email}</dd>
            </div>
            <div className="grid gap-1">
              <dt className="text-muted-foreground">Corporate</dt>
              <dd>
                {corporate ? (
                  <Badge variant="outline">{corporate.name}</Badge>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </dd>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="vitals" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="vitals">
            <HeartPulse className="mr-2" />
            Vitals
          </TabsTrigger>
          <TabsTrigger value="nutrition">
            <Scale className="mr-2" />
            Nutrition
          </TabsTrigger>
          <TabsTrigger value="goals">
            <Target className="mr-2" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="clinical">
            <Stethoscope className="mr-2" />
            Clinical Notes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="vitals">
          <Card>
            <CardHeader>
              <CardTitle>Vitals</CardTitle>
              <CardDescription>
                Latest vital signs measurement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {patient.vitals && patient.vitals.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Systolic (mmHg)</TableHead>
                      <TableHead>Diastolic (mmHg)</TableHead>
                      <TableHead>Pulse (bpm)</TableHead>
                      <TableHead>Temp (°C)</TableHead>
                      <TableHead>RBS (mmol/L)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patient.vitals.map((vital) => (
                      <TableRow key={vital.id}>
                        <TableCell>{vital.bp_systolic || '-'}</TableCell>
                        <TableCell>{vital.bp_diastolic || '-'}</TableCell>
                        <TableCell>{vital.pulse || '-'}</TableCell>
                        <TableCell>{vital.temp || '-'}</TableCell>
                        <TableCell>{vital.rbs || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No vitals recorded.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="nutrition">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Assessment</CardTitle>
              <CardDescription>
                Latest nutrition assessment details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {patient.nutrition && patient.nutrition.length > 0 ? (
                patient.nutrition.map((nutri) => (
                  <div key={nutri.id} className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Height (cm)</p>
                        <p className="font-medium">{nutri.height || '-'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Weight (kg)</p>
                        <p className="font-medium">{nutri.weight || '-'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">BMI</p>
                        <p className="font-medium">{nutri.bmi || '-'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Visceral Fat</p>
                        <p className="font-medium">
                          {nutri.visceral_fat || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Body Fat %</p>
                        <p className="font-medium">
                          {nutri.body_fat_percent || '-'}
                        </p>
                      </div>
                    </div>
                    {nutri.notes_nutritionist && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-muted-foreground">
                            Nutritionist Notes
                          </p>
                          <p className="font-medium">
                            {nutri.notes_nutritionist}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No nutrition assessment recorded.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Goal Setting</CardTitle>
              <CardDescription>
                Patient's health and wellness goals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {patient.goals && patient.goals.length > 0 ? (
                patient.goals.map((goal) => (
                  <div key={goal.id} className="space-y-4 p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold text-primary">Discussion</h4>
                      <p className="text-foreground mt-1">
                        {goal.discussion || '-'}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold text-primary">Goal</h4>
                      <p className="text-foreground mt-1">{goal.goal || '-'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No goals set.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="clinical">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Review</CardTitle>
              <CardDescription>Notes from clinical staff.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {patient.clinical && patient.clinical.length > 0 ? (
                patient.clinical.map((clinic) => (
                  <div key={clinic.id} className="space-y-6">
                    {clinic.notes_doctor && (
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-primary">Doctor's Notes</h4>
                        <p className="text-foreground mt-1">
                          {clinic.notes_doctor}
                        </p>
                      </div>
                    )}
                    {clinic.notes_psychologist && (
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-primary">
                          Psychologist's Notes
                        </h4>
                        <p className="text-foreground mt-1">
                          {clinic.notes_psychologist}
                        </p>
                      </div>
                    )}
                    {!clinic.notes_doctor && !clinic.notes_psychologist && (
                      <p className="text-muted-foreground">
                        No clinical notes recorded for this entry.
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No clinical review found.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
