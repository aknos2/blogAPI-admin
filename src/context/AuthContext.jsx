// src/context/AuthContext.jsx
import { createContext, useEffect, useState } from 'react';
import { fetchUserStats } from '../../api/user';


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        setIsAuthenticated(true);
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);

          // Fetch fresh data
          try {
            const userResponse = await fetchUserStats();
            setUser(userResponse.data);
          } catch {
            // If API fails, keep cached data
            setUser(parsedUser);
          }
        } catch {
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      console.error('Auth load error:', err);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();

    // React to login/logout events
    const handleAuthStateChange = () => loadUserData();
    const handleStorageChange = (e) => {
      if (e.key === 'accessToken' || e.key === 'user') {
        loadUserData();
      }
    };

    window.addEventListener('authStateChange', handleAuthStateChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('authStateChange', handleAuthStateChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        authLoading,
        setIsAuthenticated,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
