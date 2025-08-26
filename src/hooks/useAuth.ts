import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User, AuthState } from '../types/auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthState({
          user: transformUser(session.user),
          loading: false,
          error: null,
        });
      } else {
        setAuthState({
          user: null,
          loading: false,
          error: null,
        });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (session?.user) {
        setAuthState({
          user: transformUser(session.user),
          loading: false,
          error: null,
        });
      } else {
        setAuthState({
          user: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const transformUser = (supabaseUser: SupabaseUser): User => ({
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    username: supabaseUser.user_metadata?.username || 
              supabaseUser.user_metadata?.full_name || 
              supabaseUser.email?.split('@')[0] || 'Anonymous',
    full_name: supabaseUser.user_metadata?.full_name,
    bio: supabaseUser.user_metadata?.bio,
    avatar_url: supabaseUser.user_metadata?.avatar_url,
    created_at: supabaseUser.created_at,
  });

  const signUp = async (email: string, password: string, username: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: username,
        },
      },
    });

    if (error) {
      setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
      return { error };
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
      return { error };
    }

    return { error: null };
  };

  const signInWithGoogle = async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });

    if (error) {
      setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
      return { error };
    }

    return { error: null };
  };

  const updateProfile = async (updates: {
    username?: string;
    full_name?: string;
    bio?: string;
    avatar_url?: string;
  }) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    const { error } = await supabase.auth.updateUser({
      data: updates
    });

    if (error) {
      setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
      return false;
    }

    setAuthState(prev => ({ ...prev, loading: false }));
    return true;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthState(prev => ({ ...prev, error: error.message }));
    }
  };

  return {
    ...authState,
    signUp,
    signIn,
    signInWithGoogle,
    updateProfile,
    signOut,
  };
}