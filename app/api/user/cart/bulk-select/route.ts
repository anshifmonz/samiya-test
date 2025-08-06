import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { bulkUpdateCartSelection } from 'lib/user/cart';

export async function PATCH(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });

    const { isSelected } = await request.json();

    const result = await bulkUpdateCartSelection(user.id, isSelected);
    if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 500 });

    return NextResponse.json({ 
      message: `All cart items ${isSelected ? 'selected' : 'deselected'} successfully`,
      updatedCount: result.updatedCount 
    }, { status: 200 });
  } catch (error) {
    console.error('Error bulk updating cart selection:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}