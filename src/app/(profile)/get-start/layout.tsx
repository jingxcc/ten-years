"use client";
import { UserProvider } from "./userContext";

export default function GetStartPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <UserProvider>{children}</UserProvider>
    </div>
  );
}
