"use client";
import Header from "@/components/Header/Header";
import { useUser } from "@/context/userContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, isUserLoading } = useUser();
  const route = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      route.push("/chat");
    }
  }, [isUserLoading, user, route]);

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
