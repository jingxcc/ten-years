import Link from "next/link";
import { ReactNode, useState } from "react";
import { demoAccount } from "@/constants/AuthForm";

interface AuthFormProps {
  formType: "Login" | "SignUp";
  formTitle: string;
  btnContent: string;
  errorMsg?: string;
  onFormSubmit: (email: string, password: string) => void;
  children?: ReactNode;
}

const AuthBaseForm: React.FC<AuthFormProps> = ({
  formType,
  formTitle,
  btnContent,
  errorMsg,
  onFormSubmit,
  children,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoClick = () => {
    setEmail(demoAccount.email);
    setPassword(demoAccount.password);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    onFormSubmit(email, password);
    setIsLoading(false);
  };
  return (
    <div className="mx-auto mt-10 max-w-md rounded-xl border bg-white bg-opacity-95 px-5 py-10 md:p-10">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <h2 className="mb-4 text-center text-lg font-bold ">{formTitle}</h2>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="email@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {children}
        {errorMsg && <p className="mb-2 text-sm text-red-500">{errorMsg}</p>}
        <button type="submit" disabled={isLoading} className="btn mb-2">
          {btnContent}
        </button>
        <div className="flex justify-center">
          {formType === "Login" && (
            <div className="">
              <Link
                href="/signup"
                className="block w-full px-12 py-2 text-center text-sm text-sky-500 hover:font-bold"
              >
                {"I'm new here"}
              </Link>
              <button
                type="button"
                className="block w-full px-12 py-2 text-center text-sm text-sky-500 hover:font-bold"
                onClick={handleDemoClick}
              >
                {"Try a Demo"}
              </button>
            </div>
          )}
          {formType === "SignUp" && (
            <Link
              href="/login"
              className="p-2 text-sm hover:underline hover:underline-offset-2"
            >
              Already have an account
            </Link>
          )}
        </div>
      </form>
    </div>
  );
};

export default AuthBaseForm;
