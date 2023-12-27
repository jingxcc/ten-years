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
      <main className="container mx-auto my-auto items-center justify-center px-3 md:flex md:px-6">
        <div className="flex flex-col items-center md:mr-12 md:block">
          <h2 className="mb-3 text-4xl font-bold leading-tight text-white md:mb-6 md:text-6xl">
            Find Your Match
          </h2>
          <p className="mb-4 text-xl font-semibold leading-tight text-white md:mb-8">
            {"Expolore & build your own story"}
          </p>
          <Image
            src={"match.svg"}
            width={360}
            height={360}
            alt="match"
            priority
            className="animate-bounce-once md:hidden"
          ></Image>
          <Link href="/signup">
            <button className="btn-secondary px-12 py-3 text-lg md:text-base">
              {"Start Journey"}
            </button>
          </Link>
        </div>
        <Image
          src={"match.svg"}
          width={360}
          height={360}
          alt="match"
          priority
          className="hidden animate-bounce-once md:block"
        ></Image>
      </main>
    </div>
  );
}
