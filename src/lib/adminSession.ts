import { supabaseAdmin } from './supabase';

const SESSION_DURATION_MS = 60 * 60 * 1000; // 1h

export async function createSession(): Promise<{ sessionId: string; expiresAt: number }> {
  const sessionId = crypto.randomUUID();
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  await supabaseAdmin.from('admin_sessions').insert({
    session_id: sessionId,
    expires_at: new Date(expiresAt).toISOString(),
    metadata: {},
  });
  return { sessionId, expiresAt };
}

export async function validateSession(sessionId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('admin_sessions')
    .select('expires_at')
    .eq('session_id', sessionId)
    .single();
  if (error || !data) return false;
  const expiresAt = new Date(data.expires_at).getTime();
  if (Date.now() > expiresAt) {
    await supabaseAdmin.from('admin_sessions').delete().eq('session_id', sessionId);
    return false;
  }
  return true;
}

export async function removeSession(sessionId: string) {
  await supabaseAdmin.from('admin_sessions').delete().eq('session_id', sessionId);
}

async function getKey(secret: string) {
  return await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signSessionId(sessionId: string, secret: string): Promise<string> {
  const key = await getKey(secret);
  const sigBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(sessionId)
  );
  const signature = base64urlEncode(sigBuffer);
  return `${sessionId}.${signature}`;
}

export async function unsignSessionId(signed: string, secret: string): Promise<string | null> {
  const [sessionId, signature] = signed.split('.');
  if (!sessionId || !signature) return null;
  const key = await getKey(secret);
  const expectedSigBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(sessionId)
  );
  const expectedSignature = base64urlEncode(expectedSigBuffer);
  if (expectedSignature === signature) return sessionId;
  return null;
}

function base64urlEncode(buffer: ArrayBuffer): string {
  return Buffer.from(buffer as Uint8Array)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}
