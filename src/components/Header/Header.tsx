"use client";
import { auth } from "@/lib/firebase/initialize";
import { UserData } from "@/types/UserData";
import { FirebaseError } from "firebase/app";
import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface HeaderProps {
  user?: UserData | null;
  showNav?: boolean;
}

export default function Header({ user, showNav = true }: HeaderProps) {
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
    <header className=" flex items-center justify-between border-b border-neutral-100 bg-white bg-opacity-95 px-3 md:px-6">
      <Link href={"/"}>
        <div className="flex items-center gap-1 py-1 pr-2">
          <Image src="/logo_blue.svg" width={48} height={48} alt="logo" />
          <h1 className="text-3xl font-semibold text-sky-250">Ten Years</h1>
        </div>
      </Link>

      {showNav && (
        <nav className=" font-semibold text-neutral-500 hover:text-sky-300">
          {user ? (
            <button
              className="block p-2"
              title="Log out"
              onClick={handleSignOut}
            >
              Log out
            </button>
          ) : (
            <Link href={"/login"} className=" block p-2">
              Log in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
