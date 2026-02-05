import { getTransactions, getAmbulances } from '@/lib/data';
import AdminDashboardClient from './admin-dashboard-client';

export default async function AdminDashboardPage() {
  const transactions = await getTransactions();
  const ambulances = await getAmbulances();
  return <AdminDashboardClient initialTransactions={transactions} initialAmbulances={ambulances} />;
}
