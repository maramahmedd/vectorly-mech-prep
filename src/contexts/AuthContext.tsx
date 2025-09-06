// src/contexts/AuthContext.tsx - Replace the entire file with this
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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserData(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserData(session.user);
        } else {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (authUser: SupabaseUser) => {
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        throw error;
      }

      if (userData) {
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
        // Create user profile if it doesn't exist
        const newUser = {
          id: authUser.id,
          name: authUser.user_metadata?.name || '',
          email: authUser.email || '',
          subscription_tier: 'free' as const,
          total_problems_solved: 0,
          current_streak: 0,
          best_streak: 0,
          total_study_time_minutes: 0,
        };

        const { error: insertError } = await supabase
          .from('users')
          .insert(newUser);

        if (insertError) throw insertError;

        setUser(newUser);
      }

      // Update last login
      await supabase
        .from('users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', authUser.id);

    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback user object
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
      setLoading(false);
    }
  };

  const signup = async (userData: SignupData) => {
    const { email, password, name, university, major, graduationYear } = userData;
    
    // Create Supabase Auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        }
      }
    });
    
    if (error) throw error;

    // The auth state change listener will handle creating the user profile
    if (data.user) {
      // Create user profile in our users table
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        name,
        email,
        university: university || '',
        major: major || 'Mechanical Engineering',
        graduation_year: graduationYear || '',
        subscription_tier: 'free',
        total_problems_solved: 0,
        current_streak: 0,
        best_streak: 0,
        total_study_time_minutes: 0,
      });

      if (profileError) throw profileError;
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    // User state will be updated by the onAuthStateChanged listener
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setIsAdmin(false);
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    // Update Supabase
    const { error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', user.id);
    
    if (error) throw error;
    
    // Update local state
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