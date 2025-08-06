import { NextResponse } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { createCheckout } from 'lib/user/checkout';

export async function POST() {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });

    const result = await createCheckout(user.id);
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 500 });

    return NextResponse.json({
      message: 'Checkout created successfully',
      checkoutId: result.checkoutId,
      expiresAt: result.expiresAt
    }, { status: result.status || 201 });
  } catch (error) {
    console.error('Error creating checkout:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
