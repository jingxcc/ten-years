import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center bg-sky-200 px-4">
      <Image src="/logo.svg" width={60} height={60} alt="logo" />
      <h1 className="text-3xl font-semibold text-white">Ten Years</h1>
    </header>
  );
}
