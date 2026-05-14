import { NextRequest, NextResponse } from 'next/server';
import { getCustomersByBusiness, createCustomer, getCustomerByPhone } from '@/lib/db-hybrid';
import { requireAuth } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const session = requireAuth();
    const customers = await getCustomersByBusiness(session.business_id);
    return NextResponse.json({ customers });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = requireAuth();
    const { name, phone, email, notes } = await request.json();

    const existing = await getCustomerByPhone(phone, session.business_id);
    if (existing) {
      return NextResponse.json({ error: 'Customer with this phone already exists' }, { status: 400 });
    }

    const customer = {
      id: uuidv4(),
      business_id: session.business_id,
      name,
      phone,
      email: email || '',
      notes: notes || '',
      visit_count: 0,
      last_visit: null as string | null,
      created_at: new Date().toISOString(),
    };

    await createCustomer(customer);

    return NextResponse.json({ success: true, customer });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
