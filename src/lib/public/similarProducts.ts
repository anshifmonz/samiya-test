import { supabasePublic } from 'lib/supabasePublic';
import { type SimilarProduct } from '@/types/product';

const similarProducts = async (productId: string, limitCount: number, offsetCount: number): Promise<SimilarProduct[] | null> => {
    const { data, error } = await supabasePublic.rpc('get_similar_products_rpc', {
      current_product_id: productId,
      limit_count: limitCount,
      offset_count: offsetCount,
    });

    if (error) return null;
    return data;
};

export default similarProducts;
