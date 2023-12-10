"use client";
import fetchUserDoc from "@/lib/firebase/firestore/fetchUserDoc";
import { auth } from "@/lib/firebase/initialize";
import { UserData } from "@/types/UserData";
import { onAuthStateChanged } from "firebase/auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { usePathname, useRouter } from "next/navigation";
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

const redirectToPage = async (
  user: UserData | null,
  route: AppRouterInstance,
  pathname: string,
) => {
  // check login
  if (!user && pathname !== "/") {
    route.push("/");
    return false;
  }

  if (user && pathname === "/") {
    route.push("/chat");
    return true;
  }

  // check isProfileCompleted
  if (user) {
    const userDocResult = await fetchUserDoc(user);
    if (!userDocResult) return false;

    // if (userDocResult.data.isStartProfileCompleted)

    if (!userDocResult.data.isStartProfileCompleted) {
      route.push("/get-start");
    }
  }
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const route = useRouter();
  const pathname = usePathname();

  console.log("UserProvider");

  // firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (authUser) => {
        let userData: UserData | null = null;
        if (authUser) {
          userData = {
            email: authUser.email,
            uid: authUser.uid,
          };
        }
        redirectToPage(userData, route, pathname);

        setUser(userData);
        setIsUserLoading(false);
      },
      (error) => {
        console.error(`userContext Auth Error: ${error}`);
      },
    );

    // clean up
    return () => {
      unsubscribe();
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
