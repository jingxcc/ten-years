import fetchUserDoc from "@/lib/firebase/firestore/fetchUserDoc";
import { auth } from "@/lib/firebase/initialize";
import {
  ArrowLeftOnRectangleIcon,
  ChatBubbleLeftEllipsisIcon,
  EnvelopeIcon,
  StarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  ChatBubbleLeftEllipsisIcon as SolidChatBubbleLeftEllipsisIcon,
  EnvelopeIcon as SolidEnvelopeIcon,
  StarIcon as SolidStarIcon,
  UserCircleIcon as SolidUserCircleIcon,
} from "@heroicons/react/24/solid";
import { FirebaseError } from "firebase/app";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Tooltip from "../Tooltip/Tooltip";
import { UserData } from "@/types/UserData";
import { FaGithub } from "react-icons/fa6";

interface SideBarProps {
  user: UserData;
  children?: ReactNode;
}

const Sidebar: React.FC<SideBarProps> = ({ user, children }) => {
  const route = useRouter();
  const pathname = usePathname();
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    // todo: extract/context
    const fetchUserDocData = async () => {
      const fetchUserDocResult = await fetchUserDoc(user);

      if (!fetchUserDocResult) return false;
      const fetchUpdateFormData = fetchUserDocResult.data;

      setAvatarUrl(
        fetchUpdateFormData["imageUrls"] &&
          fetchUpdateFormData["imageUrls"].length !== 0
          ? fetchUpdateFormData["imageUrls"][0]
          : "/defaultAvatar.jpg",
      );
    };
    fetchUserDocData();
  }, [user]);

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
    <>
      {/* non-mobile */}
      <div className="fixed z-50 hidden h-100dvh w-[80px] flex-col items-center border-r  border-neutral-200 bg-sky-200 px-2 py-4 xs:flex">
        <Image
          src={"logo.svg"}
          width={48}
          height={48}
          alt="logo"
          className=""
        ></Image>
        <div className="flex flex-grow flex-col items-center justify-between">
          <div>
            <Tooltip text="Chat">
              <button className="btn-icon" onClick={() => route.push("/chat")}>
                {pathname === "/chat" ? (
                  <SolidChatBubbleLeftEllipsisIcon className="h-8 w-8"></SolidChatBubbleLeftEllipsisIcon>
                ) : (
                  <ChatBubbleLeftEllipsisIcon className="h-8 w-8"></ChatBubbleLeftEllipsisIcon>
                )}
              </button>
            </Tooltip>
            <Tooltip text="Suggestions">
              <button
                className="btn-icon"
                onClick={() => route.push("/potentials")}
              >
                {pathname === "/potentials" ? (
                  <SolidStarIcon className="h-8 w-8"></SolidStarIcon>
                ) : (
                  <StarIcon className="h-8 w-8"></StarIcon>
                )}
              </button>
            </Tooltip>
            <Tooltip text="Like You">
              <button className="btn-icon" onClick={() => route.push("/likes")}>
                {pathname === "/likes" ? (
                  <SolidEnvelopeIcon className="h-8 w-8"></SolidEnvelopeIcon>
                ) : (
                  <EnvelopeIcon className="h-8 w-8"></EnvelopeIcon>
                )}
              </button>
            </Tooltip>
          </div>
          <div className="flex flex-col items-center justify-between">
            <Tooltip text="Profile">
              <button
                className="rounded hover:bg-sky-300 focus:bg-sky-300 enabled:hover:bg-sky-300"
                onClick={() => route.push("/profile")}
              >
                <div className="hover:cursor m-2 h-8 w-8 overflow-hidden rounded-full">
                  {avatarUrl && (
                    <Image
                      src={avatarUrl}
                      alt={`avatar`}
                      width={80}
                      height={80}
                      className=" h-full w-full border-sky-300  bg-sky-100 object-cover text-sky-300 hover:bg-sky-300"
                    />
                  )}
                </div>
              </button>
            </Tooltip>

            <Tooltip text="Log out">
              <button className="btn-icon" onClick={handleLogOut}>
                <ArrowLeftOnRectangleIcon className="h-8 w-8"></ArrowLeftOnRectangleIcon>
              </button>
            </Tooltip>

            <Tooltip text="GitHub">
              <a
                href={"https://github.com/jingxcc/ten-years"}
                className="btn-icon"
                target="_blank"
              >
                <div className="text-[32px]">
                  <FaGithub></FaGithub>
                </div>
              </a>
            </Tooltip>
          </div>
        </div>
        {children}
      </div>
      {/* mobile */}
      <div className="fixed bottom-0 z-50 flex h-16 w-screen items-center border-t  border-neutral-200 bg-sky-200 p-2 xs:hidden">
        <div className="flex flex-grow items-center">
          <div className="flex flex-grow items-center justify-center gap-x-8">
            <button className="btn-icon" onClick={() => route.push("/chat")}>
              {pathname === "/chat" ? (
                <SolidChatBubbleLeftEllipsisIcon className="h-8 w-8"></SolidChatBubbleLeftEllipsisIcon>
              ) : (
                <ChatBubbleLeftEllipsisIcon className="h-8 w-8"></ChatBubbleLeftEllipsisIcon>
              )}
            </button>

            <button
              className="btn-icon"
              onClick={() => route.push("/potentials")}
            >
              {pathname === "/potentials" ? (
                <SolidStarIcon className="h-8 w-8"></SolidStarIcon>
              ) : (
                <StarIcon className="h-8 w-8"></StarIcon>
              )}
            </button>

            <button className="btn-icon" onClick={() => route.push("/likes")}>
              {pathname === "/likes" ? (
                <SolidEnvelopeIcon className="h-8 w-8"></SolidEnvelopeIcon>
              ) : (
                <EnvelopeIcon className="h-8 w-8"></EnvelopeIcon>
              )}
            </button>

            <button
              className="hover:cursor h-8 w-8 overflow-hidden rounded-full bg-gray-50 "
              onClick={() => route.push("/profile")}
            >
              {avatarUrl && (
                <Image
                  src={avatarUrl}
                  alt={`avatar`}
                  width={80}
                  height={80}
                  className=" h-full w-full border-sky-300  bg-sky-100 object-cover text-sky-300"
                />
              )}
            </button>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Sidebar;
