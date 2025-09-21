"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "seller" | "admin";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage or session)
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Mock authentication - in real app, this would call your API
      if (email === "admin@example.com" && password === "admin123") {
        const user: User = {
          id: "1",
          email: "admin@example.com",
          name: "Admin User",
          role: "admin",
        };
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        setIsLoading(false);
        return true;
      } else if (email === "seller@example.com" && password === "seller123") {
        const user: User = {
          id: "2",
          email: "seller@example.com",
          name: "Seller User",
          role: "seller",
        };
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        setIsLoading(false);
        return true;
      } else if (email === "customer@example.com" && password === "customer123") {
        const user: User = {
          id: "3",
          email: "customer@example.com",
          name: "Customer User",
          role: "customer",
        };
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
