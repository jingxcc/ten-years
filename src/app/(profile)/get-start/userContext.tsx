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
    // console.log("UserProvider useEffect Loading", isUserLoading);
    // console.log("UserProvider useEffect user", user);

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
    return () => {
      unsubscribe();
    };
  }, []);

  // useEffect(() => {
  //   // 此函數將在用戶登入狀態改變時被調用
  //   const unsubscribe = onAuthStateChanged(
  //     auth,
  //     (user) => {
  //       if (user) {
  //         const userData: UserData = {
  //           email: user.email,
  //           uid: user.uid,
  //         };
  //         setUser(userData);
  //       } else {
  //         setUser(null);
  //       }
  //       setIsUserLoading(false);
  //     },
  //     (error) => {
  //       // 處理可能出現的錯誤
  //       alert(`Auth Error: ${error}`);
  //     },
  //   );

  //   // clean up
  //   return () => {
  //     unsubscribe(); // 正確取消訂閱
  //   };
  // }, []);

  return (
    <UserContext.Provider value={{ user, isUserLoading }}>
      {children}
    </UserContext.Provider>
  );
};

// custom hook
export const useUser = () => useContext(UserContext);

export default UserContext;
