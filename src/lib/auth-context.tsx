import { createContext, useMemo, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { getFireBaseAuth, getGoogleProvider } from './firebase';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvier = ({ children }: { children: React.ReactNode }) => {
  const auth = getFireBaseAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return unsub;
  }, [auth]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      loginWithGoogle: async () => {
        await signInWithPopup(auth, getGoogleProvider());
      },
      logout: async () => {
        await signOut(auth);
      },
    }),
    [auth, isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
