import AmbulancesClient from './ambulances-client';
import { Card, CardContent } from '@/components/ui/card';
import { getAmbulances, getTransactions } from '@/lib/data';
import type { Ambulance } from '@/lib/types';

export default async function DashboardPage() {
  const ambulances = await getAmbulances();
  const transactions = await getTransactions();

  const ambulanceData = ambulances.map(ambulance => {
    const latestTransaction = transactions
      .filter(t => t.ambulance.id === ambulance.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    return {
      ...ambulance,
      last_driven_by: latestTransaction ? `${latestTransaction.driver.first_name} ${latestTransaction.driver.last_name}` : 'N/A',
      last_driven_on: latestTransaction ? new Date(latestTransaction.date).toLocaleDateString() : 'N/A',
    }
  }) as Ambulance[];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">
                    Ambulance Fleet
                </h1>
                <p className="text-muted-foreground">
                    A list of all ambulances in your fleet.
                </p>
                </div>
            </div>
            <AmbulancesClient initialAmbulances={ambulanceData} />
        </div>
      </CardContent>
    </Card>
  )
}
