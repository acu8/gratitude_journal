import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "../domain/user";

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("isAuthenticated") === "true";
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);
    } else {
      sessionStorage.removeItem("user");
      sessionStorage.setItem("isAuthenticated", "false");
      setIsAuthenticated(false);
    }
  }, [user, isAuthenticated]);

  const login = (newUser: User) => {
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const value = {
    user,
    setUser,
    isAuthenticated,
    login,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
