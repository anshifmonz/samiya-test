import { supabaseAdmin } from 'lib/supabase';
import { Address } from 'types/address';
import { ok, err, type ApiResponse } from 'utils/api/response';

export async function getUserAddresses(userId: string): Promise<ApiResponse<Address[]>> {
  const { data: addresses, error } = await supabaseAdmin
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return err();
  return ok(addresses || []);
}
