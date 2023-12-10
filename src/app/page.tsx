"use client";
import Header from "@/components/Header/Header";
import { useUser } from "@/context/userContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const { user, isUserLoading } = useUser();

  return (
    <div className={`grid min-h-screen grid-rows-[60px_1fr] bg-sky-200`}>
      <Header></Header>
      <main className="container mx-auto flex items-center justify-center">
        <div className="  mr-12">
          <h2 className="mb-6 text-6xl font-bold leading-tight text-white">
            Find Your Match
          </h2>
          <p className="mb-8 text-xl font-semibold leading-tight text-white">
            {"Expolore & build your own story"}
          </p>
          <Link href="/signup">
            <button className="btn-secondary  px-12 py-3 ">
              {"Start Journey"}
            </button>
          </Link>
        </div>
        <Image
          src={"match.svg"}
          width={360}
          height={360}
          alt="match"
          className="animate-bounce-once"
        ></Image>
      </main>
    </div>
  );
}
