'use client';

import { useState } from 'react';
import { mockData } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
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
  PlusCircle,
  Save,
  XCircle,
  FileText,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { placeholderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ReportViewer from '@/components/report-viewer';


const DetailItem = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ElementType;
}) => (
  <div className="flex items-start gap-4">
    {Icon && (
      <div className="bg-muted/50 rounded-full p-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
    )}
    <div className="grid gap-0.5">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
        {label}
      </p>
      <p className="font-semibold text-foreground break-words">{value || '-'}</p>
    </div>
  </div>
);

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = parseInt(params.id as string, 10);
  const patient = mockData.patients.find((p) => p.id === patientId);
  const corporates = mockData.corporates;
  const { toast } = useToast();

  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isClinicalModalOpen, setIsClinicalModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  const patientAvatar = placeholderImages.find(p => p.id === 'patient-avatar');

  if (!patient) {
    notFound();
  }

  const corporate = patient.corporate_id
    ? corporates.find((c) => c.id === patient.corporate_id)
    : null;

  const handleSave = (setter: React.Dispatch<React.SetStateAction<boolean>>, section: string) => {
    // In a real app, you'd handle form submission here
    console.log(`${section} data saved (mock)`);
    toast({
      title: `${section} Record Saved`,
      description: `The patient's ${section.toLowerCase()} record has been updated.`,
    });
    setter(false);
  };

  return (
    <div className="container mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
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
              <p className="text-muted-foreground">
                Patient Assessment and Details
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Vitals Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                   <HeartPulse className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle>Vitals</CardTitle>
                    <CardDescription>
                      Latest vital signs measurement.
                    </CardDescription>
                  </div>
                </div>
                <Dialog open={isVitalsModalOpen} onOpenChange={setIsVitalsModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setIsVitalsModalOpen(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {patient.vitals && patient.vitals.length > 0 ? 'Edit Vitals' : 'Add Vitals'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{patient.vitals && patient.vitals.length > 0 ? 'Edit Vitals' : 'Add New Vitals'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 py-4">
                      <div className="space-y-2"><Label htmlFor="bp_systolic">Systolic (mmHg)</Label><Input id="bp_systolic" type="number" placeholder="120" /></div>
                      <div className="space-y-2"><Label htmlFor="bp_diastolic">Diastolic (mmHg)</Label><Input id="bp_diastolic" type="number" placeholder="80" /></div>
                      <div className="space-y-2"><Label htmlFor="pulse">Pulse (bpm)</Label><Input id="pulse" type="number" placeholder="70" /></div>
                      <div className="space-y-2"><Label htmlFor="temp">Temp (°C)</Label><Input id="temp" type="number" step="0.1" placeholder="36.5" /></div>
                      <div className="space-y-2 sm:col-span-2"><Label htmlFor="rbs">RBS (mmol/L)</Label><Input id="rbs" placeholder="5.4" /></div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline"><XCircle className="mr-2 h-4 w-4" />Cancel</Button>
                      </DialogClose>
                      <Button onClick={() => handleSave(setIsVitalsModalOpen, 'Vitals')}><Save className="mr-2 h-4 w-4" />Save Record</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {patient.vitals && patient.vitals.length > 0 ? (
                  <Table>
                    <TableHeader><TableRow><TableHead>Systolic (mmHg)</TableHead><TableHead>Diastolic (mmHg)</TableHead><TableHead>Pulse (bpm)</TableHead><TableHead>Temp (°C)</TableHead><TableHead>RBS (mmol/L)</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {patient.vitals.map((vital) => (
                        <TableRow key={vital.id}><TableCell>{vital.bp_systolic || '-'}</TableCell><TableCell>{vital.bp_diastolic || '-'}</TableCell><TableCell>{vital.pulse || '-'}</TableCell><TableCell>{vital.temp || '-'}</TableCell><TableCell>{vital.rbs || '-'}</TableCell></TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : ( <p className="text-muted-foreground text-center py-4">No vitals recorded.</p> )}
              </CardContent>
            </Card>

            {/* Nutrition Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <Scale className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle>Nutrition</CardTitle>
                    <CardDescription>Latest nutrition assessment details.</CardDescription>
                  </div>
                </div>
                 <Dialog open={isNutritionModalOpen} onOpenChange={setIsNutritionModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setIsNutritionModalOpen(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {patient.nutrition && patient.nutrition.length > 0 ? 'Edit Assessment' : 'Add Assessment'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{patient.nutrition && patient.nutrition.length > 0 ? 'Edit Nutrition Assessment' : 'Add Nutrition Assessment'}</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                          <div className="space-y-2"><Label htmlFor="height">Height (cm)</Label><Input id="height" type="number" placeholder="175" /></div>
                          <div className="space-y-2"><Label htmlFor="weight">Weight (kg)</Label><Input id="weight" type="number" step="0.1" placeholder="70.5" /></div>
                          <div className="space-y-2"><Label htmlFor="bmi">BMI</Label><Input id="bmi" type="number" step="0.1" placeholder="22.9" readOnly /></div>
                          <div className="space-y-2"><Label htmlFor="visceral_fat">Visceral Fat</Label><Input id="visceral_fat" type="number" placeholder="5" /></div>
                          <div className="space-y-2 sm:col-span-2"><Label htmlFor="body_fat_percent">Body Fat %</Label><Input id="body_fat_percent" type="number" step="0.1" placeholder="15.5" /></div>
                      </div>
                      <div className="space-y-2"><Label htmlFor="notes_nutritionist">Nutritionist Notes</Label><Textarea id="notes_nutritionist" placeholder="Enter notes..." /></div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline"><XCircle className="mr-2 h-4 w-4" />Cancel</Button>
                      </DialogClose>
                      <Button onClick={() => handleSave(setIsNutritionModalOpen, 'Nutrition')}><Save className="mr-2 h-4 w-4" />Save Record</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {patient.nutrition && patient.nutrition.length > 0 ? (
                    patient.nutrition.map((nutri) => (
                    <div key={nutri.id} className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm p-4 bg-muted/50 rounded-lg">
                          <DetailItem label="Height (cm)" value={nutri.height} />
                          <DetailItem label="Weight (kg)" value={nutri.weight} />
                          <DetailItem label="BMI" value={nutri.bmi} />
                          <DetailItem label="Visceral Fat" value={nutri.visceral_fat} />
                          <DetailItem label="Body Fat %" value={nutri.body_fat_percent} />
                        </div>
                        {nutri.notes_nutritionist && (<> <Separator className="my-4" /> <div><p className="text-sm font-medium text-muted-foreground">Nutritionist Notes</p><p className="text-foreground mt-1 whitespace-pre-wrap text-sm">{nutri.notes_nutritionist}</p></div></>)}
                    </div>
                    ))
                ) : ( <p className="text-muted-foreground text-center py-4">No nutrition assessment recorded.</p> )}
              </CardContent>
            </Card>
            
            {/* Goals Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <Target className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle>Goals</CardTitle>
                    <CardDescription>Patient's health and wellness goals.</CardDescription>
                  </div>
                </div>
                 <Dialog open={isGoalModalOpen} onOpenChange={setIsGoalModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setIsGoalModalOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        {patient.goals && patient.goals.length > 0 ? 'Edit Goal' : 'Set Goal'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{patient.goals && patient.goals.length > 0 ? 'Edit Goal' : 'Set New Goal'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="space-y-2"><Label htmlFor="discussion">Discussion</Label><Textarea id="discussion" placeholder="Notes from discussion with patient..." /></div>
                        <div className="space-y-2"><Label htmlFor="goal">Goal</Label><Textarea id="goal" placeholder="Define a clear, actionable goal..." /></div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline"><XCircle className="mr-2 h-4 w-4" />Cancel</Button>
                      </DialogClose>
                      <Button onClick={() => handleSave(setIsGoalModalOpen, 'Goal')}><Save className="mr-2 h-4 w-4" />Save Record</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {patient.goals && patient.goals.length > 0 ? (
                    <div className="space-y-4">
                    {patient.goals.map((goal) => (
                    <div key={goal.id} className="space-y-4 p-4 border rounded-xl bg-background/50">
                        <div><h4 className="font-semibold text-primary">Discussion</h4><p className="text-foreground mt-1 text-sm">{goal.discussion || '-'}</p></div>
                        <Separator />
                        <div><h4 className="font-semibold text-primary">Goal</h4><p className="text-foreground mt-1 text-sm">{goal.goal || '-'}</p></div>
                    </div>
                    ))}
                    </div>
                ) : ( <p className="text-muted-foreground text-center py-4">No goals set.</p> )}
              </CardContent>
            </Card>

            {/* Clinical Review Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <Stethoscope className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle>Clinical Review</CardTitle>
                    <CardDescription>Notes from clinical staff.</CardDescription>
                  </div>
                </div>
                 <Dialog open={isClinicalModalOpen} onOpenChange={setIsClinicalModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setIsClinicalModalOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        {patient.clinical && patient.clinical.length > 0 ? 'Edit Review' : 'Add Review'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{patient.clinical && patient.clinical.length > 0 ? 'Edit Clinical Review' : 'Add Clinical Review'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="space-y-2"><Label htmlFor="notes_doctor">Doctor's Notes</Label><Textarea id="notes_doctor" placeholder="Enter doctor's notes..."/></div>
                        <div className="space-y-2"><Label htmlFor="notes_psychologist">Psychologist's Notes</Label><Textarea id="notes_psychologist" placeholder="Enter psychologist's notes..."/></div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="outline"><XCircle className="mr-2 h-4 w-4" />Cancel</Button>
                      </DialogClose>
                      <Button onClick={() => handleSave(setIsClinicalModalOpen, 'Clinical Review')}><Save className="mr-2 h-4 w-4" />Save Record</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {patient.clinical && patient.clinical.length > 0 ? (
                    <div className="space-y-6">
                    {patient.clinical.map((clinic) => (
                    <div key={clinic.id} className="space-y-6">
                        {clinic.notes_doctor && (<div className="p-4 border rounded-xl bg-background/50"><h4 className="font-semibold text-primary">Doctor's Notes</h4><p className="text-foreground mt-2 text-sm">{clinic.notes_doctor}</p></div>)}
                        {clinic.notes_psychologist && (<div className="p-4 border rounded-xl bg-background/50"><h4 className="font-semibold text-primary">Psychologist's Notes</h4><p className="text-foreground mt-2 text-sm">{clinic.notes_psychologist}</p></div>)}
                        {!clinic.notes_doctor && !clinic.notes_psychologist && (<p className="text-muted-foreground text-sm text-center">No clinical notes recorded for this entry.</p>)}
                    </div>
                    ))}
                    </div>
                ) : ( <p className="text-muted-foreground text-center py-4">No clinical review found.</p> )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="flex flex-col items-center text-center gap-4">
                <Avatar className="w-24 h-24 border-4 border-background shadow-md">
                   {patientAvatar && <AvatarImage src={patientAvatar.imageUrl} alt={`${patient.first_name} ${patient.surname || ''}`} />}
                  <AvatarFallback className="text-3xl">{`${patient.first_name[0]}${patient.surname ? patient.surname[0] : ''}`}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <CardTitle className="text-2xl">{`${patient.first_name} ${
                    patient.surname || ''
                  }`}</CardTitle>
                  <CardDescription>Patient ID: {patient.id}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                 <Separator />
                <div className="grid grid-cols-1 gap-4 pt-4">
                  <DetailItem
                    icon={User}
                    label="Full Name"
                    value={`${patient.first_name} ${patient.middle_name || ''} ${
                      patient.surname || ''
                    }`}
                  />
                  <DetailItem icon={Cake} label="Date of Birth" value={patient.dob} />
                  <DetailItem icon={Binary} label="Age / Sex" value={`${patient.age} / ${patient.sex}`} />
                  <DetailItem icon={Phone} label="Phone" value={patient.phone} />
                  <DetailItem icon={Mail} label="Email" value={patient.email} />
                </div>
              </CardContent>
            </Card>
            {corporate && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Building2 className="w-6 h-6" />
                    <span>Corporate</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DetailItem label="Company Name" value={corporate.name} />
                  <DetailItem
                    label="Wellness Date"
                    value={new Date(corporate.wellness_date).toLocaleDateString()}
                  />
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button variant="outline">Edit Patient Details</Button>
                <Button onClick={() => setIsReportModalOpen(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate PDF Report
                </Button>
                <Button variant="destructive">Delete Patient Record</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
       {isReportModalOpen && (
        <ReportViewer
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          patient={patient}
          corporate={corporate}
        />
      )}
    </div>
  );
}
