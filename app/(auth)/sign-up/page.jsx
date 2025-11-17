"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      window.location.href = "/sign-in";
      return;
    }

    const data = await res.json();
    setError(data.error || "Signup failed");
  }

  return (
    <div className="container mx-auto max-w-md mt-20">
      <h1 className="text-2xl font-bold mb-4">Create an Account</h1>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          className="border p-2 w-full rounded"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border p-2 w-full rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="Password (min 6 characters)"
          className="border p-2 w-full rounded"
        />

        <Button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
        >
          Sign Up
        </Button>
      </form>
    </div>
  );
}
