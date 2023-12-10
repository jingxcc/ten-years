import { UserData } from "@/types/UserData";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
  user?: UserData | null;
  showNav?: boolean;
}

export default function Header({ user, showNav = true }: HeaderProps) {
  return (
    <header className=" flex items-center justify-between border-b border-neutral-100 bg-white bg-opacity-95 px-6">
      <Link href={"/"}>
        <div className="flex items-center gap-1 py-1 pr-2">
          <Image src="/logo_blue.svg" width={48} height={48} alt="logo" />
          <h1 className="text-3xl font-semibold text-sky-300">Ten Years</h1>
        </div>
      </Link>

      {showNav && (
        <nav className=" font-semibold text-neutral-500 hover:text-sky-300">
          {user ? (
            <Link href={"/"} className=" block p-2">
              Log out
            </Link>
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
