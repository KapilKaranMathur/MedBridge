"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Stethoscope, 
  User, 
  ChevronDown,
  Activity,
  ShieldCheck,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          setUser(data.user);
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
    setUser(null);
    router.push("/");
  }

  const dashboardLink = user?.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard";
  const settingsLink = user?.role === "doctor" ? "/doctor/settings" : "/patient/settings";
  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b",
        isAuthPage 
          ? "bg-transparent border-transparent backdrop-blur-none py-6" 
          : scrolled 
            ? "bg-zinc-950/80 backdrop-blur-xl border-zinc-800 py-4 shadow-lg shadow-black/20" 
            : "bg-transparent border-transparent py-6"
      )}
    >
      <nav className="container mx-auto px-4 h-full flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center">
            <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20 group-hover:scale-105 transition-transform duration-300">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -right-1 -top-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black hidden group-hover:block animate-pulse" />
          </div>
          <span className="font-bold text-2xl text-white tracking-tight">
            MedBridge
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {!loading && isLoggedIn && user ? (
            <div className="flex items-center gap-5">
               <Link 
                  href={dashboardLink} 
                  className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors px-4 py-2.5 rounded-lg hover:bg-zinc-900"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
               </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-12 pl-2 pr-4 rounded-full border border-zinc-800 hover:bg-zinc-900 hover:text-white transition-all group gap-3">
                    <Avatar className="h-9 w-9 border border-zinc-700">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="bg-emerald-900 text-emerald-200 text-xs font-medium">
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-xs hidden sm:flex">
                        <span className="font-medium text-zinc-200 text-sm">{user.name?.split(' ')[0]}</span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wide">{user.role === 'doctor' ? 'Doctor' : 'Patient'}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent className="w-64 bg-zinc-950 border-zinc-800 text-zinc-300 shadow-2xl p-2 mt-2" align="end">
                  <div className="px-2 py-3 flex items-center gap-3 bg-zinc-900/50 rounded-lg mb-2">
                     <div className="h-10 w-10 rounded-full bg-emerald-900/30 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                        <User className="h-5 w-5" />
                     </div>
                     <div className="flex flex-col space-y-0.5">
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-[10px] text-zinc-500 truncate max-w-[140px]">{user.email}</p>
                        <Badge variant="outline" className="w-fit border-emerald-800 bg-emerald-950 text-emerald-400 text-[10px] h-4 px-1 rounded-[4px] mt-1">
                          {user.role === "doctor" ? "Medical Staff" : "Patient Account"}
                        </Badge>
                     </div>
                  </div>
                  
                  <DropdownMenuSeparator className="bg-zinc-800 my-1" />
                  
                  <DropdownMenuItem asChild className="focus:bg-zinc-900 focus:text-white cursor-pointer rounded-md my-1 py-3">
                    <Link href={dashboardLink} className="flex items-center">
                      <LayoutDashboard className="mr-3 h-4 w-4 text-emerald-500" />
                      <div className="flex flex-col">
                         <span className="font-medium">Dashboard</span>
                         <span className="text-[10px] text-zinc-500">View appointments & records</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild className="focus:bg-zinc-900 focus:text-white cursor-pointer rounded-md my-1 py-3">
                    <Link href={settingsLink} className="flex items-center">
                      <Settings className="mr-3 h-4 w-4 text-emerald-500" />
                      <div className="flex flex-col">
                         <span className="font-medium">Settings</span>
                         <span className="text-[10px] text-zinc-500">Manage profile & security</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-zinc-800 my-1" />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="text-red-400 focus:bg-red-950/30 focus:text-red-300 cursor-pointer rounded-md py-3"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-medium">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                asChild 
                className="hidden sm:flex text-zinc-400 hover:text-white hover:bg-zinc-900 h-10 px-4 text-base"
              >
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button 
                asChild 
                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-900/20 px-6 h-11 text-base font-medium"
              >
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}