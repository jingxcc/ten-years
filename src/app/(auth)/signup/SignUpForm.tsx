import { useState } from "react";

interface SignUpProps {
  onSignUp: (email: string, password: string) => void;
}

const SignUpForm: React.FC<SignUpProps> = ({ onSignUp }) => {
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
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto my-8 flex max-w-sm flex-col"
    >
      <div className="mb-4">
        <label htmlFor="email" className="mb-1 block text-sm">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          placeholder="email@example.com"
          onChange={handleEmailChange}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="mb-1 block text-sm">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <button type="submit" disabled={isLoading} className="btn">
        Sign Up
      </button>
    </form>
  );
};

export default SignUpForm;
