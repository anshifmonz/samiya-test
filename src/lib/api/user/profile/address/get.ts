import { createClient } from 'lib/supabase/server';
import { type Address } from 'types/address';
import { moveDefaultAddressFirst } from 'utils/moveDefaultAddressFirst';
import { ok, err, type ApiResponse } from 'utils/api/response';

export async function getUserAddresses(userId: string): Promise<ApiResponse<Address[]>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false });

  if (error) return err();

  const addresses = moveDefaultAddressFirst(data || []);
  return ok(addresses || []);
}
