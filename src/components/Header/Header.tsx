"use client";
import { auth } from "@/lib/firebase/initialize";
import { UserData } from "@/types/UserData";
import { FirebaseError } from "firebase/app";
import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaGithub } from "react-icons/fa6";

interface HeaderProps {
  user?: UserData | null;
  showNav?: boolean;
}

export default function Header({ user, showNav = true }: HeaderProps) {
  const route = useRouter();
  // todo: extract/custom hook
  const handleLogOut = async () => {
    try {
      await signOut(auth);
      toast.success("Logout success", { position: "top-center" });
      route.push("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
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
          <Image src="/logoBlue.svg" width={48} height={48} alt="logo" />
          <h1 className="text-3xl font-semibold text-sky-250">Ten Years</h1>
        </div>
      </Link>

      {showNav && (
        <nav className="flex gap-x-2 font-semibold text-neutral-500 ">
          {user ? (
            <button
              className="block p-1"
              title="Log out"
              onClick={handleLogOut}
            >
              Log out
            </button>
          ) : (
            <>
              <Link
                href={"/login"}
                className="hidden p-1 hover:text-sky-300 xs:block "
              >
                Login
              </Link>
              <Link
                href={"/signup"}
                className=" hidden p-1 hover:text-sky-300 xs:block"
              >
                Sign up
              </Link>
              <a
                href={"https://github.com/jingxcc/ten-years"}
                className="hover:cursor h-9 w-9 overflow-hidden p-1 "
                target="_blank"
              >
                <div className="h-full w-full object-cover text-[28px] hover:text-sky-300">
                  <FaGithub></FaGithub>
                </div>
              </a>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
