'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getAmbulanceById, getTransactionsByAmbulanceId } from '@/lib/data';
import AmbulanceDetailsClient from './details-client';
import { Loader2 } from 'lucide-react';
import type { Ambulance, Transaction } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AmbulanceDetailsPage() {
  const params = useParams();
  const ambulanceId = Number(params.id);

  const [ambulance, setAmbulance] = useState<Ambulance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ambulanceId || isNaN(ambulanceId)) {
      setError('Invalid ambulance ID.');
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setLoading(true);
        const [ambulanceData, transactionsData] = await Promise.all([
          getAmbulanceById(ambulanceId),
          getTransactionsByAmbulanceId(ambulanceId),
        ]);
        setAmbulance(ambulanceData);
        setTransactions(transactionsData);
      } catch (err) {
        setError('Failed to load ambulance data. It may not exist.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [ambulanceId]);

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (error || !ambulance || transactions === null) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{error || 'Ambulance not found.'}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return <AmbulanceDetailsClient initialAmbulance={ambulance} initialTransactions={transactions} />;
}
