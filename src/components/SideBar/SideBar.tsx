import fetchUserDoc from "@/lib/firebase/firestore/fetchUserDoc";
import { auth } from "@/lib/firebase/initialize";
import {
  ArrowLeftOnRectangleIcon,
  ChatBubbleLeftEllipsisIcon,
  EnvelopeIcon,
  HeartIcon,
  StarIcon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { FirebaseError } from "firebase/app";
import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import toast from "react-hot-toast";

interface SideBarProps {
  children?: ReactNode;
  // onSignOut: () => void;
}

const Sidebar: React.FC<SideBarProps> = ({ children }) => {
  const route = useRouter();
  // lib
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Logout success", { position: "top-center" });
      route.push("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // const errorMessage = getAuthErrorMsg(error);
        toast.error(`Logout Error: ${error.message}`, {
          position: "top-center",
        });
      } else {
        toast.error(`Logout Error: ${error}`, { position: "top-center" });
      }
    }
  };
  return (
    <div className="w-18 fixed flex h-full flex-col items-center  border-r border-neutral-200 bg-sky-200 p-4">
      <Link href={"/"} className="mb-6">
        <Image src={"logo.svg"} width={48} height={48} alt="logo"></Image>
      </Link>
      <div className="flex flex-1 flex-col items-center justify-between">
        <div>
          <button
            className="btn-icon"
            title="Chat"
            onClick={() => route.push("/chat")}
          >
            <ChatBubbleLeftEllipsisIcon className="h-8 w-8"></ChatBubbleLeftEllipsisIcon>
          </button>
          <button
            className="btn-icon"
            title="Suggestions"
            onClick={() => route.push("/potentials")}
          >
            <StarIcon className="h-8 w-8"></StarIcon>
          </button>
          <button className="btn-icon" onClick={() => route.push("/likes")}>
            <EnvelopeIcon className="h-8 w-8" title="Likes You"></EnvelopeIcon>
          </button>
        </div>
        <div>
          <button
            className="btn-icon"
            title="Profile"
            onClick={() => route.push("/profile")}
          >
            <UserCircleIcon className="h-8 w-8"></UserCircleIcon>
          </button>
          <button className="btn-icon" title="Log out" onClick={handleSignOut}>
            <ArrowLeftOnRectangleIcon className="h-8 w-8"></ArrowLeftOnRectangleIcon>
          </button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Sidebar;
