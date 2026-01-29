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
  User,
  Cake,
  Phone,
  Mail,
  Building2,
  Binary,
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

const DetailItem = ({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon?: React.ElementType }) => (
  <div className="flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-muted/50">
    {Icon && <Icon className="h-5 w-5 flex-shrink-0 text-primary" />}
    <div className="flex-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground break-words">{value || '-'}</p>
    </div>
  </div>
);


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
      <div className="flex items-center justify-between">
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
         {corporate && (
            <Badge variant="outline" className="hidden sm:flex text-base py-2 px-4">{corporate.name}</Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <User className="w-6 h-6" />
            <span>Patient Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
            <DetailItem 
              icon={User}
              label="Full Name" 
              value={`${patient.first_name} ${patient.middle_name || ''} ${patient.surname || ''}`} 
            />
            <DetailItem 
              icon={Cake}
              label="Date of Birth" 
              value={patient.dob} 
            />
            <DetailItem 
              icon={Binary}
              label="Age / Sex" 
              value={`${patient.age} / ${patient.sex}`} 
            />
            <DetailItem 
              icon={Phone}
              label="Phone" 
              value={patient.phone} 
            />
            <DetailItem 
              icon={Mail}
              label="Email" 
              value={patient.email} 
            />
            {corporate && (
               <DetailItem 
                icon={Building2}
                label="Corporate" 
                value={corporate.name} 
              />
            )}
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
                      <DetailItem label="Height (cm)" value={nutri.height} />
                      <DetailItem label="Weight (kg)" value={nutri.weight} />
                      <DetailItem label="BMI" value={nutri.bmi} />
                      <DetailItem label="Visceral Fat" value={nutri.visceral_fat} />
                      <DetailItem label="Body Fat %" value={nutri.body_fat_percent} />
                    </div>
                    {nutri.notes_nutritionist && (
                      <>
                        <Separator />
                        <div className="p-3">
                          <p className="text-sm font-medium text-muted-foreground">
                            Nutritionist Notes
                          </p>
                          <p className="text-foreground mt-1">
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
                  <div key={goal.id} className="space-y-4 p-4 border rounded-xl bg-background/50">
                    <div>
                      <h4 className="font-semibold text-primary">Discussion</h4>
                      <p className="text-foreground mt-1 text-sm">
                        {goal.discussion || '-'}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-semibold text-primary">Goal</h4>
                      <p className="text-foreground mt-1 text-sm">{goal.goal || '-'}</p>
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
                      <div className="p-4 border rounded-xl bg-background/50">
                        <h4 className="font-semibold text-primary">Doctor's Notes</h4>
                        <p className="text-foreground mt-2 text-sm">
                          {clinic.notes_doctor}
                        </p>
                      </div>
                    )}
                    {clinic.notes_psychologist && (
                      <div className="p-4 border rounded-xl bg-background/50">
                        <h4 className="font-semibold text-primary">
                          Psychologist's Notes
                        </h4>
                        <p className="text-foreground mt-2 text-sm">
                          {clinic.notes_psychologist}
                        </p>
                      </div>
                    )}
                    {!clinic.notes_doctor && !clinic.notes_psychologist && (
                      <p className="text-muted-foreground text-sm">
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
