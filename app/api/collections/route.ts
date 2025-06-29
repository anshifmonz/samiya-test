import { NextRequest, NextResponse } from 'next/server';
import collections, { type Collection } from '@/data/collections';

// In a real application, you would use a database
// For this example, we'll use in-memory storage
let collectionsData = [...collections];

export async function GET() {
  try {
    return NextResponse.json({
      collections: collectionsData,
      total: collectionsData.length
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const collectionData: Omit<Collection, 'id'> = await request.json();
    
    // Generate new ID
    const id = `collection-${Date.now()}`;
    
    const newCollection: Collection = {
      ...collectionData,
      id
    };

    collectionsData.push(newCollection);

    return NextResponse.json({
      collection: newCollection,
      message: 'Collection created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
