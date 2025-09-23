import mbClient from 'lib/messagebird';
import { createClient } from 'lib/supabase/server';
import { ok, err } from 'utils/api/response';

const verifyOtp = async (
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

    const supabase = createClient();

    const { error: dbError } = await supabase
      .from('addresses')
      .update({ is_phone_verified: true })
      .eq('phone', phone);

    if (dbError) err();

    return ok({ success: true, phone: response.recipient });
  } catch (e) {
    return err('Invalid or expired OTP', 400);
  }
};

export default verifyOtp;
