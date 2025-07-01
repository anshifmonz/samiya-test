import { type Special } from '@/types/special';

async function getSelections(): Promise<Special[]> {
  try {
    const specials = (await import('@/data/specials')).specials;
    return specials;
  } catch (error) {
    console.error('Error fetching specials:', error);
    return [];
  }
}

export default getSelections;
