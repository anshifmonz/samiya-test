import { type NewArrival } from '@/data/newarrivals';

async function getNewArrivals(): Promise<NewArrival[]> {
  try {
    const new_arrivals = (await import('@/data/newarrivals')).default;
    return new_arrivals;
  } catch (error) {
    console.error('Error fetching newArrivals:', error);
    return [];
  }
}

export default getNewArrivals;
