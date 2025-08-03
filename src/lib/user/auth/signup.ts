import { supabasePublic } from '../../supabasePublic';

interface CreateUserParams {
  name: string;
  email: string;
  password: string;
}

async function createUser({ name, email, password }: CreateUserParams) {
  try {
    const { data: authData, error: authError } = await supabasePublic.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/`
      }
    });

    if (authError) return { error: authError.message, user: null };
    if (!authData.user) return { error: 'Failed to create user', user: null };

    return {
      error: null,
      user: { id: authData.user.id, email: authData.user.email, name }
    };

  } catch (error) {
    console.error('Error creating user:', error);
    return { error: 'Internal server error', user: null };
  }
}

export default createUser;
