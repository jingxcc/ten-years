"use client";
import { UserProvider } from "../../../context/userContext";

export default function GetStartPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
