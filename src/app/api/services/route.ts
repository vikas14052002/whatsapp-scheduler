import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const session = requireAuth();
    const db = getDb();
    const services = db.services.filter(s => s.business_id === session.business_id);
    return NextResponse.json({ services });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = requireAuth();
    const { name, description, duration_minutes, price, deposit_amount } = await request.json();

    const db = getDb();
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

    db.services.push(service);
    saveDb(db);

    return NextResponse.json({ success: true, service });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = requireAuth();
    const { id } = await request.json();

    const db = getDb();
    const service = db.services.find(s => s.id === id && s.business_id === session.business_id);
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    service.is_active = false;
    saveDb(db);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
