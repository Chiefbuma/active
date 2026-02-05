import DriversClient from './drivers-client';
import { Card, CardContent } from '@/components/ui/card';
import { getDrivers } from '@/lib/data';

export default async function DriversPage() {
  const drivers = await getDrivers();
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">
                    Manage Drivers
                </h1>
                <p className="text-muted-foreground">
                    A list of all drivers in your fleet.
                </p>
                </div>
            </div>
            <DriversClient initialDrivers={drivers} />
        </div>
      </CardContent>
    </Card>
  )
}
