"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from "@/components/ui/card";
import { 
  Mail, 
  Lock, 
  LogIn, 
  Loader2,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

const InputField = ({ icon: Icon, ...props }) => (
  <div className="relative group">
    <Icon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 group-focus-within:text-emerald-400 transition-colors pointer-events-none" />
    <Input 
      {...props}
      className="pl-9 h-10 bg-black/40 border-white/20 text-sm text-white placeholder:text-gray-500 focus-visible:ring-emerald-400/40 focus-visible:border-emerald-400 transition-all" 
    />
  </div>
);

export default function SignInPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        window.location.href = data.redirectUrl || "/";
        return;
      }

      const data = await res.json();
      setError(data.error || "Login failed");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 pt-0 relative bg-black overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-black via-black to-black -z-20" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-800/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <Card className="w-full max-w-sm border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center pb-1 pt-0">
          <div className="mx-auto h-12 w-12 rounded-full bg-emerald-700/20 flex items-center justify-center border border-emerald-700/40">
            <LogIn className="h-6 w-6 text-emerald-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white tracking-tight mt-1 mb-0">
            Welcome Back
          </CardTitle>
          <p className="text-xs text-gray-400 mt-0 mb-1">
            Sign in to access your dashboard
          </p>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="p-2.5 rounded bg-red-700/20 border border-red-500/30 text-red-400 text-xs text-center font-medium">
                {error}
              </div>
            )}

            <InputField 
              icon={Mail} 
              name="email" 
              type="email" 
              placeholder="Email Address" 
              required 
            />
              
            <InputField 
              icon={Lock} 
              name="password" 
              type="password" 
              placeholder="Password" 
              required 
            />

            <Button 
              type="submit" 
              className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium h-10 shadow-[0_0_18px_rgba(4,120,87,0.5)] transition-all mt-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="pb-4 pt-1 flex justify-center">
          <p className="text-gray-400 text-xs">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
