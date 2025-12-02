"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Save,
  Trash2,
  AlertTriangle,
  User,
  Briefcase,
  GraduationCap,
  MapPin,
  Settings,
  Activity,
  ShieldCheck,
  QrCode,
  BookOpen,
  Clock,
  Layers,
  Lock,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DoctorSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    qualification: "",
    experienceYears: "",
    city: "",
  });

  const fakeId = formData.name
    ? `DOC-${formData.name.substring(0, 3).toUpperCase()}-${Math.floor(
        Math.random() * 10000
      )}`
    : "DOC-PENDING";

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/doctor/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.doctor) {
          setFormData({
            name: data.doctor.name || "",
            specialization: data.doctor.specialization || "",
            qualification: data.doctor.qualification || "",
            experienceYears: data.doctor.experienceYears || "",
            city: data.doctor.city || "",
          });
        }
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/doctor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          experienceYears: Number(formData.experienceYears),
        }),
      });
      if (!res.ok) throw new Error();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch("/api/doctor/profile", {
        method: "DELETE",
      });
      if (res.ok) {
        window.location.href = "/";
      }
    } catch {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
        <p className="text-zinc-500 text-sm animate-pulse">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-32 pb-12 selection:bg-emerald-500/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Settings className="h-8 w-8 text-zinc-400" />
              Doctor Settings
            </h1>
            <p className="text-zinc-500 mt-2">
              Manage your professional information and security preferences.
            </p>
          </div>
          <Badge
            variant="outline"
            className="hidden sm:flex border-zinc-800 text-zinc-400 py-1.5 px-4 gap-2"
          >
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            Verified Access
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7 space-y-4">
            <Card className="bg-black border-zinc-800 shadow-xl overflow-hidden">
              <CardHeader className="border-b border-zinc-800 pb-4">
                <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-emerald-500" />
                  Professional Information
                </CardTitle>
                <CardDescription className="text-zinc-500">
                  This information appears on your public doctor profile.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4">
                <form
                  id="profile-form"
                  onSubmit={handleSave}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wider">
                      Full Name
                    </Label>
                    <Input
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="bg-zinc-950 border-zinc-800 text-white h-11"
                      placeholder="e.g. Dr. John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wider">
                      Specialization
                    </Label>
                    <Input
                      value={formData.specialization}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialization: e.target.value,
                        })
                      }
                      className="bg-zinc-950 border-zinc-800 text-white h-11"
                      placeholder="e.g. Cardiologist"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs uppercase tracking-wider">
                      Qualification
                    </Label>
                    <Input
                      value={formData.qualification}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          qualification: e.target.value,
                        })
                      }
                      className="bg-zinc-950 border-zinc-800 text-white h-11"
                      placeholder="e.g. MBBS, MD"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-zinc-400 text-xs uppercase tracking-wider">
                        Experience (Years)
                      </Label>
                      <Input
                        type="number"
                        value={formData.experienceYears}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experienceYears: e.target.value,
                          })
                        }
                        className="bg-zinc-950 border-zinc-800 text-white h-11"
                        placeholder="Years"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-zinc-400 text-xs uppercase tracking-wider">
                        City
                      </Label>
                      <Input
                        value={formData.city}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="bg-zinc-950 border-zinc-800 text-white h-11"
                        placeholder="e.g. Mumbai"
                      />
                    </div>
                  </div>
                </form>
              </CardContent>

              <Card className="bg-red-950/10 border-red-900/30 shadow-none rounded-xl">
                <CardHeader className="pb-1">
                  <CardTitle className="text-base font-medium text-red-400 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription className="text-red-300/60 text-sm leading-tight mt-0.5">
                    Irreversible account actions. Be careful!
                  </CardDescription>
                </CardHeader>

                <CardContent className="py-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-2 rounded-lg border border-red-900/20 bg-red-950/20">
                    <div className="space-y-0.5">
                      <h4 className="font-medium text-red-200 text-sm leading-tight">
                        Delete Account
                      </h4>
                      <p className="text-xs text-red-300/60 max-w-xs leading-snug">
                        Permanently remove your doctor account and all
                        associated data.
                      </p>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-red-900/30 py-1 px-3 text-sm"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Profile
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent className="bg-zinc-950 border-zinc-800">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white text-sm">
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-zinc-400 text-xs leading-tight">
                            This action cannot be undone. Deleting your account
                            will remove all doctor data from our servers
                            permanently.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-zinc-900 text-white border-zinc-800 hover:bg-zinc-800 py-1 px-3 text-sm">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 text-white hover:bg-red-700 py-1 px-3 text-sm"
                            disabled={deleting}
                          >
                            {deleting ? "Deleting..." : "Delete Account"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between text-zinc-500 px-1">
              <h3 className="text-xs font-semibold uppercase tracking-widest">
                Doctor ID Preview
              </h3>

              <Badge
                variant="outline"
                className="border-emerald-500/30 text-emerald-400 text-[10px] uppercase"
              >
                Active Status
              </Badge>
            </div>

            <div className="relative group perspective-1000">
              <div className="relative w-full aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 shadow-2xl overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-emerald-500" />
                      </div>

                      <div>
                        <p className="text-xs text-zinc-400">MEDBRIDGE</p>
                        <p className="text-[10px] text-zinc-600 uppercase tracking-wider">
                          Doctor Verification Card
                        </p>
                      </div>
                    </div>

                    <QrCode className="h-10 w-10 text-white/10" />
                  </div>

                  <div className="space-y-4 mt-4">
                    <div className="space-y-1">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                        Doctor Name
                      </p>
                      <p className="text-lg font-mono text-white tracking-wide truncate">
                        {formData.name || "YOUR NAME"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                        Specialization
                      </p>
                      <p className="text-sm font-mono text-zinc-300 truncate">
                        {formData.specialization || "--"}
                      </p>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                          Experience
                        </p>
                        <p className="text-sm font-mono text-zinc-300">
                          {formData.experienceYears || "--"} years
                        </p>
                      </div>

                      <div className="space-y-1 text-right">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                          ID Number
                        </p>
                        <p className="text-xs font-mono text-emerald-500/80">
                          {fakeId}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-zinc-900/40 border-zinc-800 p-4 flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="font-medium text-zinc-300 text-sm">
                    Clinical Records Sync
                  </p>
                  <p className="text-xs text-zinc-500">
                    Automatically syncs your consultation history.
                  </p>
                </div>
              </Card>

              <Card className="bg-zinc-900/40 border-zinc-800 p-4 flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="font-medium text-zinc-300 text-sm">
                    Smart Availability
                  </p>
                  <p className="text-xs text-zinc-500">
                    Intelligent schedule tracking across devices.
                  </p>
                </div>
              </Card>

              <Card className="bg-zinc-900/40 border-zinc-800 p-4 flex items-start gap-3">
                <Layers className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="font-medium text-zinc-300 text-sm">
                    Multi-Clinic Support
                  </p>
                  <p className="text-xs text-zinc-500">
                    Add and manage multiple practice locations.
                  </p>
                </div>
              </Card>

              <Card className="bg-zinc-900/40 border-zinc-800 p-4 flex items-start gap-3">
                <Lock className="h-5 w-5 text-red-400" />
                <div>
                  <p className="font-medium text-zinc-300 text-sm">
                    Enhanced Security
                  </p>
                  <p className="text-xs text-zinc-500">
                    Private access with encrypted verification.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
