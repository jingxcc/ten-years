"use client";

import { useRouter } from "next/navigation";
import { useUser } from "../../../context/userContext";

import ProfileForm from "./ProfileForm";
import Sidebar from "@/components/SideBar/SideBar";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/initialize";
import toast from "react-hot-toast";
import { FirebaseError } from "firebase/app";

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
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

  if (!user || isUserLoading) {
    return (
      <div className="h-100dvh  w-screen text-center text-2xl font-bold text-sky-300 ">
        <h3 className="block py-[20%]"> Loading ...</h3>
      </div>
    );
  }

  return (
    <div className="relative">
      <Sidebar user={user}></Sidebar>
      <main className="flex h-full pb-20 xs:ml-20 xs:pb-0">
        <ProfileForm user={user}>
          <div className="mt-2 block text-center xs:hidden">
            <button
              type="submit"
              onClick={handleLogOut}
              className="btn-secondary w-[50%]"
            >
              Log Out
            </button>
          </div>
        </ProfileForm>
      </main>
    </div>
  );
}
