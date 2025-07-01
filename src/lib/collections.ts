import { type Collection } from '@/types/collection';

async function getCollections(): Promise<Collection[]> {
  try {
    const collections = (await import('@/data/collections')).default;
    return collections;
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

export default getCollections;
