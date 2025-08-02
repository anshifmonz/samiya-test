import { NextRequest, NextResponse } from 'next/server';
import { getActivityStats, ActivityStatsParams } from 'lib/admin/activity-stats/getActivityStats';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupBy = searchParams.get('groupBy') as 'day' | 'week' | null;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const params: ActivityStatsParams = {
      ...(groupBy && { groupBy }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(limit && { limit: parseInt(limit) }),
      ...(offset && { offset: parseInt(offset) })
    };

    const stats = await getActivityStats(params);

    if (stats.error) {
      return NextResponse.json(
        { success: false, error: stats.error },
        { status: stats.status || 500 }
      );
    }

    const response = NextResponse.json({ success: true, data: stats });
    
    // Add cache-busting headers for real-time data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;

  } catch (error: any) {
    console.error('Error fetching activity statistics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
