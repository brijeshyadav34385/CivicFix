import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 px-5">
      <h1 className="text-2xl font-bold text-navy mb-1">Welcome back</h1>
      <p className="text-gray-500 mb-6">Log in to report and track civic issues.</p>

      {error && <p className="bg-pending/10 text-pending text-sm p-3 rounded-md mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-ink">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-signal"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-signal"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-navy text-paper font-semibold py-2.5 rounded-md hover:bg-navy-light transition-colors"
        >
          Log In
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-4">
        New here?{" "}
        <Link to="/register" className="text-signal font-semibold">
          Create an account
        </Link>
      </p>
    </div>
  );
}
