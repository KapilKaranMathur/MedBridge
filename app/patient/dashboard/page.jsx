"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, FileText, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, [search]);

  async function fetchAppointments() {
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments?search=${search}`);
      const json = await res.json();
      setAppointments(json.data || []);
    } catch (err) {
      console.error("Failed to load appointments", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelAppointment(appointmentId) {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to cancel appointment");
      }

      // Remove from local state
      setAppointments(prev => prev.filter(a => a.id !== appointmentId));
    } catch (err) {
      alert(err.message || "Error cancelling appointment");
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-20 md:pt-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-radial-gradient from-emerald-900/20 via-background to-background pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              My Appointments
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your upcoming and past consultations.
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search doctor..."
                  className="pl-10 bg-white/5 border-white/10 text-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
             <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white">
                <Link href="/patient/doctors">Book New</Link>
             </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-xl bg-white/5 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-dashed border-white/10 bg-white/5">
            <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-white">No appointments yet</h3>
            <p className="text-muted-foreground mt-2 mb-6">
              Book your first consultation with a specialist today.
            </p>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white">
              <Link href="/patient/doctors">Find a Doctor</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((a) => {
              const dateObj = new Date(a.dateTime);
              return (
                <Card key={a.id} className="bg-white/5 border-white/10 hover:bg-white/[0.07] transition-all">
                  <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                    {/* Date Widget */}
                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 shrink-0">
                      <span className="text-xs uppercase font-bold tracking-wider">{dateObj.toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-xl font-bold text-white">{dateObj.getDate()}</span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-white">{a.doctor?.name || "Doctor"}</h3>
                        <Badge variant="outline" className={`h-5 text-[10px] px-1.5 uppercase tracking-wide border-0 ${
                             a.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                             a.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                             'bg-yellow-500/10 text-yellow-400'
                          }`}>
                            {a.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-emerald-400">{a.doctor?.specialization}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        {a.notes && <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> {a.notes}</span>}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      {a.medicalRecordId ? (
                        <Button variant="outline" className="flex-1 md:flex-none border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" asChild>
                          <Link href={`/records/${a.medicalRecordId}`}>View Record</Link>
                        </Button>
                      ) : null}
                      
                      <Button 
                        variant="outline" 
                        className="flex-1 md:flex-none border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50"
                        onClick={() => handleCancelAppointment(a.id)}
                      >
                        {a.medicalRecordId ? "Delete" : "Cancel"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
