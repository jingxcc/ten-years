"use client";
import LoginForm from "./LoginForm";
import { auth } from "@/lib/firebase/initialize";
import { AuthErrorCodes, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useState } from "react";
import { useRouter } from "next/navigation";

// user-friendly message
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
  const route = useRouter();

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

      alert("Login success");
      route.push("/chat");
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
      <LoginForm onLogin={handleLogin} errorMsg={errorMsg} />
    </>
  );
}
