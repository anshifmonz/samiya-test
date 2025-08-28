import { supabaseAdmin } from 'lib/supabase';
import { type Address } from 'types/address';
import { moveDefaultAddressFirst } from 'utils/moveDefaultAddressFirst';
import { ok, err, type ApiResponse } from 'utils/api/response';

export async function getUserAddresses(userId: string): Promise<ApiResponse<Address[]>> {
  const { data, error } = await supabaseAdmin
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return err();

  const addresses = moveDefaultAddressFirst(data || []);
  return ok(addresses || []);
}
