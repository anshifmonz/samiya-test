import { createClient } from 'lib/supabase/server';
import { ok, err, type ApiResponse } from 'utils/api/response';

export async function deleteAddress(addressId: string, userId: string): Promise<ApiResponse<null>> {
  const supabase = createClient();
  const { error } = await supabase
    .from('addresses')
    .update({ is_deleted: true })
    .eq('id', addressId)
    .eq('user_id', userId);

  if (error) return err();
  return ok(null);
}
