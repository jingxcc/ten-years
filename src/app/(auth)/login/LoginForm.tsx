import Link from "next/link";
import { useState } from "react";

interface LoginProps {
  onLogin: (email: string, password: string) => void;
  errorMsg?: string;
}

const LoginForm: React.FC<LoginProps> = ({ onLogin, errorMsg }) => {
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
      onLogin(email, password);
    } catch (error) {
      if (error instanceof Error) {
        alert(`${error.message}`);
      } else {
        alert(`Login Error: ${error}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="mx-auto mt-8 max-w-sm">
      <form onSubmit={handleSubmit} className="flex flex-col">
        <h2 className="mb-4 text-center text-lg font-bold ">Log In</h2>
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
          {isLoading ? "Logging in..." : "Log In"}
        </button>
        <div className="flex justify-center">
          <Link
            href="/signup"
            className="block p-3 text-center text-sm text-sky-500"
          >
            Create New Account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
