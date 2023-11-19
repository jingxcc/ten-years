import { UserProvider } from "./get-start/userContext";

export default function GetStartPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html lang="en">
    //   <body>
    <UserProvider>{children}</UserProvider>
    //   </body>
    // </html>
  );
}
