import { supabaseAdmin } from '../../../supabase';
import { Address } from 'types/address';

export async function getUserAddresses(userId: string): Promise<Address[]> {
  try {
    const { data: addresses, error } = await supabaseAdmin
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Error fetching addresses: ${error}`);

    return addresses || [];
  } catch (error) {
    console.error('Error in getUserAddresses:', error);
    throw error;
  }
}
