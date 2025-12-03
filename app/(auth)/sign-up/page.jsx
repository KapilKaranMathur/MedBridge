"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  User,
  Mail,
  Lock,
  Stethoscope,
  GraduationCap,
  Building2,
  Calendar,
  Baby,
  Users,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";

const InputField = ({ icon: Icon, ...props }) => (
  <div className="relative group">
    <Icon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 group-focus-within:text-emerald-400 transition-colors pointer-events-none" />
    <Input
      {...props}
      className="pl-9 h-9 bg-black/40 border-white/20 text-sm text-white placeholder:text-gray-500 focus-visible:ring-emerald-400/40 focus-visible:border-emerald-400 transition-all"
    />
  </div>
);

export default function SignUpPage() {
  const [error, setError] = useState("");
  const [role, setRole] = useState("patient");
  const [isLoading, setIsLoading] = useState(false);

  const [specialization, setSpecialization] = useState("");
  const [qualification, setQualification] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [city, setCity] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const payload = { name, email, password, role };

    if (role === "doctor") {
      payload.specialization = specialization;
      payload.qualification = qualification;
      payload.experienceYears = Number(experienceYears);
      payload.city = city;
    }

    if (role === "patient") {
      payload.age = Number(age);
      payload.gender = gender;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        window.location.href = "/sign-in";
        return;
      }
      const data = await res.json();
      setError(data.error || "Signup failed");
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 pt-20 relative bg-black overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-black via-black to-black -z-20" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-800/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <Card className="w-full max-w-md border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center pt-6 pb-2">
          <CardTitle className="text-2xl font-bold text-white tracking-tight">
            Create Account
          </CardTitle>
          <p className="text-xs text-gray-400">
            Sign up to manage your healthcare journey
          </p>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          <div className="bg-black/40 p-1 rounded-lg grid grid-cols-2 gap-1 mb-2">
            <button
              type="button"
              onClick={() => setRole("patient")}
              className={`flex items-center justify-center gap-2 text-sm font-medium py-1.5 rounded-md transition-all ${
                role === "patient"
                  ? "bg-emerald-700 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-black/40"
              }`}
            >
              <User className="h-3.5 w-3.5" /> Patient
            </button>
            <button
              type="button"
              onClick={() => setRole("doctor")}
              className={`flex items-center justify-center gap-2 text-sm font-medium py-1.5 rounded-md transition-all ${
                role === "doctor"
                  ? "bg-emerald-700 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-black/40"
              }`}
            >
              <Stethoscope className="h-3.5 w-3.5" /> Doctor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="p-2 rounded bg-red-700/20 border border-red-500/30 text-red-400 text-xs text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <InputField name="name" icon={User} placeholder="Full Name" required />
              <InputField name="email" type="email" icon={Mail} placeholder="Email" required />
            </div>

            <InputField name="password" type="password" icon={Lock} placeholder="Password" required />

            {role === "doctor" && (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    icon={Stethoscope}
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="Specialization"
                  />
                  <InputField
                    icon={GraduationCap}
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="Qualification"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <InputField
                    icon={Calendar}
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="Exp (Yrs)"
                  />
                  <div className="col-span-2">
                    <InputField
                      icon={Building2}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                    />
                  </div>
                </div>
              </div>
            )}

            {role === "patient" && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <InputField
                  icon={Baby}
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Age"
                />
                <InputField
                  icon={Users}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  placeholder="Gender"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-medium h-10 mt-1 shadow-[0_0_20px_rgba(4,120,87,0.5)] transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Create Account <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="pb-4 pt-1 flex justify-center">
          <p className="text-gray-400 text-xs">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}