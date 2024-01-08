import { Inter } from "next/font/google";
import "@/styles/global.css";
import Header from "@/components/Header/Header";

const inter = Inter({ subsets: ["latin"] });

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-100dvh bg-sky-200">
      <Header showNav={false}></Header>
      {children}
    </div>
  );
}
