import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'lib/supabase/server';
import { updateAddress, setDefaultAddress } from 'lib/user/profile/address/update';
import { AddressFormData } from 'types/address';

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user)
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get('id');
    const action = searchParams.get('action');

    if (!addressId)
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });

    if (action === 'set-default') {
      await setDefaultAddress(addressId, user.id);
      return NextResponse.json({ message: 'Default address updated successfully' }, { status: 200 });
    }

    const addressData: Partial<AddressFormData> = await request.json();
    const updatedAddress = await updateAddress(addressId, user.id, addressData);

    return NextResponse.json({
      message: 'Address updated successfully',
      address: updatedAddress
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
