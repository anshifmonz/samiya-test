import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToCloudinary } from 'lib/upload/cloudinary-server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const result = await uploadFileToCloudinary(file);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed.' },
      { status: 500 }
    );
  }
}
