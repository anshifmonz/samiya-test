import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { createOrder } from 'lib/user/order';
import { type CreateOrderRequest, type CreateOrderResponse } from 'types/order';

export async function POST(request: NextRequest): Promise<NextResponse<CreateOrderResponse>> {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body: CreateOrderRequest = await request.json();
    const { checkoutId, shippingAddressId, paymentMethod } = body;

    // Create the order first
    const result = await createOrder(user.id, checkoutId, shippingAddressId, paymentMethod);
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 500 });

    // For online payments, include payment initiation details from lib
    return NextResponse.json({
      message: 'Order created successfully',
      data: {
        orderId: result.data?.orderId,
        payment_required: paymentMethod !== 'cod',
        payment: result.data?.payment || null,
        payment_error: result.data?.payment_error
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
