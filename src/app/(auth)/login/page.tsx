"use client";
import { auth } from "@/lib/firebase/initialize";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Header from "@/components/Header/Header";
import AuthBaseForm from "@/components/AuthBaseForm/AuthBaseForm";
import { loginSuccessPathname } from "@/constants/config";

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const route = useRouter();

  const handleLogin = async (
    email: string,
    password: string,
  ): Promise<void> => {
    try {
      setErrorMsg("");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      toast.success("Login success", { position: "top-center" });
      route.push(loginSuccessPathname);
    } catch (error) {
      let msg = "";
      if (error instanceof FirebaseError) {
        if (error.code === "auth/invalid-login-credentials") {
          msg = "Incorrect email or password";
        } else {
          msg = error.message;
        }
      } else if (error instanceof Error) {
        msg = error.message;
        console.error(`Login Error: ${msg}`);
      } else {
        msg = "Unknown Error";
        console.error(`Login Error: ${error}`);
      }
      setErrorMsg(msg);
    }
  };

  return (
    <div className="min-h-100dvh bg-sky-200">
      <Header showNav={false}></Header>
      <main className="px-3">
        <AuthBaseForm
          formType="Login"
          formTitle="Log In"
          btnContent="Log In"
          errorMsg={errorMsg}
          onFormSubmit={handleLogin}
        ></AuthBaseForm>
      </main>
    </div>
  );
}
