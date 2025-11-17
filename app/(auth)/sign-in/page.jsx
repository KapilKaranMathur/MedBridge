"use client";

import { useState } from "react";

export default function SignInPage() {
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      window.location.href = "/";
      return;
    }

    const data = await res.json();
    setError(data.error || "Login failed");
  }

  return (
    <div className="container mx-auto max-w-md mt-20">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
        />

        <button
          type="submit"
          className="bg-emerald-600 text-white p-2 rounded w-full"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
