import { NextRequest } from 'next/server';
import createUser from 'src/lib/api/user/auth/signup';
import { err, jsonResponse } from 'lib/utils/api/response';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, to } = await request.json();
    if (!name || typeof name !== 'string' || name.trim().length === 0)
      return jsonResponse(err('Valid name is required', 400));
    if (!email || typeof email !== 'string' || !email.includes('@'))
      return jsonResponse(err('Valid email is required', 400));
    if (!password || typeof password !== 'string' || password.length < 6)
      return jsonResponse(err('Password must be between 6 and 64 characters', 400));

    const result = await createUser({ name, email, password, to });
    if (result.error) return jsonResponse(result);

    return jsonResponse(result);
  } catch (_) {
    return jsonResponse(err());
  }
}
