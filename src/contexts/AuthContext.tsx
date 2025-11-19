// src/contexts/AuthContext.tsx - Debug version with aggressive timeouts
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
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
      console.log('🚀 Starting auth initialization...');
      console.log('🔍 Supabase client exists:', !!supabase);
      console.log('🔍 Supabase auth exists:', !!supabase?.auth);

      try {
        console.log('📞 Calling supabase.auth.getSession()...');

        // Add timeout to getSession
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('getSession timeout')), 3000)
        );

        const result = await Promise.race([sessionPromise, timeoutPromise]);
        const { data: { session }, error } = result as any;
        console.log('📞 getSession() completed');
        
        console.log('📡 Session result:', { session: !!session, error });

        if (!mounted) return;

        if (error) {
          console.error('❌ Session error:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('👤 User found, loading data...');
          await loadUserData(session.user);
        } else {
          console.log('🔒 No session, setting loading false');
          setLoading(false);
        }
      } catch (error) {
        console.error('💥 Auth init error:', error);
        if (mounted) setLoading(false);
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, !!session);
        
        if (!mounted) return;

        try {
          if (session?.user) {
            console.log('👤 Auth change: loading user data...');
            await loadUserData(session.user);
          } else {
            console.log('🔒 Auth change: no user, clearing state');
            setUser(null);
            setIsAdmin(false);
            setLoading(false);
          }
        } catch (error) {
          console.error('💥 Auth state change error:', error);
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
    console.log('📝 Loading user data for:', authUser.id);

    // Create user from auth metadata immediately (skip database query due to connection issues)
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

    console.log('✅ User created from auth metadata:', user);
    setUser(user);
    setLoading(false);
  };

  const signup = async (userData: SignupData) => {
    const { email, password, name, university, major, graduationYear } = userData;

    console.log('📝 Starting signup...');

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
      console.error('❌ Signup error:', error);
      throw error;
    }

    // Create user record in database (backup in case trigger doesn't work)
    if (data.user) {
      console.log('📝 Creating user record in database...');
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
          console.error('⚠️ Failed to create user record:', insertError);
        } else {
          console.log('✅ User record created');
        }
      } catch (err) {
        console.error('⚠️ Error creating user record:', err);
      }
    }

    console.log('✅ Signup successful');
  };

  const login = async (email: string, password: string) => {
    console.log('🔐 Starting login...');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
    
    console.log('✅ Login successful');
  };

  const logout = async () => {
    console.log('🚪 Logging out...');
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
    
    setUser(null);
    setIsAdmin(false);
    console.log('✅ Logged out');
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    console.log('📝 Updating profile...');
    
    const { error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', user.id);
    
    if (error) {
      console.error('❌ Profile update error:', error);
      throw error;
    }
    
    setUser(prev => prev ? { ...prev, ...userData } : null);
    console.log('✅ Profile updated');
  };

  console.log('🎯 AuthProvider render - loading:', loading, 'user:', !!user);

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