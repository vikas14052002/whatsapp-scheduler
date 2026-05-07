import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const session = requireAuth();
    const db = getDb();
    const patients = db.patients.filter(p => p.business_id === session.business_id);
    return NextResponse.json({ patients });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = requireAuth();
    const { name, phone, email, notes } = await request.json();

    const db = getDb();
    const existing = db.patients.find(p => p.phone === phone && p.business_id === session.business_id);
    if (existing) {
      return NextResponse.json({ error: 'Patient with this phone already exists' }, { status: 400 });
    }

    const patient = {
      id: uuidv4(),
      business_id: session.business_id,
      name,
      phone,
      email: email || '',
      notes: notes || '',
      visit_count: 0,
      last_visit: null,
      created_at: new Date().toISOString(),
    };

    db.patients.push(patient);
    saveDb(db);

    return NextResponse.json({ success: true, patient });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
