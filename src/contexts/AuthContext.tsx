// src/contexts/AuthContext.tsx (Enhanced with Admin)
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface User {
  id: string;
  name: string;
  email: string;
  university?: string;
  major?: string;
  graduationYear?: string;
  createdAt?: Date;
  isAdmin?: boolean;
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await loadUserData(firebaseUser);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserData = async (firebaseUser: FirebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      // Check admin status
      const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
      const userIsAdmin = adminDoc.exists();
      setIsAdmin(userIsAdmin);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          id: firebaseUser.uid,
          name: userData.name || firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          university: userData.university,
          major: userData.major,
          graduationYear: userData.graduationYear,
          createdAt: userData.createdAt?.toDate(),
          isAdmin: userIsAdmin,
        });

        // Update last login time
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          lastLoginAt: new Date()
        });
      } else {
        // If no Firestore doc exists, create one with basic info
        const basicUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          email: firebaseUser.email || '',
          isAdmin: userIsAdmin,
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          ...basicUser,
          createdAt: new Date(),
          lastLoginAt: new Date(),
          isActive: true,
          problemsSolved: 0,
          totalTimeSpent: 0,
        });
        
        setUser(basicUser);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUser({
        id: firebaseUser.uid,
        name: firebaseUser.displayName || '',
        email: firebaseUser.email || '',
        isAdmin: false,
      });
    }
  };

  const signup = async (userData: SignupData) => {
    const { email, password, name, university, major, graduationYear } = userData;
    
    // Create Firebase Auth user
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's display name
    await updateProfile(firebaseUser, { displayName: name });
    
    // Save additional user data to Firestore
    const userDocData = {
      name,
      email,
      university: university || '',
      major: major || 'Mechanical Engineering',
      graduationYear: graduationYear || '',
      createdAt: new Date(),
      lastLoginAt: new Date(),
      isActive: true,
      problemsSolved: 0,
      totalTimeSpent: 0,
    };
    
    await setDoc(doc(db, 'users', firebaseUser.uid), userDocData);
    
    // Set the user state
    setUser({
      id: firebaseUser.uid,
      ...userDocData,
      isAdmin: false,
    });
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
    // User state will be updated by the onAuthStateChanged listener
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    // Update Firestore
    await setDoc(doc(db, 'users', user.id), userData, { merge: true });
    
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