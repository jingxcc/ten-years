import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/global.css";
import { UserProvider } from "./(profile)/get-start/userContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ten Years",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
