"use client";
import { auth } from "@/lib/firebase/initialize";
import { UserData } from "@/types/UserData";
import { onAuthStateChanged } from "firebase/auth";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserContextType {
  user: UserData | null;
  isUserLoading: boolean;
}

interface UserProviderProps {
  children?: ReactNode;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isUserLoading: true,
});

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  console.log("UserProvider");

  // firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          const userData: UserData = {
            email: user.email,
            uid: user.uid,
          };
          setUser(userData);
        } else {
          setUser(null);
        }
        setIsUserLoading(false);
      },
      (error) => {
        alert(`Auth Error: ${error}`);
      },
    );

    // clean up
    // return () => {
    //   unsubscribe();
    // };
  }, []);

  return (
    <UserContext.Provider value={{ user, isUserLoading }}>
      {children}
    </UserContext.Provider>
  );
};

// custom hook
export const useUser = () => useContext(UserContext);

export default UserContext;
