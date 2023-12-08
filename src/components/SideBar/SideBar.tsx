import fetchUserDoc from "@/lib/firebase/firestore/fetchUserDoc";
import { auth } from "@/lib/firebase/initialize";
import { FirebaseError } from "firebase/app";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface SideBarProps {
  children?: ReactNode;
  // onSignOut: () => void;
}

const Sidebar: React.FC<SideBarProps> = ({ children }) => {
  const route = useRouter();

  const handleSignOut = async () => {
    console.log("sign out");
    try {
      await signOut(auth);
      alert("Logout success");
      route.push("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // const errorMessage = getAuthErrorMsg(error);
        alert(`Logout Error: ${error.message}`);
      } else {
        alert(`Logout Error: ${error}`);
      }
    }
  };
  return (
    <div className="fixed h-full w-32 border-r border-neutral-200 bg-sky-200 p-4">
      <div className="py-4">
        {/* <h1 className="text-xl font-bold">Ten Years</h1> */}
      </div>
      <button className="btn mb-4" onClick={handleSignOut}>
        Log out
      </button>

      <button className="btn mb-4" onClick={() => route.push("/potentials")}>
        Matches
      </button>
      <button className="btn mb-4" onClick={() => route.push("/likes")}>
        Likes
      </button>
      <button className="btn mb-4" onClick={() => route.push("/chat")}>
        Chat
      </button>
      <button className="btn mb-4" onClick={() => route.push("/profile")}>
        Profile
      </button>
      {children}
    </div>
  );
};

export default Sidebar;
