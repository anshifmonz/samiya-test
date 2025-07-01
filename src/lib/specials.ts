import { type Special } from '@/data/specials';

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
