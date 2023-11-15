"use client";
import Link from "next/link";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  const handleLogin = (email: string, password: string) => {
    console.log("handleLogin: ", email, password);
  };

  return (
    <>
      <p>Login page</p>
      <div className="md: mx-3 ">
        <LoginForm onLogin={handleLogin} />
        <Link href="/signup" className="block p-2 text-center text-sm">
          Create New Account
        </Link>
      </div>
    </>
  );
}
