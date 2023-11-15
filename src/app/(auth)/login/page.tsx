"use client";
import Link from "next/link";
import LoginForm from "./LoginForm";
import { auth } from "@/lib/firebase/initialize";
import { AuthErrorCodes, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useState } from "react";

// const getAuthErrorMsg = (error: FirebaseError): string => {
//   console.log(error);

//   if (error.code == AuthErrorCodes.INVALID_APP_CREDENTIAL) {
//     return "Incorrect Password";
//   } else {
//     return error.message;
//   }
// };

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const handleLogin = async (
    email: string,
    password: string,
  ): Promise<void> => {
    console.log("handleLogin: ", email, password);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      console.log(user);
    } catch (error) {
      if (error instanceof FirebaseError) {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // const errorMessage = getAuthErrorMsg(error);
        setErrorMsg(error.message);
      } else {
        alert(`Login Error: ${error}`);
      }
    }
  };

  return (
    <>
      <p>Login page</p>
      <div className="md: mx-3 ">
        <LoginForm onLogin={handleLogin} errorMsg={errorMsg} />
        <Link href="/signup" className="block p-2 text-center text-sm">
          Create New Account
        </Link>
      </div>
    </>
  );
}
