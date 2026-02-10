import { db } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';
import type { Transaction } from '@/lib/types';
import { RowDataPacket } from 'mysql2';

// Function to fetch related data and build full transaction objects
async function buildTransactions(transactionRows: any[]): Promise<Transaction[]> {
  if (transactionRows.length === 0) {
    return [];
  }

  const transactionIds = transactionRows.map(t => t.id);

  // Only fetch ambulances/drivers that are referenced by these transactions
  const ambulanceIds = Array.from(new Set(transactionRows.map(t => t.ambulance_id).filter(Boolean)));
  const driverIds = Array.from(new Set(transactionRows.map(t => t.driver_id).filter(Boolean)));

  const [ambulances] = ambulanceIds.length
    ? await db.query('SELECT * FROM ambulances WHERE id IN (?)', [ambulanceIds])
    : [[], undefined];

  const [drivers] = driverIds.length
    ? await db.query('SELECT * FROM drivers WHERE id IN (?)', [driverIds])
    : [[], undefined];

  // Fetch technicians linked to these transactions via a join to avoid loading entire table
  const [technicianRows] = await db.query<RowDataPacket[]>(
    'SELECT tt.transaction_id, et.* FROM transaction_technicians tt JOIN emergency_technicians et ON et.id = tt.technician_id WHERE tt.transaction_id IN (?)',
    [transactionIds]
  );

  // Use string keys to avoid mismatches between number/string id representations
  const ambulanceMap = new Map((ambulances as any[]).map(a => [String(a.id), a]));
  const driverMap = new Map((drivers as any[]).map(d => [String(d.id), d]));

  const technicianMap = new Map<number, any>();
  // Build map of transaction_id -> [technicians]
  const transactionTechniciansMap = new Map<number, any[]>();
  technicianRows.forEach(row => {
    const txId = row.transaction_id;
    const tech = { id: row.id, name: row.name };
    technicianMap.set(row.id, tech);
    if (!transactionTechniciansMap.has(txId)) transactionTechniciansMap.set(txId, []);
    transactionTechniciansMap.get(txId)!.push(tech);
  });

  return transactionRows.map(t => {
    // With `decimalNumbers: true` in the DB config, all numeric fields are already numbers.
    // We just need to join the related data.
    return {
      ...t,
      ambulance: ambulanceMap.get(String(t.ambulance_id)),
      driver: driverMap.get(String(t.driver_id)),
      emergency_technicians: transactionTechniciansMap.get(t.id) || [],
    };
  });
}


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ambulanceId = searchParams.get('ambulanceId');

  try {
    let query = 'SELECT * FROM transactions';
    const params: (string | number)[] = [];

    if (ambulanceId) {
      query += ' WHERE ambulance_id = ?';
      params.push(ambulanceId);
    }
    
    query += ' ORDER BY date DESC';

    const [rows] = await db.query(query, params);
    const fullTransactions = await buildTransactions(rows as any[]);
    
    return NextResponse.json(fullTransactions);

  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const {
        date,
        ambulance_id,
        driver_id,
        emergency_technician_ids,
        total_till,
        fuel,
        operation,
        cash_deposited_by_staff,
    } = await req.json();

    const [ambulanceRows] = await connection.query<RowDataPacket[]>('SELECT target FROM ambulances WHERE id = ?', [ambulance_id]);
    if (ambulanceRows.length === 0) {
        await connection.rollback();
        return NextResponse.json({ message: 'Ambulance not found' }, { status: 404 });
    }
    const target = ambulanceRows[0].target;

    // Business logic for calculation ONCE on creation
    const totalTillNum = Number(total_till) || 0;
    const fuelNum = Number(fuel) || 0;
    const operationNum = Number(operation) || 0;
    const cashDepositedNum = Number(cash_deposited_by_staff) || 0;
    const targetNum = Number(target) || 0;
    
    const amount_paid_to_the_till = totalTillNum - cashDepositedNum;
    const offload = totalTillNum - fuelNum - operationNum;
    const salary = (offload - targetNum) >= 0 ? (offload - targetNum) : 0;
    const operations_cost = operationNum + salary;
    const net_banked = totalTillNum - fuelNum - operationNum - salary;
    const deficit = targetNum > 0 ? targetNum - net_banked : 0;
    const performance = targetNum > 0 ? net_banked / targetNum : 0;
    const fuel_revenue_ratio = totalTillNum > 0 ? fuelNum / totalTillNum : 0;

    const transactionData = {
        date,
        ambulance_id,
        driver_id,
        total_till: totalTillNum,
        target: targetNum,
        fuel: fuelNum,
        operation: operationNum,
        cash_deposited_by_staff: cashDepositedNum,
        amount_paid_to_the_till,
        offload,
        salary,
        operations_cost,
        net_banked,
        deficit,
        performance,
        fuel_revenue_ratio,
    };

    const [result] = await connection.query('INSERT INTO transactions SET ?', transactionData);
    const transactionId = (result as any).insertId;

    if (emergency_technician_ids && emergency_technician_ids.length > 0) {
        const technicianLinks = emergency_technician_ids.map((techId: number) => [transactionId, techId]);
        await connection.query('INSERT INTO transaction_technicians (transaction_id, technician_id) VALUES ?', [technicianLinks]);
    }

    await connection.commit();

    // Fetch the newly created transaction to return it with all relations
    const [rows] = await db.query('SELECT * FROM transactions WHERE id = ?', [transactionId]);
    const newTransaction = await buildTransactions(rows as any[]);

    return NextResponse.json({ message: 'Transaction created successfully', transaction: newTransaction[0] }, { status: 201 });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  } finally {
    connection.release();
  }
}
