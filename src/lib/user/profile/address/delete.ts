import { supabaseAdmin } from '../../../supabase';

export async function deleteAddress(addressId: string, userId: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', userId);

    if (error) throw new Error(`Failed to delete address: ${error}`);
  } catch (error) {
    console.error('Error in deleteAddress:', error);
    throw error;
  }
}
