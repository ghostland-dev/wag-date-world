import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { User, UserRole } from '@/types/user';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedUser, setStoredUser] = useLocalStorage<User | null>('petmatch_user', null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking auth state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = (user: User) => {
    const userWithDefaults = {
      ...user,
      createdAt: new Date(),
      role: user.role || 'adopter' as UserRole,
      isVerified: user.isVerified || false,
    };
    setStoredUser(userWithDefaults);
  };

  const logout = () => {
    setStoredUser(null);
    localStorage.removeItem('petmatch_matches');
    localStorage.removeItem('petmatch_analytics');
  };

  const updateUser = (updates: Partial<User>) => {
    if (storedUser) {
      setStoredUser({ ...storedUser, ...updates });
    }
  };

  const value: UserContextType = {
    user: storedUser,
    isAuthenticated: !!storedUser,
    login,
    logout,
    updateUser,
    isLoading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};