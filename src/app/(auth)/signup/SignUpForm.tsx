import Link from "next/link";
import { useState } from "react";

interface SignUpProps {
  onSignUp: (email: string, password: string) => void;
  errorMsg?: string;
}

const SignUpForm: React.FC<SignUpProps> = ({ onSignUp, errorMsg }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      onSignUp(email, password);
    } catch (error) {
      if (error instanceof Error) {
        alert(`${error.message}`);
      } else {
        alert(`Sign-up Error: ${error}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="mx-auto mt-10 max-w-md rounded-xl border bg-white bg-opacity-95 p-10">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <h2 className="mb-4 text-center text-lg font-bold ">Sign Up</h2>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="email@example.com"
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        {errorMsg && <p className="mb-2 text-sm text-red-500">{errorMsg}</p>}
        <button type="submit" disabled={isLoading} className="btn">
          Sign Up
        </button>
      </form>
      <div className="flex justify-center">
        <Link
          href="/login"
          className="p-3 text-sm hover:underline hover:underline-offset-2"
        >
          Already have an account
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;
