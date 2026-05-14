import { NextRequest, NextResponse } from 'next/server';
import { getServicesByBusiness, createService, deactivateService } from '@/lib/db-hybrid';
import { requireAuth } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const session = requireAuth();
    const services = await getServicesByBusiness(session.business_id);
    return NextResponse.json({ services });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = requireAuth();
    const { name, description, duration_minutes, price, deposit_amount } = await request.json();

    const service = {
      id: uuidv4(),
      business_id: session.business_id,
      name,
      description: description || '',
      duration_minutes: Number(duration_minutes),
      price: Number(price),
      deposit_amount: Number(deposit_amount) || 0,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    await createService(service);

    return NextResponse.json({ success: true, service });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = requireAuth();
    const { id } = await request.json();

    await deactivateService(id, session.business_id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
