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

  // Force loading to false after 10 seconds max
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('🚨 FORCE STOPPING LOADING AFTER 10 SECONDS');
      setLoading(false);
    }, 10000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      console.log('🚀 Starting auth initialization...');
      
      try {
        // Add timeout to session fetch
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session timeout')), 5000)
        );

        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
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
    
    try {
      // Add timeout to user data fetch
      const userPromise = supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('User data timeout')), 5000)
      );

      const { data: userData, error } = await Promise.race([
        userPromise,
        timeoutPromise
      ]) as any;

      console.log('📊 User data result:', { userData: !!userData, error });

      if (error && error.code !== 'PGRST116') {
        console.error('❌ User data error:', error);
        throw error;
      }

      if (userData) {
        console.log('✅ Setting user data from database');
        setUser({
          id: authUser.id,
          name: userData.name || authUser.user_metadata?.name || '',
          email: authUser.email || '',
          university: userData.university,
          major: userData.major,
          graduation_year: userData.graduation_year,
          created_at: userData.created_at ? new Date(userData.created_at) : undefined,
          subscription_tier: userData.subscription_tier || 'free',
          total_problems_solved: userData.total_problems_solved || 0,
          current_streak: userData.current_streak || 0,
          best_streak: userData.best_streak || 0,
          total_study_time_minutes: userData.total_study_time_minutes || 0,
        });
      } else {
        console.log('⚠️ No user data found, creating fallback');
        setUser({
          id: authUser.id,
          name: authUser.user_metadata?.name || '',
          email: authUser.email || '',
          university: authUser.user_metadata?.university || '',
          major: authUser.user_metadata?.major || 'Mechanical Engineering',
          graduation_year: authUser.user_metadata?.graduation_year || '',
          subscription_tier: 'free',
          total_problems_solved: 0,
          current_streak: 0,
          best_streak: 0,
          total_study_time_minutes: 0,
        });
      }

    } catch (error) {
      console.error('💥 Load user data error:', error);
      // Always create fallback user on error
      setUser({
        id: authUser.id,
        name: authUser.user_metadata?.name || '',
        email: authUser.email || '',
        subscription_tier: 'free',
        total_problems_solved: 0,
        current_streak: 0,
        best_streak: 0,
        total_study_time_minutes: 0,
      });
    } finally {
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
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
          major: major || 'Mechanical Engineering',
          graduation_year: graduationYear || '',
        }
      }
    });
    
    if (error) {
      console.error('❌ Signup error:', error);
      throw error;
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