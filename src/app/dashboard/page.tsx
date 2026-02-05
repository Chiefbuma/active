import DashboardClient from './dashboard-client';
import { Card, CardContent } from '@/components/ui/card';
import { getAmbulances } from '@/lib/data';

export default async function DashboardPage() {
  const ambulances = await getAmbulances();
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">
                    Manage Ambulances
                </h1>
                <p className="text-muted-foreground">
                    A list of all ambulances in your fleet.
                </p>
                </div>
            </div>
            <DashboardClient initialAmbulances={ambulances} />
        </div>
      </CardContent>
    </Card>
  )
}
