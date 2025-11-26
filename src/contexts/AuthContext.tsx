// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  university?: string;
  major?: string;
  graduation_year?: string;
  created_at?: Date;
  subscription_tier?: 'free' | 'premium';
  total_problems_solved?: number;
  current_streak?: number;
  best_streak?: number;
  total_study_time_minutes?: number;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  university?: string;
  major?: string;
  graduationYear?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (userData: SignupData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // Add timeout to getSession to prevent hanging
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Session timeout after 5 seconds')), 5000)
        );

        const result = await Promise.race([sessionPromise, timeoutPromise]);
        const { data: { session }, error } = result as { data: { session: Session | null }, error: AuthError | null };

        if (!mounted) return;

        if (error) {
          console.error('Auth session error:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          await loadUserData(session.user);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        if (mounted) setLoading(false);
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        try {
          if (session?.user) {
            await loadUserData(session.user);
          } else {
            setUser(null);
            setIsAdmin(false);
            setLoading(false);
          }
        } catch (error) {
          console.error('Auth state change failed:', error);
          setLoading(false);
        }
      }
    );

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (authUser: SupabaseUser) => {
    // Create user from auth metadata immediately
    const user = {
      id: authUser.id,
      name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
      email: authUser.email || '',
      university: authUser.user_metadata?.university || '',
      major: authUser.user_metadata?.major || 'Engineering',
      graduation_year: authUser.user_metadata?.graduation_year || '',
      subscription_tier: 'free' as const,
      total_problems_solved: 0,
      current_streak: 0,
      best_streak: 0,
      total_study_time_minutes: 0,
    };

    setUser(user);
    setLoading(false);
  };

  const signup = async (userData: SignupData) => {
    const { email, password, name, university, major, graduationYear } = userData;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          university: university || '',
          major: major || 'Engineering',
          graduation_year: graduationYear || '',
        }
      }
    });

    if (error) {
      throw error;
    }

    // Create user record in database (backup in case trigger doesn't work)
    if (data.user) {
      try {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: email,
            name: name,
            university: university || '',
            major: major || 'Engineering',
            graduation_year: graduationYear || '',
          });

        if (insertError && insertError.code !== '23505') { // 23505 = unique violation (already exists)
          console.error('Failed to create user record:', insertError);
        }
      } catch (err) {
        console.error('Error creating user record:', err);
      }
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }

    setUser(null);
    setIsAdmin(false);
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', user.id);

    if (error) {
      throw error;
    }

    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    updateUserProfile,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};