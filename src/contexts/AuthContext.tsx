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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
        // Try to get user from localStorage if no active session
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
      
      return fallbackLogin(email, password);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
  };

  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    try {
      if (password.length < 6) {
        toast.error("Password should be at least 6 characters.");
        return false;
      }
      
      // Only check local users if Supabase is not accessible
      const { data: { session: testSession } } = await supabase.auth.getSession();
      
      // If we can't connect to Supabase, fall back to local registration
      if (!testSession) {
        return fallbackRegister(email, password, name);
      }
      
      // Otherwise, proceed with Supabase registration
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      
      if (error) {
        console.error("Supabase registration error:", error);
        
        // Check if error is specifically about existing user
        if (error.message.includes("already registered")) {
          toast.error("This email is already registered");
          return false;
        }
        
        // If it's a different error, try the fallback
        return fallbackRegister(email, password, name);
      }
      
      toast.success("Registration successful! Check your email for verification.");
      
      // Store user data in local storage for fallback
      const users = getLocalUsers();
      users[email] = { password, name };
      saveLocalUsers(users);
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      
      return fallbackRegister(email, password, name);
    }
  };

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
    try {
      const users = getLocalUsers();
      
      // Check if the email already exists in local storage
      if (users[email]) {
        toast.error("This email is already registered");
        return false;
      }
      
      // If the email doesn't exist, register the user
      users[email] = { password, name };
      saveLocalUsers(users);
      
      // Log the user in automatically
      const currentUser = { 
        email,
        name: users[email].name
      };
      
      setUser(currentUser);
      setIsAuthenticated(true);
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      
      toast.success("Registration successful!");
      return true;
    } catch (error) {
      console.error("Fallback registration error:", error);
      toast.error("Registration failed");
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
