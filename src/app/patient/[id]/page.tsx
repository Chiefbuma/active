'use client';

import { useState } from 'react';
import { mockData } from '@/lib/data';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
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
    {Icon && <Icon className="h-5 w-5 flex-shrink-0 text-primary mt-1" />}
    <div className="flex-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground break-words">{value || '-'}</p>
    </div>
  </div>
);

const FormCard = ({
  title,
  children,
  onSubmit,
  onCancel,
}: {
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}) => (
  <form
    onSubmit={onSubmit}
    className="p-4 mb-6 mt-4 space-y-4 border rounded-lg bg-muted/30"
  >
    <h4 className="font-semibold text-lg">{title}</h4>
    {children}
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onCancel}>
        <XCircle className="mr-2 h-4 w-4" /> Cancel
      </Button>
      <Button type="submit">
        <Save className="mr-2 h-4 w-4" /> Save Record
      </Button>
    </div>
  </form>
);

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const patientId = parseInt(params.id, 10);
  const patient = mockData.patients.find((p) => p.id === patientId);
  const corporates = mockData.corporates;

  const [showVitalsForm, setShowVitalsForm] = useState(false);
  const [showNutritionForm, setShowNutritionForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showClinicalForm, setShowClinicalForm] = useState(false);

  if (!patient) {
    notFound();
  }

  const corporate = patient.corporate_id
    ? corporates.find((c) => c.id === patient.corporate_id)
    : null;

  const handleSave = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    // In a real app, you'd handle form submission here
    console.log('Data saved (mock)');
    setter(false);
  };

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
                <p className="text-muted-foreground">Patient Assessment and Details</p>
            </div>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle className="flex items-center gap-3">
                    <HeartPulse className="w-6 h-6" />
                    <span>Vitals</span>
                    </CardTitle>
                    <CardDescription>Latest vital signs measurement.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowVitalsForm(!showVitalsForm)}>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    {showVitalsForm ? 'Cancel' : 'Add Vitals'}
                </Button>
                </CardHeader>
                <CardContent>
                {showVitalsForm && (
                    <FormCard title="Add New Vitals" onCancel={() => setShowVitalsForm(false)} onSubmit={(e) => { e.preventDefault(); handleSave(setShowVitalsForm); }}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="grid gap-2"><Label htmlFor="bp_systolic">Systolic (mmHg)</Label><Input id="bp_systolic" type="number" placeholder="120" /></div>
                        <div className="grid gap-2"><Label htmlFor="bp_diastolic">Diastolic (mmHg)</Label><Input id="bp_diastolic" type="number" placeholder="80" /></div>
                        <div className="grid gap-2"><Label htmlFor="pulse">Pulse (bpm)</Label><Input id="pulse" type="number" placeholder="70" /></div>
                        <div className="grid gap-2"><Label htmlFor="temp">Temp (°C)</Label><Input id="temp" type="number" step="0.1" placeholder="36.5" /></div>
                        <div className="grid gap-2"><Label htmlFor="rbs">RBS (mmol/L)</Label><Input id="rbs" placeholder="5.4" /></div>
                    </div>
                    </FormCard>
                )}
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

            <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle className="flex items-center gap-3"><Scale className="w-6 h-6" /><span>Nutrition</span></CardTitle>
                    <CardDescription>Latest nutrition assessment details.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowNutritionForm(!showNutritionForm)}>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    {showNutritionForm ? 'Cancel' : 'Add Assessment'}
                </Button>
                </CardHeader>
                <CardContent>
                {showNutritionForm && (
                    <FormCard title="Add Nutrition Assessment" onCancel={() => setShowNutritionForm(false)} onSubmit={(e) => { e.preventDefault(); handleSave(setShowNutritionForm); }}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="grid gap-2"><Label htmlFor="height">Height (cm)</Label><Input id="height" type="number" placeholder="175" /></div>
                        <div className="grid gap-2"><Label htmlFor="weight">Weight (kg)</Label><Input id="weight" type="number" step="0.1" placeholder="70.5" /></div>
                        <div className="grid gap-2"><Label htmlFor="bmi">BMI</Label><Input id="bmi" type="number" step="0.1" placeholder="22.9" /></div>
                        <div className="grid gap-2"><Label htmlFor="visceral_fat">Visceral Fat</Label><Input id="visceral_fat" type="number" placeholder="5" /></div>
                        <div className="grid gap-2"><Label htmlFor="body_fat_percent">Body Fat %</Label><Input id="body_fat_percent" type="number" step="0.1" placeholder="15.5" /></div>
                    </div>
                    <div className="grid gap-2"><Label htmlFor="notes_nutritionist">Nutritionist Notes</Label><Textarea id="notes_nutritionist" placeholder="Enter notes..." /></div>
                    </FormCard>
                )}
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
                        {nutri.notes_nutritionist && (<> <Separator /> <div className="p-3"><p className="text-sm font-medium text-muted-foreground">Nutritionist Notes</p><p className="text-foreground mt-1 whitespace-pre-wrap">{nutri.notes_nutritionist}</p></div></>)}
                    </div>
                    ))
                ) : ( <p className="text-muted-foreground text-center py-4">No nutrition assessment recorded.</p> )}
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle className="flex items-center gap-3"><Target className="w-6 h-6" /><span>Goals</span></CardTitle>
                    <CardDescription>Patient's health and wellness goals.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowGoalForm(!showGoalForm)}>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    {showGoalForm ? 'Cancel' : 'Set Goal'}
                </Button>
                </CardHeader>
                <CardContent>
                {showGoalForm && (
                    <FormCard title="Set New Goal" onCancel={() => setShowGoalForm(false)} onSubmit={(e) => { e.preventDefault(); handleSave(setShowGoalForm); }}>
                    <div className="space-y-4">
                        <div className="grid gap-2"><Label htmlFor="discussion">Discussion</Label><Textarea id="discussion" placeholder="Notes from discussion with patient..." /></div>
                        <div className="grid gap-2"><Label htmlFor="goal">Goal</Label><Textarea id="goal" placeholder="Define a clear, actionable goal..." /></div>
                    </div>
                    </FormCard>
                )}
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

            <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle className="flex items-center gap-3"><Stethoscope className="w-6 h-6" /><span>Clinical Review</span></CardTitle>
                    <CardDescription>Notes from clinical staff.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowClinicalForm(!showClinicalForm)}>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    {showClinicalForm ? 'Cancel' : 'Add Review'}
                </Button>
                </CardHeader>
                <CardContent>
                {showClinicalForm && (
                    <FormCard title="Add Clinical Review" onCancel={() => setShowClinicalForm(false)} onSubmit={(e) => { e.preventDefault(); handleSave(setShowClinicalForm); }}>
                    <div className="space-y-4">
                        <div className="grid gap-2"><Label htmlFor="notes_doctor">Doctor's Notes</Label><Textarea id="notes_doctor" placeholder="Enter doctor's notes..."/></div>
                        <div className="grid gap-2"><Label htmlFor="notes_psychologist">Psychologist's Notes</Label><Textarea id="notes_psychologist" placeholder="Enter psychologist's notes..."/></div>
                    </div>
                    </FormCard>
                )}
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
                <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <User className="w-6 h-6" />
                    <span>Patient Information</span>
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
            </Card>
            {corporate && (
                <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Building2 className="w-6 h-6" /><span>Corporate</span></CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <DetailItem label="Company Name" value={corporate.name} />
                    <DetailItem label="Wellness Date" value={new Date(corporate.wellness_date).toLocaleDateString()} />
                </CardContent>
                </Card>
            )}
            <Card>
                <CardHeader>
                <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Button variant="outline">Edit Patient Details</Button>
                    <Button variant="destructive">Delete Patient Record</Button>
                </CardContent>
            </Card>
            </div>
        </div>
        </div>
    </div>
  );
}
