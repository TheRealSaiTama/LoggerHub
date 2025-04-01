import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  name: string;
  color: string;
};

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const COLORS = [
  "#7C3AED",
  "#4F46E5",
  "#0D9488",
  "#0891B2",
  "#059669",
  "#D946EF",
  "#EC4899",
  "#F59E0B",
  "#DC2626",
];

const generateId = () => Math.random().toString(36).substring(2, 10);

const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)];

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("activityHub_user");
    if (storedUser) {
      try {
        setUserState(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
    setIsLoading(false);
  }, []);

  const setUser = (userData: User) => {
    const userWithDefaults = {
      ...userData,
      id: userData.id || generateId(),
      color: userData.color || getRandomColor(),
    };
    setUserState(userWithDefaults);
    localStorage.setItem("activityHub_user", JSON.stringify(userWithDefaults));
  };

  const clearUser = () => {
    setUserState(null);
    localStorage.removeItem("activityHub_user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
