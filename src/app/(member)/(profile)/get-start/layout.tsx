import { UserProvider } from "./userContext";

export default function getStartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}
