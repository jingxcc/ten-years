"use client";
import SignUpForm from "./SignUpForm";

export default function SignUpPage() {
  const handleSignUp = (email: string, password: string) => {
    console.log("handleSignUp: ", email, password);
  };

  return (
    <>
      <p>SignUp page</p>
      <SignUpForm onSignUp={handleSignUp} />
    </>
  );
}
