import { supabaseAdmin } from '../supabase';
import { NextRequest } from 'next/server';

export async function getUserFromSession(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader.substring(7);
  if (!token) return null;

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return null;

  return user;
}
