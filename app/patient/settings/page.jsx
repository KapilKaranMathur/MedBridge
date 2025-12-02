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
  Fingerprint,
  Activity,
  ShieldCheck,
  QrCode,
  Settings,
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

export default function PatientSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
  });

  const fakeId = formData.name
    ? `MED-${formData.name.substring(0, 3).toUpperCase()}-${Math.floor(
        Math.random() * 10000
      )}`
    : "MED-PENDING";

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/patient/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.patient) {
          setFormData({
            name: data.patient.name || "",
            age: data.patient.age || "",
            gender: data.patient.gender || "",
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
      const res = await fetch("/api/patient/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age),
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
      const res = await fetch("/api/patient/profile", {
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-32 pb-12 font-sans selection:bg-emerald-500/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Settings className="h-8 w-8 text-zinc-400" />
              Account Settings
            </h1>
            <p className="text-zinc-500 mt-2">
              Manage your personal information and security preferences.
            </p>
          </div>
          <Badge
            variant="outline"
            className="hidden sm:flex border-zinc-800 text-zinc-400 py-1.5 px-4 gap-2"
          >
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            Secure Environment
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7 space-y-4">
            <Card className="bg-black border-zinc-800 shadow-xl overflow-hidden">
              <CardHeader className="border-b border-zinc-800 pb-4">
                <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-emerald-500" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-zinc-500">
                  This information appears on your medical records.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form
                  id="profile-form"
                  onSubmit={handleSave}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-zinc-400 font-medium text-xs uppercase tracking-wider"
                    >
                      Full Legal Name
                    </Label>
                    <div className="relative">
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="bg-zinc-950 border-zinc-800 text-white pl-10 h-11 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50"
                        placeholder="e.g. John Doe"
                      />
                      <User className="absolute left-3 top-3 h-5 w-5 text-zinc-600" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label
                        htmlFor="age"
                        className="text-zinc-400 font-medium text-xs uppercase tracking-wider"
                      >
                        Age
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
                        className="bg-zinc-950 border-zinc-800 text-white h-11 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50"
                        placeholder="Years"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="gender"
                        className="text-zinc-400 font-medium text-xs uppercase tracking-wider"
                      >
                        Gender
                      </Label>
                      <Input
                        id="gender"
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                        className="bg-zinc-950 border-zinc-800 text-white h-11 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50"
                        placeholder="e.g. Male"
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="bg-zinc-900/50 border-t border-zinc-800 py-4 flex justify-between items-center">
                <p className="text-xs text-zinc-500">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
                <Button
                  type="submit"
                  form="profile-form"
                  disabled={saving}
                  className={`min-w-[120px] transition-all duration-300 ${
                    success
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-white text-zinc-900 hover:bg-zinc-200"
                  }`}
                >
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : success ? (
                    <ShieldCheck className="mr-2 h-4 w-4" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {success ? "Saved!" : "Save Changes"}
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-red-950/5 border-red-900/20 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-red-400 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-red-900/20 bg-red-950/10">
                  <div className="space-y-1">
                    <h4 className="font-medium text-red-200 text-sm">
                      Delete Account
                    </h4>
                    <p className="text-xs text-red-300/60 max-w-xs">
                      Permanently remove your account and all associated medical
                      data.
                    </p>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-red-900/30"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Profile
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-zinc-950 border-zinc-800">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          secure servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-zinc-900 text-white border-zinc-800 hover:bg-zinc-800">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-red-600 text-white hover:bg-red-700"
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
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-12 space-y-6">
              <div className="flex items-center justify-between text-zinc-500 px-1">
                <h3 className="text-xs font-semibold uppercase tracking-widest">
                  Medical ID Preview
                </h3>
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 text-emerald-400 text-[10px] uppercase"
                >
                  Active Status
                </Badge>
              </div>

              <div className="relative group perspective-1000">
                <div className="relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden bg-linear-to-br from-zinc-900 to-black border border-zinc-800 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                          <Activity className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-xs text-zinc-400 font-medium">
                            MEDBRIDGE
                          </p>
                          <p className="text-[10px] text-zinc-600 uppercase tracking-wider">
                            Universal Health ID
                          </p>
                        </div>
                      </div>
                      <QrCode className="h-10 w-10 text-white/10" />
                    </div>

                    <div className="flex items-center gap-4 my-2 opacity-80">
                      <div className="w-10 h-8 rounded-md bg-linear-to-br from-yellow-200/20 to-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                        <div className="w-full h-px bg-yellow-500/30" />
                      </div>
                      <Activity className="h-6 w-6 text-zinc-600 rotate-90" />
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                          Patient Name
                        </p>
                        <p className="text-lg font-mono font-medium text-white tracking-wide truncate">
                          {formData.name || "YOUR NAME"}
                        </p>
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="flex gap-6">
                          <div>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                              Age
                            </p>
                            <p className="text-sm font-mono text-zinc-300">
                              {formData.age || "--"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                              Sex
                            </p>
                            <p className="text-sm font-mono text-zinc-300">
                              {formData.gender || "--"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
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
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-zinc-300">
                    End-to-End Encryption Enabled
                  </p>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Your medical data is secured using industry-grade encryption
                    to protect your privacy at all times.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
