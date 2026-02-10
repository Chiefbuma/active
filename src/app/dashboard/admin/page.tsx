import { db } from '@/lib/db';
import AdminDashboardClient from './admin-dashboard-client';
import type { Transaction, Ambulance } from '@/lib/types';

export default async function AdminDashboardPage() {
  // Fetch ambulances directly from DB
  const [ambulanceRows] = await db.query('SELECT id, reg_no, fuel_cost, operation_cost, target, status, created_at, updated_at FROM ambulances ORDER BY created_at DESC');
  const ambulances = (ambulanceRows as any[]).map(r => ({
    id: r.id,
    reg_no: r.reg_no,
    fuel_cost: Number(r.fuel_cost),
    operation_cost: Number(r.operation_cost),
    target: Number(r.target),
    status: String(r.status),
  })) as Ambulance[];

  // Fetch transactions with full relations
  const [transactionRows] = await db.query('SELECT * FROM transactions ORDER BY date DESC');
  const transactionIds = (transactionRows as any[]).map(t => t.id);
  
  // Fetch drivers and technicians for the transactions
  const [drivers] = await db.query('SELECT id, name FROM drivers');
  const [technicians] = await db.query('SELECT id, name FROM emergency_technicians');
  const [technicianLinks] = await db.query(
    'SELECT tt.transaction_id, et.id, et.name FROM transaction_technicians tt JOIN emergency_technicians et ON et.id = tt.technician_id WHERE tt.transaction_id IN (?)',
    [transactionIds]
  );

  const driverMap = new Map((drivers as any[]).map(d => [d.id, d]));
  const technicianMap = new Map((technicians as any[]).map(t => [t.id, t]));
  const ambulanceMap = new Map(ambulances.map(a => [a.id, a]));
  
  const transactionTechnicianMap = new Map<number, any[]>();
  (technicianLinks as any[]).forEach(link => {
    if (!transactionTechnicianMap.has(link.transaction_id)) {
      transactionTechnicianMap.set(link.transaction_id, []);
    }
    transactionTechnicianMap.get(link.transaction_id)!.push({ id: link.id, name: link.name });
  });

  const transactions = (transactionRows as any[]).map(t => ({
    id: t.id,
    date: t.date,
    ambulance: ambulanceMap.get(t.ambulance_id) || { id: t.ambulance_id, reg_no: 'Unknown', fuel_cost: 0, operation_cost: 0, target: 0, status: 'active' as const },
    driver: driverMap.get(t.driver_id) || { id: t.driver_id, name: 'Unknown' },
    emergency_technicians: transactionTechnicianMap.get(t.id) || [],
    total_till: Number(t.total_till),
    target: Number(t.target),
    fuel: Number(t.fuel),
    operation: Number(t.operation),
    cash_deposited_by_staff: Number(t.cash_deposited_by_staff),
    amount_paid_to_the_till: Number(t.amount_paid_to_the_till),
    offload: Number(t.offload),
    salary: Number(t.salary),
    operations_cost: Number(t.operations_cost),
    net_banked: Number(t.net_banked),
    deficit: Number(t.deficit),
    fuel_revenue_ratio: Number(t.fuel_revenue_ratio),
    performance: Number(t.performance),
  })) as Transaction[];

  return <AdminDashboardClient initialTransactions={transactions} initialAmbulances={ambulances} />;
}
