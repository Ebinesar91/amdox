import { NextResponse, NextRequest } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  return NextResponse.json(db.payrollRuns);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    const baseSalary = parseFloat(body.salary);
    const bonus = parseFloat(body.bonuses || '0');
    const tax = baseSalary * 0.20; // 20% flat tax slab
    const net = baseSalary + bonus - tax;

    const newRun = {
      id: `PAY-${Math.floor(103 + Math.random() * 1000)}`,
      name: body.name,
      salary: baseSalary,
      bonuses: bonus,
      tax: tax,
      net: net,
      status: body.status || 'Draft'
    };

    db.payrollRuns.push(newRun);
    saveDb(db);

    return NextResponse.json(newRun, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid payroll run data' }, { status: 400 });
  }
}
