
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// This is a placeholder - in actual implementation you'd connect to Supabase
// and define proper types based on your database schema
type User = {
  id: string;
  email: string;
  name?: string;
  username?: string;
  profileComplete: boolean; // Used to determine if onboarding is complete
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock authentication functions until Supabase is integrated
  const signIn = async (email: string, password: string) => {
    // Placeholder - will connect to Supabase Auth
    console.log('Signing in with:', email, password);
    
    // Mock successful login with 1s delay
    setLoading(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser({
          id: '123',
          email,
          profileComplete: false
        });
        setLoading(false);
        resolve();
      }, 1000);
    });
  };

  const signUp = async (email: string, password: string) => {
    // Placeholder - will connect to Supabase Auth
    console.log('Signing up with:', email, password);
    
    // Mock successful registration with 1s delay
    setLoading(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser({
          id: '123',
          email,
          profileComplete: false
        });
        setLoading(false);
        resolve();
      }, 1000);
    });
  };

  const signOut = async () => {
    // Placeholder - will connect to Supabase Auth
    console.log('Signing out');
    
    // Mock successful logout
    setUser(null);
    return Promise.resolve();
  };

  useEffect(() => {
    // Check if user is already logged in (from Supabase session)
    // This would be done by checking Supabase Auth state
    
    // For now, we'll just set loading to false
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
