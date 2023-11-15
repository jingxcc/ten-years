import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[60px_1fr] bg-sky-200">
      <header className="flex items-center px-4">
        <Image src="/logo.svg" width={60} height={60} alt="logo" />
        <h1 className="text-3xl font-semibold text-white">Ten Years</h1>
      </header>
      <main className="container mx-auto flex items-center justify-center">
        <Link href="/login">
          <button className="btn-secondary  px-12 py-3">建立帳號</button>
        </Link>
      </main>
    </div>
  );
}
