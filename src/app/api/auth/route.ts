import { NextRequest, NextResponse } from 'next/server';
import { setSession, clearSession, requireAuth } from '@/lib/auth';
import { getBusinessByEmail, createBusiness } from '@/lib/db-hybrid';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  const { action, email, password, name, businessName, businessType, phone } = await request.json();

  if (action === 'login') {
    const business = await getBusinessByEmail(email);
    if (!business) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    // Demo: any password works for demo business
    setSession({ business_id: business.id, email: business.email, name: business.name });
    return NextResponse.json({ success: true, business });
  }

  if (action === 'register') {
    const existing = await getBusinessByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const businessId = uuidv4();
    const business = {
      id: businessId,
      name: businessName,
      type: (businessType || 'salon') as 'salon' | 'clinic' | 'tuition' | 'consultant' | 'spa' | 'other',
      phone: phone || '',
      email,
      address: '',
      whatsapp_number: phone || '',
      timezone: 'Asia/Kolkata',
      is_active: true,
      created_at: new Date().toISOString(),
    };

    await createBusiness(business);

    setSession({ business_id: business.id, email: business.email, name: business.name });
    return NextResponse.json({ success: true, business });
  }

  if (action === 'logout') {
    clearSession();
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

export async function GET() {
  try {
    const session = requireAuth();
    const { getBusinessById } = await import('@/lib/db-hybrid');
    const business = await getBusinessById(session.business_id);
    return NextResponse.json({ business });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
