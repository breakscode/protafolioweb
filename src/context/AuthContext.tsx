import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isMockAuth: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_AUTH_KEY = 'portfolio_mock_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMockAuth, setIsMockAuth] = useState(!isSupabaseConfigured());

  useEffect(() => {
    if (isSupabaseConfigured()) {
      setIsMockAuth(false);
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      setIsMockAuth(true);
      const savedMock = localStorage.getItem(LOCAL_AUTH_KEY);
      if (savedMock) {
        try {
          const parsed = JSON.parse(savedMock);
          setUser(parsed.user);
          setSession(parsed.session);
        } catch {
          // ignore
        }
      }
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error as Error | null };
    }

    // Fallback demo authentication if Supabase is not connected
    if (password.length >= 6) {
      const mockUser = {
        id: 'mock-admin-user-01',
        email,
        app_metadata: {},
        user_metadata: { full_name: 'Jhampier Juárez (Demo Admin)' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;

      const mockSession = {
        access_token: 'mock-jwt-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        user: mockUser,
      } as unknown as Session;

      setUser(mockUser);
      setSession(mockSession);
      localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify({ user: mockUser, session: mockSession }));
      return { error: null };
    }

    return { error: new Error('La contraseña debe tener al menos 6 caracteres.') };
  };

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    localStorage.removeItem(LOCAL_AUTH_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isMockAuth, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
