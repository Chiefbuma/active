import AmbulancesClient from './ambulances-client';
import { Card, CardContent } from '@/components/ui/card';
import { db } from '@/lib/db';
import type { Ambulance } from '@/lib/types';

export default async function AmbulancesPage() {
  // Query DB directly on the server to avoid HTTP round-trips to our own API
  const [rows] = await db.query('SELECT id, reg_no, fuel_cost, operation_cost, target, status, created_at, updated_at FROM ambulances ORDER BY created_at DESC');
  const ambulances = (rows as any[]).map(r => ({
    id: r.id,
    reg_no: r.reg_no,
    fuel_cost: Number(r.fuel_cost),
    operation_cost: Number(r.operation_cost),
    target: Number(r.target),
    status: String(r.status),
  })) as Ambulance[];

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
            <AmbulancesClient initialAmbulances={ambulances} />
        </div>
      </CardContent>
    </Card>
  )
}
