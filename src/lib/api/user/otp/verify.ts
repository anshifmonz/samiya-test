import mbClient from 'lib/messagebird';
import { supabaseAdmin } from 'lib/supabase';
import { ok, err } from 'utils/api/response';

const verifyOtp = async (
  userId: string,
  verificationId: string,
  token: string,
  phone: string
) => {
  try {
    const response = await new Promise<any>((resolve, reject) => {
      mbClient.verify.verify(verificationId, token, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });

    const { error: dbError } = await supabaseAdmin
      .from('addresses')
      .update({ is_phone_verified: true })
      .eq('user_id', userId)
      .eq('phone', phone);

    if (dbError) err();

    return ok({ success: true, phone: response.recipient });
  } catch (e) {
    return err('Invalid or expired OTP', 400);
  }
};

export default verifyOtp;
