'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from 'lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const {
        data: { session },
        error
      } = await supabase.auth.getSession();

      if (!error) {
        setSession(session);
        setUser(session?.user ?? null);
      }

      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const refreshSession = useCallback(async (): Promise<void> => {
    await supabase.auth.refreshSession();
  }, [supabase]);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }, [supabase]);

  return {
    user,
    session,
    loading,
    signOut,
    refreshSession
  };
}
