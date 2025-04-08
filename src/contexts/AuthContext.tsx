
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

type AuthUser = {
  email: string;
  name?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state and set up listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session);
        setSession(session);
        
        if (session && session.user) {
          const authUser: AuthUser = {
            email: session.user.email || "",
            name: session.user.user_metadata.name as string || "",
          };
          
          setUser(authUser);
          setIsAuthenticated(true);
          
          // Store in localStorage for compatibility with existing code
          localStorage.setItem("currentUser", JSON.stringify(authUser));
        } else {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("currentUser");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) {
        const authUser: AuthUser = {
          email: session.user.email || "",
          name: session.user.user_metadata.name as string || "",
        };
        
        setUser(authUser);
        setIsAuthenticated(true);
        localStorage.setItem("currentUser", JSON.stringify(authUser));
      } else {
        // Fallback to localStorage for existing users
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
          } catch (e) {
            console.error("Error parsing stored user:", e);
            localStorage.removeItem("currentUser");
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Supabase login error:", error);
        
        // Fallback to localStorage login for existing users
        const users = getLocalUsers();
        
        if (users[email] && users[email].password === password) {
          const currentUser = { 
            email,
            name: users[email].name
          };
          
          setUser(currentUser);
          setIsAuthenticated(true);
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
          
          return true;
        }
        
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      
      // Fallback to localStorage
      return fallbackLogin(email, password);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    // Clear local state regardless
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
  };

  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      
      if (error) {
        console.error("Supabase registration error:", error);
        
        // Fallback to localStorage registration
        return fallbackRegister(email, password, name);
      }
      
      toast.success("Registration successful! Check your email for verification.");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      
      // Fallback to localStorage
      return fallbackRegister(email, password, name);
    }
  };

  // Helper functions for localStorage fallback
  const getLocalUsers = (): Record<string, { password: string; name?: string }> => {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : {};
  };

  const saveLocalUsers = (users: Record<string, { password: string; name?: string }>) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  const fallbackLogin = (email: string, password: string): boolean => {
    const users = getLocalUsers();
    
    if (users[email] && users[email].password === password) {
      const currentUser = { 
        email,
        name: users[email].name
      };
      
      setUser(currentUser);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      
      return true;
    }
    
    return false;
  };

  const fallbackRegister = (email: string, password: string, name?: string): boolean => {
    const users = getLocalUsers();
    
    // Check if user already exists
    if (users[email]) {
      return false;
    }
    
    // Add new user
    users[email] = { password, name };
    saveLocalUsers(users);
    
    // Auto login after registration
    return fallbackLogin(email, password);
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
