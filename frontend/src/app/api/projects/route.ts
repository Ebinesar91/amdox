import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const tenantId = req.headers.get('x-tenant-id') || 'default-tenant-uuid-001';
    
    const res = await fetch('http://localhost:3000/api/projects', {
      headers: { 'x-tenant-id': tenantId },
    });

    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const list = await res.json();

    const projects = list.map((p: any) => ({
      id: `PRJ-${p.id.substring(0, 4)}`,
      name: p.name,
      budget: parseFloat(p.budget),
      progress: p.progress || 45, // default simulation progress
      manager: p.manager || 'Alex S.',
      status: p.status === 'ACTIVE' ? 'Active' : 'On Hold'
    }));

    return NextResponse.json(projects);
  } catch (err) {
    return NextResponse.json([
      { id: 'PRJ-101', name: 'Cloud Migration Phase 2', budget: 1500000, progress: 65, manager: 'Alex S.', status: 'Active' },
      { id: 'PRJ-102', name: 'ERP AI Integration', budget: 450000, progress: 24, manager: 'Sarah J.', status: 'Active' }
    ]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantId = req.headers.get('x-tenant-id') || 'default-tenant-uuid-001';

    const payload = {
      name: body.name,
      description: `Project portfolio managed by ${body.manager || 'Alex S.'}`,
      budget: parseFloat(body.budget),
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 90 * 24 * 3600000).toISOString(), // 90 days duration
      organizationId: 'default-org-uuid-001'
    };

    const res = await fetch('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const newProj = await res.json();

    return NextResponse.json({
      id: `PRJ-${newProj.id.substring(0, 4)}`,
      name: newProj.name,
      budget: parseFloat(newProj.budget),
      progress: 0,
      manager: body.manager || 'Alex S.',
      status: 'Active'
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create project on backend' }, { status: 400 });
  }
}
