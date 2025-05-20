
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, signInWithEmail, signUpWithEmail, signInWithOAuth, signOut } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getUserProfile } from '@/lib/supabase/queries';

export type UserProfile = {
  id: string;
  username?: string;
  full_name?: string;
  bio?: string;
  gender?: string;
  college?: string;
  avatar_url?: string;
  dob?: string;
  phone_verified?: boolean;
  profileComplete: boolean;
  user_sports?: Array<{
    sport: string;
    skill_level: number;
  }>;
  user_locations?: Array<{
    district: string;
    coordinates: any;
  }>;
  user_rankings?: Array<{
    sport: string;
    district: string;
    elo_rating: number;
    rank: number;
    wins: number;
    losses: number;
  }>;
};

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadProfile = async (userId: string) => {
    try {
      const profileData = await getUserProfile(userId);
      
      if (profileData) {
        setProfile({
          ...profileData,
          profileComplete: Boolean(profileData.username && profileData.full_name)
        });
      } else {
        // New user without profile
        setProfile({
          id: userId,
          profileComplete: false
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };
  
  const refreshProfile = async () => {
    if (user?.id) {
      await loadProfile(user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { session } = await signInWithEmail(email, password);
      if (session?.user) {
        setUser(session.user);
        await loadProfile(session.user.id);
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { session } = await signUpWithEmail(email, password);
      if (session?.user) {
        setUser(session.user);
        setProfile({
          id: session.user.id,
          profileComplete: false
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Please try again with a different email.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithOAuth('google');
    } catch (error: any) {
      toast({
        title: "Google sign in failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signInWithApple = async () => {
    try {
      await signInWithOAuth('apple');
    } catch (error: any) {
      toast({
        title: "Apple sign in failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setProfile(null);
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    const setInitialUser = async () => {
      try {
        const session = await supabase.auth.getSession();
        if (session?.data?.session?.user) {
          setUser(session.data.session.user);
          await loadProfile(session.data.session.user.id);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    setInitialUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await loadProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signInWithApple,
        signOut: handleSignOut,
        refreshProfile,
      }}
    >
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
