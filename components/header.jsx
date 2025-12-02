"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (data.authenticated) {
          setIsLoggedIn(true);
          setUserName(data.user?.name || data.user?.email);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setIsLoggedIn(false);
    router.push("/");
  }

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-backdrop-filter:bg-background/60 py-2">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold text-3xl">
          MedBridge
        </Link>

        <div className="flex items-center gap-3">
          {!loading && isLoggedIn ? (
            <>
              <span className="text-sm mr-2">Hi, {userName}</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
