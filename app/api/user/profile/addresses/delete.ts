import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'lib/supabase/server';
import { deleteAddress } from 'lib/user/profile/address/delete';

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user)
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get('id');

    if (!addressId)
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });

    await deleteAddress(addressId, user.id);

    return NextResponse.json({ message: 'Address deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
