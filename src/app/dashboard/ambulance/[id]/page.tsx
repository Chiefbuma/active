import { getAmbulanceById, getTransactionsByAmbulanceId } from '@/lib/data';
import AmbulanceDetailsClient from './details-client';
import { notFound } from 'next/navigation';

export default async function AmbulanceDetailsPage({ params }: { params: { id: string } }) {
  const ambulanceId = Number(params.id);
  const ambulance = await getAmbulanceById(ambulanceId);
  
  if (!ambulance) {
    notFound();
  }
  
  const transactions = await getTransactionsByAmbulanceId(ambulanceId);

  return <AmbulanceDetailsClient initialAmbulance={ambulance} initialTransactions={transactions} />;
}
