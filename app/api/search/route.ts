import { NextRequest, NextResponse } from 'next/server';
import searchProducts from 'lib/public/search';
import { type SearchResult } from 'types/product';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const category = searchParams.get('category');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const colors = searchParams.get('colors');
  const tags = searchParams.get('tags');
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset');

  const minPriceNumber = minPrice ? parseInt(minPrice) : undefined;
  const maxPriceNumber = maxPrice ? parseInt(maxPrice) : undefined;
  const colorsArray = colors ? colors.split(',') : [];
  const tagsArray = tags ? tags.split(',') : [];
  const limitNumber = limit ? parseInt(limit) : 16;
  const offsetNumber = offset ? parseInt(offset) : 0;

  const products: SearchResult = await searchProducts(query, {
    category,
    minPrice: minPriceNumber,
    maxPrice: maxPriceNumber,
    colors: colorsArray,
    tags: tagsArray,
    limit: limitNumber,
    offset: offsetNumber
  });

  return NextResponse.json(products);
}
