import { NextRequest, NextResponse } from 'next/server';
import { deleteImageFromCloudinary, deleteMultipleImagesFromCloudinary } from '@/lib/upload/cloudinary-server';

export const dynamic = 'force-dynamic';

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get('publicId');
    const publicIds = searchParams.get('publicIds');

    if (publicIds) {
      const ids = JSON.parse(publicIds);

      if (!Array.isArray(ids)) {
        return NextResponse.json(
          { error: 'publicIds must be an array' },
          { status: 400 }
        );
      }

      const result = await deleteMultipleImagesFromCloudinary(ids);

      if (result.success) {
        return NextResponse.json({ success: true }, { status: 200 });
      } else {
        return NextResponse.json(
          {
            success: false,
            errors: result.errors
          },
          { status: 500 }
        );
      }
    } else if (publicId) {
      const result = await deleteImageFromCloudinary(publicId);

      if (result.success) {
        return NextResponse.json({ success: true }, { status: 200 });
      } else {
        return NextResponse.json(
          {
            success: false,
            error: result.error
          },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Either publicId or publicIds parameter is required' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Delete image error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete image.' },
      { status: 500 }
    );
  }
}
