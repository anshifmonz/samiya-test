import { NextRequest, NextResponse } from 'next/server';
import createUser from 'lib/user/auth/signup';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    if (!name || typeof name !== 'string' || name.trim().length === 0)
      return NextResponse.json({ error: 'Valid name is required' }, { status: 400 });
    if (!email || typeof email !== 'string' || !email.includes('@'))
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    if (!password || typeof password !== 'string' || password.length < 6)
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });

    const result = await createUser({ name, email, password });
    if (result.error)
      return NextResponse.json({ error: result.error }, { status: 400 });

    return NextResponse.json({
      message: 'User created successfully',
      user: result.user
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
