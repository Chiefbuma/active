import { getAmbulanceById } from '@/lib/server-data';
import { getTransactionsByAmbulanceId } from '@/lib/data';
import AmbulanceDetailsClient from './details-client';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AmbulanceDetailsPage({ params }: { params: { id: string } }) {
  const ambulanceId = Number(params.id);
  const ambulance = await getAmbulanceById(ambulanceId);
  
  if (!ambulance) {
    notFound();
  }
  
  const transactions = await getTransactionsByAmbulanceId(ambulanceId);
  const latestTransaction = transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const ambulanceData = {
    ...ambulance,
    last_driven_by: latestTransaction?.driver?.name || 'N/A',
    last_driven_on: latestTransaction ? new Date(latestTransaction.date).toLocaleDateString() : 'N/A',
  }

  return <AmbulanceDetailsClient initialAmbulance={ambulanceData} initialTransactions={transactions} />;
}
