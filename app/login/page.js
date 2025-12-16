"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const { login } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    login(email);
    alert("Logged in!");
    router.push("/profile");
  };

  return (
    <main className="auth-body-wrap">
      <section className="auth-card">
        <h1>Welcome Back</h1>
        <p>Login to continue shopping.</p>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn primary full">
            Login
          </button>
          <p className="auth-alt">
            New here? <a href="/register">Create an account</a>
          </p>
        </form>
      </section>
    </main>
  );
}
