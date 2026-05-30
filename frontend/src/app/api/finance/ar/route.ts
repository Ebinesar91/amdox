import { NextResponse, NextRequest } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  return NextResponse.json(db.arInvoices);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();
    
    const newInvoice = {
      id: `AR-${Math.floor(903 + Math.random() * 1000)}`,
      customer: body.customer,
      dueDate: body.dueDate,
      amount: parseFloat(body.amount),
      status: body.status || 'Unpaid'
    };

    db.arInvoices.push(newInvoice);
    saveDb(db);

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid invoice payload' }, { status: 400 });
  }
}
