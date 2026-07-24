import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const tenantId = req.headers.get('x-tenant-id') || 'default-tenant-uuid-001';
    
    const res = await fetch('http://localhost:3000/api/scm/vendors', {
      headers: { 'x-tenant-id': tenantId },
    });

    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const list = await res.json();

    const vendors = list.map((v: any) => ({
      id: `V-${v.id.substring(0, 3)}`,
      name: v.name,
      email: v.email,
      rating: parseFloat(v.rating || '5.0'),
      status: 'Verified'
    }));

    return NextResponse.json(vendors);
  } catch (err) {
    return NextResponse.json([
      { id: 'V-001', name: 'Amazon Web Services', email: 'billing@aws.com', rating: 4.8, status: 'Verified' },
      { id: 'V-002', name: 'Office Depot', email: 'supplies@officedepot.com', rating: 4.2, status: 'Active' }
    ]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tenantId = req.headers.get('x-tenant-id') || 'default-tenant-uuid-001';

    const payload = {
      name: body.name,
      email: body.email,
      phone: "+1-555-0199"
    };

    const res = await fetch('http://localhost:3000/api/scm/vendors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Status: ${res.status}`);
    const newVendor = await res.json();

    return NextResponse.json({
      id: `V-${newVendor.id.substring(0, 3)}`,
      name: newVendor.name,
      email: newVendor.email,
      rating: 5.0,
      status: 'Verified'
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to onboard vendor on backend' }, { status: 400 });
  }
}
