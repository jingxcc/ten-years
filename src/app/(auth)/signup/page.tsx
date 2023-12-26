"use client";
import { auth } from "@/lib/firebase/initialize";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import createUserDocument from "@/lib/firebase/firestore/createUserDocument";
import toast from "react-hot-toast";
import AuthBaseForm from "@/components/AuthBaseForm/AuthBaseForm";
import Link from "next/link";

export default function SignUpPage() {
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [slideIn, setSlideIn] = useState<Boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/signup") {
      setSlideIn(true);
    }
  }, [pathname]);

  const handleSignUp = async (
    email: string,
    password: string,
  ): Promise<void> => {
    try {
      setErrorMsg("");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
      };

      createUserDocument(user);

      toast.success("Signup success", { position: "top-center" });
      router.push("/get-start");
    } catch (error) {
      let msg = "";
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          msg = "Account already exists";
        } else if (error.code === "auth/weak-password") {
          msg = "Password should be at least 6 characters";
        } else {
          msg = error.message;
        }
      } else if (error instanceof Error) {
        msg = error.message;
        console.error(`Sign-up Error: ${msg}`);
      } else {
        msg = "Unknown Error";
        console.error(`Sign-up Error: ${error}`);
      }
      setErrorMsg(msg);
    }
  };

  return (
    <div className={`${slideIn ? "animate-slide-in" : ""} `}>
      <AuthBaseForm
        formType="SignUp"
        formTitle="Sign Up"
        btnContent="Sign Up"
        errorMsg={errorMsg}
        onFormSubmit={handleSignUp}
      ></AuthBaseForm>
    </div>
  );
}
