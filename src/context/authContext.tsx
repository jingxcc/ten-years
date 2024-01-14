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

interface AuthContextType {
  user: UserData | null;
  isAuthLoading: boolean;
}

interface AuthProviderProps {
  children?: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthLoading: true,
});

const redirectToPage = async (
  user: UserData | null,
  route: AppRouterInstance,
  pathname: string,
) => {
  // check login
  if (!user && pathname !== "/" && !["/login", "/signup"].includes(pathname)) {
    route.push("/");
    return false;
  }

  if (user && pathname === "/") {
    route.push("/potentials");
    return true;
  }

  // check isProfileCompleted
  if (user) {
    const userDocResult = await fetchUserDoc(user);
    if (!userDocResult) return false;

    if (!userDocResult.data.isStartProfileCompleted) {
      route.push("/get-start");
    }
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isAuthLoading, setisAuthLoading] = useState(true);
  const route = useRouter();
  const pathname = usePathname();

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
        setisAuthLoading(false);
      },
      (error) => {
        console.error(`AuthContext Auth Error: ${error}`);
      },
    );

    // clean up
    return () => {
      unsubscribe();
    };
  }, [pathname, route]);

  return (
    <AuthContext.Provider value={{ user, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
