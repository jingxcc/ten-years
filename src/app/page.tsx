"use client";
import Header from "@/components/Header/Header";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className={`grid min-h-100dvh grid-rows-[60px_1fr] bg-sky-200`}>
      <Header></Header>

      <main className="container mx-auto my-auto items-center justify-center px-3 pb-[20%] pt-4 xs:pb-[10%] md:flex md:px-6">
        <div className="flex flex-col items-center md:mr-12 md:block">
          <h2 className="mb-3 text-3xl  font-bold leading-tight text-white md:mb-6 md:text-6xl">
            Find Your Match
          </h2>
          <p className="mb-4 text-xl font-semibold leading-tight text-white md:mb-8">
            {"Expolore & build your own story"}
          </p>
          {/* mobile image */}
          <Image
            src={"match.svg"}
            width={360}
            height={360}
            alt="match"
            priority
            className="animate-bounce-once md:hidden"
          ></Image>
          <div className="flex flex-col items-center gap-y-4 xs:items-start">
            <Link href="/login">
              <button className="btn-secondary px-12 py-3 text-lg md:text-base">
                {"Welcome Back"}
              </button>
            </Link>
            <Link href="/signup">
              <button className="btn block px-12 py-3 text-lg xs:hidden md:text-base">
                {"Start Journey !"}
              </button>
            </Link>
          </div>
        </div>
        {/* non-mobile image */}
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
