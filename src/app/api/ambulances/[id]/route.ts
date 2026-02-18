import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id:string }}) {
    try {
        const [ambulanceRows] = await db.query('SELECT * FROM ambulances WHERE id = ?', [params.id]);
        const ambulance = (ambulanceRows as any)[0];
        if (!ambulance) {
            return NextResponse.json({ message: 'Ambulance not found' }, { status: 404 });
        }

        // Get latest transaction to find last driver and date
        const [latestTransactionRows] = await db.query(
            `SELECT t.date, d.name as driver_name 
             FROM transactions t
             LEFT JOIN drivers d ON t.driver_id = d.id
             WHERE t.ambulance_id = ? 
             ORDER BY t.date DESC 
             LIMIT 1`,
            [params.id]
        );
        const latestTransaction = (latestTransactionRows as any)[0];

        const ambulanceData = {
            ...ambulance,
            last_driven_by: latestTransaction?.driver_name || 'N/A',
            last_driven_on: latestTransaction ? new Date(latestTransaction.date).toLocaleDateString() : 'N/A',
        };

        return NextResponse.json(ambulanceData);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}


export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { reg_no, fuel_cost, operation_cost, target, status } = await req.json();
    await db.query(
      'UPDATE ambulances SET reg_no = ?, fuel_cost = ?, operation_cost = ?, target = ?, status = ? WHERE id = ?',
      [reg_no, fuel_cost, operation_cost, target, status, params.id]
    );
    const [rows] = await db.query('SELECT id, reg_no, fuel_cost, operation_cost, target, status, created_at FROM ambulances WHERE id = ?', [params.id]);
    return NextResponse.json({ message: 'Ambulance updated successfully', ambulance: (rows as any)[0] });
  } catch (error) {
    console.error(error);
    if ((error as any).code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ message: 'An ambulance with this registration number already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await db.query('DELETE FROM ambulances WHERE id = ?', [params.id]);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
