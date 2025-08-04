import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'lib/supabase/server';
import { getUserAddresses } from 'lib/user/profile/address/get';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user)
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });

    const addresses = await getUserAddresses(user.id);

    return NextResponse.json({
      addresses
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

