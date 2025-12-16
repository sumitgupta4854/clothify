"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function RegisterPage() {
  const { register } = useStore();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    register({ name: form.name, email: form.email });
    alert("Registered! You are now logged in.");
    router.push("/profile");
  };

  return (
    <main className="auth-body-wrap">
      <section className="auth-card">
        <h1>Create Account</h1>
        <p>Join Clothify and start shopping.</p>
        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" className="btn primary full">
            Register
          </button>
          <p className="auth-alt">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </section>
    </main>
  );
}
