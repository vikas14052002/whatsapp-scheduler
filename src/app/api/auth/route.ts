import { NextRequest, NextResponse } from 'next/server';
import { setSession, clearSession } from '@/lib/auth';
import { getDb, saveDb } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  const { action, email, password, name, businessName, businessType, phone } = await request.json();

  if (action === 'login') {
    const db = getDb();
    const business = db.businesses.find(b => b.email === email);
    if (!business) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    // Demo: any password works for demo business
    setSession({ business_id: business.id, email: business.email, name: business.name });
    return NextResponse.json({ success: true, business });
  }

  if (action === 'register') {
    const db = getDb();
    if (db.businesses.find(b => b.email === email)) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const businessId = uuidv4();
    const business = {
      id: businessId,
      name: businessName,
      type: businessType || 'salon',
      phone: phone || '',
      email,
      address: '',
      whatsapp_number: phone || '',
      timezone: 'Asia/Kolkata',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    db.businesses.push(business);
    saveDb(db);

    setSession({ business_id: business.id, email: business.email, name: business.name });
    return NextResponse.json({ success: true, business });
  }

  if (action === 'logout') {
    clearSession();
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
