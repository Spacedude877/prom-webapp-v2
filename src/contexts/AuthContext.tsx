
import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  email: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database using localStorage
const getUsers = (): Record<string, { password: string; name?: string }> => {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : {};
};

const saveUsers = (users: Record<string, { password: string; name?: string }>) => {
  localStorage.setItem("users", JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getUsers();
    
    if (users[email] && users[email].password === password) {
      const currentUser = { 
        email,
        name: users[email].name
      };
      
      setUser(currentUser);
      setIsAuthenticated(true);
      
      // Save to localStorage for persistent session
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
  };

  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getUsers();
    
    // Check if user already exists
    if (users[email]) {
      return false;
    }
    
    // Add new user
    users[email] = { password, name };
    saveUsers(users);
    
    // Auto login after registration
    return login(email, password);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
