import { supabaseAdmin } from 'lib/supabase';
import { ok, err, type ApiResponse } from 'utils/api/response';

export async function deleteAddress(addressId: string, userId: string): Promise<ApiResponse<null>> {
  const { error } = await supabaseAdmin
    .from('addresses')
    .delete()
    .eq('id', addressId)
    .eq('user_id', userId);

  if (error) return err();
  return ok(null);
}
