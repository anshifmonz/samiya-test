import { NextRequest, NextResponse } from 'next/server';
import { categories, type Category } from '@/data/categories';

// In a real application, you would use a database
// For this example, we'll use in-memory storage
let categoriesData = [...categories];

export async function GET() {
  try {
    return NextResponse.json({
      categories: categoriesData,
      total: categoriesData.length
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'> = await request.json();
    
    // Generate new ID
    const id = `category-${Date.now()}`;
    const now = new Date().toISOString();
    
    const newCategory: Category = {
      ...categoryData,
      id,
      createdAt: now,
      updatedAt: now
    };

    categoriesData.push(newCategory);

    return NextResponse.json({
      category: newCategory,
      message: 'Category created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
