import { NextRequest } from 'next/server';
import { createClient } from 'lib/supabase/server';
import { ok, err, jsonResponse } from 'lib/utils/api/response';

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id');

  const { name } = await req.json();
  if (!name) return jsonResponse(err('Name is required', 400));

  const supabase = createClient();

  const { error } = await supabase.from('users').update({ name }).eq('id', userId);
  if (error) return jsonResponse(err());

  return jsonResponse(ok({}));
}
