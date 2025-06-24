import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock API functions (replace with actual API calls)
const api = {
  login: async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock users for demo
    const mockUsers = [
      { id: '1', username: 'admin', email: 'admin@blog.com', password: 'admin123', role: 'admin', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' },
      { id: '2', username: 'johndoe', email: 'john@example.com', password: 'password123', role: 'user', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100' }
    ];
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword, token: 'mock-jwt-token' };
    }
    return { success: false, message: 'Invalid credentials' };
  },
  
  register: async (username, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful registration
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      role: 'user',
      avatar: 'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=100'
    };
    
    return { success: true, user: newUser, token: 'mock-jwt-token' };
  },
  
  verifyToken: async (token) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (token === 'mock-jwt-token') {
      return {
        success: true,
        user: { id: '1', username: 'admin', email: 'admin@blog.com', role: 'admin', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' }
      };
    }
    return { success: false };
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const result = await api.verifyToken(token);
        if (result.success) {
          setUser(result.user);
        } else {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const result = await api.login(email, password);
      if (result.success) {
        setUser(result.user);
        localStorage.setItem('token', result.token);
        toast.success('Login successful!');
        return true;
      } else {
        toast.error(result.message || 'Login failed');
        return false;
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      const result = await api.register(username, email, password);
      if (result.success) {
        setUser(result.user);
        localStorage.setItem('token', result.token);
        toast.success('Registration successful!');
        return true;
      } else {
        toast.error(result.message || 'Registration failed');
        return false;
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};