import { supabaseAdmin } from './supabase';

const SESSION_DURATION_MS = 60 * 60 * 1000; // 1h

export async function createSession(adminUser: { id: string; username: string; is_superuser: boolean; created_at: string; updated_at: string }): Promise<{ sessionId: string; expiresAt: number }> {
  const sessionId = crypto.randomUUID();
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  await supabaseAdmin.from('admin_sessions').insert({
    session_id: sessionId,
    expires_at: new Date(expiresAt).toISOString(),
    metadata: {
      adminUser: {
        id: adminUser.id,
        username: adminUser.username,
        is_superuser: adminUser.is_superuser,
        created_at: adminUser.created_at,
        updated_at: adminUser.updated_at
      }
    },
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

export async function getAdminUserFromSession(sessionId: string): Promise<null | { id: string; username: string; is_superuser: boolean; created_at: string; updated_at: string }> {
  const { data, error } = await supabaseAdmin
    .from('admin_sessions')
    .select('metadata')
    .eq('session_id', sessionId)
    .single();
  if (error || !data || !data.metadata || !data.metadata.adminUser) return null;
  return data.metadata.adminUser;
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
