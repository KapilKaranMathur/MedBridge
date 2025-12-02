"use client";

import { use, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
  User,
  Stethoscope,
  Send,
  Loader2,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ChevronLeft,
  Pill,
  Activity,
} from "lucide-react";

import Link from "next/link";

export default function RecordThread({ params }) {
  const { id } = use(params);

  const [record, setRecord] = useState(null);

  const [loading, setLoading] = useState(true);

  const [newMessage, setNewMessage] = useState("");

  const [prescription, setPrescription] = useState("");

  const [posting, setPosting] = useState(false);

  const [updatingPrescription, setUpdatingPrescription] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  async function load() {
    setLoading(true);
    
    // Fetch current user
    const authRes = await fetch("/api/auth/me");
    if (authRes.ok) {
      const authData = await authRes.json();
      if (authData.authenticated) {
        setCurrentUser(authData.user);
      }
    }

    const res = await fetch(`/api/medical-records/${id}`);

    if (res.ok) {
      const j = await res.json();

      setRecord(j);

      setPrescription(j.prescription || "");
    } else {
      setRecord(null);
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function postFollowup() {
    if (!newMessage.trim()) return;

    setPosting(true);

    const res = await fetch(`/api/medical-records/${id}/followups`, {
      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ message: newMessage }),
    });

    if (res.ok) {
      setNewMessage("");

      load();
    } else {
      const j = await res.json().catch(() => ({}));

      alert(j.message || "Failed to post");
    }

    setPosting(false);
  }

  async function updatePrescription() {
    if (!prescription.trim()) return;

    setUpdatingPrescription(true);

    const res = await fetch(`/api/medical-records/${id}`, {
      method: "PATCH",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ prescription }),
    });

    if (res.ok) {
      load();
    } else {
      const j = await res.json().catch(() => ({}));

      alert(j.error || "Failed to update prescription");
    }

    setUpdatingPrescription(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />

        <h1 className="text-2xl font-bold mb-2">Medical Record Not Found</h1>

        <p className="text-gray-500 mb-6">
          This record doesn't exist or you don't have access to it.
        </p>

        <Button
          asChild
          variant="outline"
          className="border-zinc-800 text-white hover:bg-zinc-900"
        >
          <Link href="/doctor/dashboard">Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const isDoctor = currentUser?.role === "doctor";

  return (
    <div className="min-h-screen bg-black pb-24 pt-28 relative overflow-hidden">
      {/* Subtle Background Effects */}

      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-emerald-900/5 via-transparent to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Navigation */}

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-gray-400 hover:text-white hover:bg-zinc-900"
          >
            <Link href={isDoctor ? "/doctor/dashboard" : "/patient/dashboard"}>
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              Consultation Record
              <Badge
                variant="outline"
                className="text-xs font-normal bg-zinc-900/50 border-zinc-800 text-gray-400"
              >
                #{record.id}
              </Badge>
            </h1>

            <p className="text-gray-500 text-sm">
              Started on {new Date(record.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="ml-auto">
            <Badge
              className={`px-3 py-1 text-sm font-medium ${
                record.status === "CLOSED"
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
              }`}
            >
              {record.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-4 space-y-6">

            <Card className="bg-zinc-950 border border-zinc-900 overflow-hidden">
              <div className="h-24 bg-linear-to-br from-emerald-900/20 to-blue-900/20" />

              <CardContent className="relative pt-0 px-6 pb-6">
                <div className="absolute -top-12 left-6">
                  <div className="h-24 w-24 rounded-2xl bg-zinc-900 border-4 border-black flex items-center justify-center">
                    <User className="h-10 w-10 text-gray-400" />
                  </div>
                </div>

                <div className="mt-14 space-y-1">
                  <h3 className="text-xl font-bold text-white">
                    {record.patient?.name}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {record.patient?.email}
                  </p>
                </div>

                <Separator className="my-6 bg-zinc-900" />

                <div className="space-y-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-600 font-semibold">
                      Attending Doctor
                    </label>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Stethoscope className="h-4 w-4 text-emerald-500" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white">
                          {record.doctor?.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {record.doctor?.specialization}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


            <Card className="bg-zinc-950 border border-zinc-900">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-400" />
                  Clinical Problem
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-900">
                  <p className="text-gray-300 leading-relaxed">
                    {record.problem || "No problem description provided."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>


          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-zinc-950 border border-zinc-900 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Pill className="h-5 w-5 text-emerald-500" />
                  Prescription Plan
                </CardTitle>

                <CardDescription className="text-gray-500">
                  Medications, dosages, and instructions
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col gap-4">
                <div className="flex-1">
                  {isDoctor ? (
                    <Textarea 
                      value={prescription}
                      onChange={(e) => setPrescription(e.target.value)}
                      className="h-full min-h-[300px] bg-zinc-900/50 border-zinc-800 rounded-xl text-white resize-none focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/30 placeholder:text-gray-600 font-mono text-sm leading-relaxed p-4"
                      placeholder="Rx:&#10;&#10;1. Medication Name - Dosage&#10;   Sig: Instructions&#10;&#10;2. Medication Name - Dosage&#10;   Sig: Instructions"
                    />
                  ) : (
                    <div className="h-full min-h-[300px] bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4 font-mono text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
                      {prescription || "No prescription details available yet."}
                    </div>
                  )}
                </div>
                {isDoctor && (
                  <Button 
                    onClick={updatePrescription}
                    disabled={updatingPrescription || !prescription.trim()}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium h-12 rounded-xl transition-all"
                  >
                    {updatingPrescription ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Update Prescription
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>


          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-zinc-950 border border-zinc-900 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-400" />
                  Consultation Log
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col gap-4 min-h-[500px]">

                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                  {record.followUps && record.followUps.length > 0 ? (
                    record.followUps.map((f) => (
                      <div
                        key={f.id}
                        className={`flex flex-col ${
                          f.authorRole === "doctor"
                            ? "items-end"
                            : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-4 ${
                            f.authorRole === "doctor"
                              ? "bg-emerald-600/10 border border-emerald-500/20 text-emerald-50 rounded-br-none"
                              : "bg-zinc-900 border border-zinc-800 text-gray-300 rounded-bl-none"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{f.message}</p>
                        </div>

                        <span className="text-[10px] text-gray-600 mt-1 px-1">
                          {f.authorRole === "doctor" ? "You" : "Patient"} •{" "}
                          {new Date(f.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-2">
                      <MessageSquare className="h-8 w-8 opacity-20" />

                      <p className="text-sm">No messages yet</p>
                    </div>
                  )}
                </div>

                <Separator className="bg-zinc-900" />

                {/* Input Area */}

                <div className="relative">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();

                        postFollowup();
                      }
                    }}
                    className="min-h-[100px] bg-zinc-900 border-zinc-800 rounded-xl text-white resize-none focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/30 placeholder:text-gray-600 pr-12"
                    placeholder="Type a message..."
                  />

                  <Button
                    onClick={postFollowup}
                    disabled={posting || !newMessage.trim()}
                    size="icon"
                    className="absolute bottom-3 right-3 h-8 w-8 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-all"
                  >
                    {posting ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <Send className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </div>

                <p className="text-[10px] text-gray-600 text-center">
                  Press Enter to send • Shift + Enter for new line
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
