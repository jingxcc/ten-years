import { UserProvider } from "./userContext";

export default function GetStartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}
