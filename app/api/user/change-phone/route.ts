import { NextRequest } from 'next/server';
import { admin } from 'lib/firebase/admin';
import { createClient } from 'lib/supabase/server';
import { ok, err, jsonResponse } from 'lib/utils/api/response';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return jsonResponse(err('Unauthorized', 401));

    const { verifyToken } = await request.json();
    if (!verifyToken) return jsonResponse(err('Firebase token is required', 400));

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(verifyToken);
    } catch (_) {
      return jsonResponse(err('Invalid Firebase token', 401));
    }

    const newPhone: string = decodedToken.phone_number;
    if (!newPhone) return jsonResponse(err('Phone number not found in token', 400));

    const { error: authUpdateError } = await supabase.auth.updateUser({
      phone: newPhone,
      data: {
        phone_number: newPhone,
        phone_verified: true
      }
    });

    if (authUpdateError) {
      if (authUpdateError.message.toLowerCase().includes('unique constraint'))
        return jsonResponse(err('This phone number is already in use.', 409));
      return jsonResponse(err('Failed to update authentication profile.', 500));
    }

    const { error: publicUpdateError } = await supabase
      .from('users')
      .update({ phone: newPhone })
      .eq('id', user.id);

    if (publicUpdateError) {
      console.error(
        'CRITICAL: Inconsistent state. Auth user phone updated, but public user failed.',
        {
          userId: user.id,
          newPhone: newPhone,
          error: publicUpdateError
        }
      );
      return jsonResponse(err('Failed to update user profile.', 500));
    }

    return jsonResponse(ok({}));
  } catch (error: unknown) {
    console.error('Unexpected error in change-phone route:', error);
    return jsonResponse(err());
  }
}
