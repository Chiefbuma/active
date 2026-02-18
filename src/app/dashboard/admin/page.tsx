'use client';

import { useState, useEffect } from 'react';
import AdminDashboardClient from './admin-dashboard-client';
import type { Transaction, Ambulance } from '@/lib/types';
import { getTransactions, getAmbulances } from '@/lib/data';
import { Loader2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [ambulances, setAmbulances] = useState<Ambulance[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [transactionsData, ambulancesData] = await Promise.all([
          getTransactions(),
          getAmbulances(),
        ]);
        setTransactions(transactionsData);
        setAmbulances(ambulancesData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
        setTransactions([]);
        setAmbulances([]);
      }
    }
    fetchData();
  }, []);

  if (transactions === null || ambulances === null) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return <AdminDashboardClient initialTransactions={transactions} initialAmbulances={ambulances} />;
}
