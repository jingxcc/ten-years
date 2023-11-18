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
  // const route = useRouter();
  console.log("UserProvider");

  // firebase
  useEffect(() => {
    const monitorAuthState = async () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const userData: UserData = {
            email: user.email,
            uid: user.uid,
          };
          setUser(userData);
        } else {
          // user log out
          // route.push("/");
          setUser(null);
        }
        setIsUserLoading(false);
      });
    };

    // clean up
    return () => {
      monitorAuthState();
    };
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
