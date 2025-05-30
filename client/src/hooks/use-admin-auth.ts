
import { useState, useEffect } from 'react';

interface AdminAuth {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export function useAdminAuth(): AdminAuth {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin credentials are stored
    const storedAuth = localStorage.getItem('admin_auth');
    if (storedAuth) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const credentials = btoa(`${username}:${password}`);
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        localStorage.setItem('admin_auth', credentials);
        setIsAuthenticated(true);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    login,
    logout,
    isLoading,
  };
}

// Function to get admin auth header for API calls
export function getAdminAuthHeader(): { Authorization: string } | {} {
  const storedAuth = localStorage.getItem('admin_auth');
  if (storedAuth) {
    return { Authorization: `Basic ${storedAuth}` };
  }
  return {};
}
