import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'lib/supabase/server';
import { createAddress } from 'lib/user/profile/address/add';
import { AddressFormData } from 'types/address';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user)
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });

    const addressData: AddressFormData = await request.json();

    if (!addressData.full_name || !addressData.phone || !addressData.street ||
        !addressData.city || !addressData.state || !addressData.postal_code || !addressData.country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newAddress = await createAddress(user.id, addressData);

    return NextResponse.json({
      message: 'Address created successfully',
      address: newAddress
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
