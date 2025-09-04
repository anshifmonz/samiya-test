import { NextRequest } from 'next/server';
import mbClient from 'lib/messagebird';
import { getServerUser } from 'utils/getServerSession';
import { ok, err, jsonResponse } from 'utils/api/response';

export async function POST(req: NextRequest) {
  const user = await getServerUser();
  if (!user) return jsonResponse(err('Unauthorized', 401));

  const { phone } = await req.json();
  if (!phone) return jsonResponse(err('Phone is required', 400));

  try {
    const response = await new Promise<any>((resolve, reject) => {
      mbClient.verify.create(
        phone,
        {
          originator: 'Ramiya',
          template: 'Your verification code is %token.',
          timeout: 300 // 5 min expiry
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });

    return jsonResponse(ok({ verificationId: response.id }));
  } catch (error) {
    console.error('Error sending OTP:', error);
    return jsonResponse(err('Failed to send OTP', 500));
  }
}
