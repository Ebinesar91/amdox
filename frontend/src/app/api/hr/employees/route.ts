import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const tenantId = req.headers.get('x-tenant-id') || 'default-tenant-uuid-001';
    
    const res = await fetch('http://localhost:3000/api/hr/employees', {
      headers: { 'x-tenant-id': tenantId },
    });

    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const list = await res.json();

    const employees = list.map((emp: any) => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      role: emp.designation || 'Staff',
      department: emp.department,
      email: emp.email,
      status: emp.status === 'ACTIVE' ? 'Active' : 'Inactive',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.firstName}`
    }));

    return NextResponse.json(employees);
  } catch (err) {
    // Fallback
    return NextResponse.json([
      { id: '1', name: 'Sarah Jenkins', role: 'Chief Financial Officer', department: 'Finance', email: 'sarah.j@amdox.corp', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
      { id: '2', name: 'Robert Fox', role: 'Supply Chain Manager', department: 'Operations', email: 'robert.f@amdox.corp', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert' }
    ]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantId = req.headers.get('x-tenant-id') || 'default-tenant-uuid-001';

    const nameParts = body.name.trim().split(' ');
    const firstName = nameParts[0] || 'Unknown';
    const lastName = nameParts.slice(1).join(' ') || 'Employee';

    const payload = {
      firstName,
      lastName,
      email: body.email,
      department: body.department,
      designation: body.role || 'Staff',
      salary: 6000.0,
      joinedAt: new Date().toISOString(),
      organizationId: 'default-org-uuid-001',
    };

    const res = await fetch('http://localhost:3000/api/hr/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const emp = await res.json();

    return NextResponse.json({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      role: emp.designation,
      department: emp.department,
      email: emp.email,
      status: 'Active',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.firstName}`
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid employee payload or backend connection failed' }, { status: 400 });
  }
}
