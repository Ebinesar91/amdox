import { NextResponse, NextRequest } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  return NextResponse.json(db.vendors);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    const newVendor = {
      id: `V-${Math.floor(103 + Math.random() * 1000)}`,
      name: body.name,
      email: body.email,
      rating: parseFloat(body.rating || '5.0'),
      status: 'Active'
    };

    db.vendors.push(newVendor);
    saveDb(db);

    return NextResponse.json(newVendor, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid vendor data' }, { status: 400 });
  }
}
