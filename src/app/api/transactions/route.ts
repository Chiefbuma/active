import { db } from '@/lib/db';
import { NextResponse, NextRequest } from 'next/server';
import { Transaction } from '@/lib/types';
import { RowDataPacket } from 'mysql2';

// Function to fetch related data and build full transaction objects
async function buildTransactions(transactionRows: any[]): Promise<Transaction[]> {
  if (transactionRows.length === 0) {
    return [];
  }

  const transactionIds = transactionRows.map(t => t.id);

  const [ambulances] = await db.query('SELECT * FROM ambulances');
  const [drivers] = await db.query('SELECT * FROM drivers');
  const [technicians] = await db.query('SELECT * FROM emergency_technicians');
  const [technicianLinks] = await db.query<RowDataPacket[]>(
    'SELECT * FROM transaction_technicians WHERE transaction_id IN (?)',
    [transactionIds]
  );

  const ambulanceMap = new Map((ambulances as any[]).map(a => [a.id, a]));
  const driverMap = new Map((drivers as any[]).map(d => [d.id, d]));
  const technicianMap = new Map((technicians as any[]).map(t => [t.id, t]));

  const transactionTechniciansMap = new Map<number, any[]>();
  technicianLinks.forEach(link => {
    if (!transactionTechniciansMap.has(link.transaction_id)) {
      transactionTechniciansMap.set(link.transaction_id, []);
    }
    const technician = technicianMap.get(link.technician_id);
    if (technician) {
      transactionTechniciansMap.get(link.transaction_id)!.push(technician);
    }
  });

  return transactionRows.map(t => ({
    ...t,
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
    performance: Number(t.performance),
    fuel_revenue_ratio: Number(t.fuel_revenue_ratio),
    ambulance: ambulanceMap.get(t.ambulance_id),
    driver: driverMap.get(t.driver_id),
    emergency_technicians: transactionTechniciansMap.get(t.id) || [],
  }));
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
        throw new Error('Ambulance not found');
    }
    const target = ambulanceRows[0].target;

    // Business logic
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
    const deficit = targetNum - net_banked;
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
