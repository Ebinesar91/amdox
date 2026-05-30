import { NextResponse, NextRequest } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  return NextResponse.json(db.employees);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    const newEmployee = {
      id: String(db.employees.length + 1),
      name: body.name,
      role: body.role,
      department: body.department,
      email: body.email,
      status: 'Active',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${body.name}`
    };

    db.employees.push(newEmployee);
    saveDb(db);

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid employee payload' }, { status: 400 });
  }
}
