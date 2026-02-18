'use client';

import { useState, useEffect } from 'react';
import AmbulancesClient from './ambulances-client';
import { Card, CardContent } from '@/components/ui/card';
import { getAmbulances } from '@/lib/data';
import type { Ambulance } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AmbulancesPage() {
  const [ambulances, setAmbulances] = useState<Ambulance[] | null>(null);

  useEffect(() => {
    getAmbulances()
      .then(data => {
        setAmbulances(data);
      })
      .catch(err => {
        console.error("Failed to fetch ambulances", err);
        setAmbulances([]); // Set to empty array on error
      });
  }, []);

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
            {ambulances === null ? (
              <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : (
              <AmbulancesClient initialAmbulances={ambulances} />
            )}
        </div>
      </CardContent>
    </Card>
  )
}
