import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/global.css";
import { UserProvider } from "../context/userContext";
import { ToasterProvider } from "@/app/providers/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

interface LayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Ten Years",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToasterProvider></ToasterProvider>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
