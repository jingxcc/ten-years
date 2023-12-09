"use client";
import Header from "@/components/Header/Header";
import { useUser } from "@/context/userContext";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const { user, isUserLoading } = useUser();

  return (
    <div className="grid min-h-screen grid-rows-[60px_1fr] bg-sky-200">
      <Header></Header>
      <main className="container mx-auto flex items-center justify-center">
        <Link href="/signup">
          <button className="btn-secondary  px-12 py-3">建立帳號</button>
        </Link>
      </main>
    </div>
  );
}
