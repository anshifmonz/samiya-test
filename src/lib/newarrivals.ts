import { type SpecialProduct } from '@/types/special';

async function getNewArrivals(): Promise<SpecialProduct[]> {
  try {
    const new_arrivals = (await import('@/data/newarrivals')).default;
    return new_arrivals;
  } catch (error) {
    console.error('Error fetching newArrivals:', error);
    return [];
  }
}

export default getNewArrivals;
