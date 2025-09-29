import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Types for our context
type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
});

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to load and set session
  useEffect(() => {
    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Set up a listener for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Render provider
  return (
    <AuthContext.Provider value={{ session, user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);