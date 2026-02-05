import MedicalStaffClient from './medical-staff-client';
import { Card, CardContent } from '@/components/ui/card';
import { getEmergencyTechnicians } from '@/lib/data';

export default async function MedicalStaffPage() {
  const medicalStaff = await getEmergencyTechnicians();
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">
                    Manage Emergency Technicians
                </h1>
                <p className="text-muted-foreground">
                    A list of all emergency technicians in your team.
                </p>
                </div>
            </div>
            <MedicalStaffClient initialMedicalStaff={medicalStaff} />
        </div>
      </CardContent>
    </Card>
  )
}
