import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/global.css";
import { UserProvider } from "@/context/userContext";
import Header from "@/components/Header/Header";

const inter = Inter({ subsets: ["latin"] });

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <div className="h-full bg-sky-200">{children}</div>;
}
