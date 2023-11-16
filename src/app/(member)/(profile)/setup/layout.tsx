import { UserProvider } from "./userContext";

export default function profileSetUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}
