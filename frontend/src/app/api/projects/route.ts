import { NextResponse, NextRequest } from 'next/server';
import { getDb, saveDb } from '@/lib/db';

export async function GET() {
  const db = getDb();
  return NextResponse.json(db.projects);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = getDb();

    const newProject = {
      id: `PRJ-${Math.floor(103 + Math.random() * 1000)}`,
      name: body.name,
      budget: parseFloat(body.budget),
      progress: 0,
      manager: body.manager || 'Alex S.',
      status: 'Active'
    };

    db.projects.push(newProject);
    saveDb(db);

    return NextResponse.json(newProject, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid project payload' }, { status: 400 });
  }
}
