import { supabasePublic } from 'lib/supabasePublic';
import { ok, err } from 'lib/utils/api/response';

interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  to?: string;
}

async function createUser({ name, email, password, to }: CreateUserParams) {
  try {
    const { data: authData, error: authError } = await supabasePublic.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${
          to || '/'
        }`
      }
    });

    if (authError) return err(authError.message);
    if (!authData.user) return err('Failed to create user');

    return ok({ id: authData.user.id, email: authData.user.email, name });
  } catch (_) {
    return err('Internal server error');
  }
}

export default createUser;
