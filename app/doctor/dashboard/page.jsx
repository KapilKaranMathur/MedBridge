"use client";

import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Calendar, 
  Clock, 
  FileText, 
  MapPin, 
  Search, 
  Stethoscope, 
  User, 
  ChevronRight,
  TrendingUp,
  MoreHorizontal
} from "lucide-react";

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [search, setSearch] = useState("");
  const [busyCreate, setBusyCreate] = useState(null);
  const [error, setError] = useState("");

  async function fetchProfile() {
    try {
      const res = await fetch("/api/doctor/profile");
      if (!res.ok) throw new Error("Failed to load profile");
      const json = await res.json();
      setDoctor(json.doctor);
    } catch (err) {
      setDoctor(null);
      setError(err.message || "Error loading profile");
    }
  }

  async function fetchAppointments(p = page, q = search) {
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams({
        page: String(p || 1),
        pageSize: String(pageSize),
        search: q || "",
      });
      const res = await fetch(`/api/doctor/appointments?${qs.toString()}`);
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "Failed to load appointments");
      }
      const json = await res.json();
      setAppointments(json.data || []);
      setPagination(json.pagination || null);
    } catch (err) {
      setAppointments([]);
      setPagination(null);
      setError(err.message || "Error loading appointments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
    fetchAppointments(1, search);
  }, []);

  useEffect(() => {
    fetchAppointments(page, search);
  }, [page]);

  async function handleCreateRecord(appointment) {
    const patientName = appointment.user?.name || "patient";
    if (!window.confirm(`Start consultation with ${patientName}?`)) return;
    
    setBusyCreate(appointment.id);
    try {
      const payload = {
        appointmentId: appointment.id,
        patientId: appointment.user?.id,
        problem: appointment.notes || "",
        prescription: "",
      };
      
      console.log("Creating medical record with payload:", payload);
      
      const res = await fetch("/api/medical-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Medical record creation response status:", res.status);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error("Medical record creation failed:", body);
        throw new Error(body.error || "Failed to create medical record");
      }

      const record = await res.json();
      console.log("Medical record created successfully:", record);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      window.location.href = `/records/${record.id}`;
    } catch (err) {
      console.error("Error in handleCreateRecord:", err);
      alert(err.message || "Error creating medical record");
    } finally {
      setBusyCreate(null);
    }
  }

  async function handleCancelAppointment(appointmentId) {
    if (!window.confirm("Are you sure you want to cancel this appointment? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/appointments/${appointmentId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to cancel appointment");
      }


      setAppointments(prev => prev.filter(a => a.id !== appointmentId));
    } catch (err) {
      alert(err.message || "Error cancelling appointment");
    }
  }

  function handleOpenRecord(recordId) {
    if (!recordId) return;
    window.location.href = `/records/${recordId}`;
  }

  function handleViewPatient(userId) {
    window.location.href = `/patient/${userId}`;
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-20 md:pt-24 relative overflow-hidden">
      
      <div className="fixed top-0 left-0 w-full h-[500px] bg-radial-gradient from-emerald-900/40 via-background to-background pointer-events-none -z-10" />
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, <span className="text-emerald-400 font-medium">{doctor?.name || "Doctor"}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 backdrop-blur-md">
            <Calendar className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-50">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
            <Activity className="h-5 w-5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {doctor ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-all duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <Stethoscope className="h-16 w-16 text-emerald-500/20 -rotate-12" />
              </div>
              <div className="relative z-10">
                <p className="text-sm font-medium text-muted-foreground">Specialization</p>
                <h3 className="text-2xl font-bold text-white mt-1">{doctor.specialization}</h3>
                <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 w-fit px-2 py-1 rounded">
                  <TrendingUp className="h-3 w-3" /> {doctor.qualification}
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-all duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <MapPin className="h-16 w-16 text-blue-500/20 -rotate-12" />
              </div>
              <div className="relative z-10">
                <p className="text-sm font-medium text-muted-foreground">Practice Location</p>
                <h3 className="text-2xl font-bold text-white mt-1">{doctor.city}</h3>
                <p className="mt-4 text-sm text-muted-foreground">
                   Fee: <span className="text-white font-semibold">₹{doctor.consultationFee}</span>
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-all duration-300">
              <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                <Activity className="h-16 w-16 text-purple-500/20 -rotate-12" />
              </div>
              <div className="relative z-10">
                <p className="text-sm font-medium text-muted-foreground">Total Experience</p>
                <h3 className="text-2xl font-bold text-white mt-1">{doctor.experienceYears} Years</h3>
                <p className="mt-4 text-sm text-muted-foreground">
                   Active since {new Date(doctor.createdAt).getFullYear()}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-32 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
        )}

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-sm">
            <div className="flex items-center px-4 py-2">
               <h2 className="text-lg font-semibold text-white">Appointments</h2>
            </div>
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patient name, notes..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                onKeyDown={(e) => {
                   if (e.key === "Enter") fetchAppointments(1, search);
                }}
                className="pl-10 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-muted-foreground/70 h-11"
              />
            </div>
          </div>


          <Card className="bg-transparent border-none shadow-none">
            <CardContent className="p-0 space-y-3">
              {loading ? (
                 <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />)}
                 </div>
              ) : appointments.length === 0 ? (
                <div className="py-20 text-center rounded-2xl border border-dashed border-white/10 bg-white/5">
                  <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">No appointments found</h3>
                  <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                    There are no scheduled appointments matching your criteria at this moment.
                  </p>
                </div>
              ) : (
                appointments.map((a) => {
                  const dateObj = new Date(a.dateTime);
                  return (
                    <div 
                      key={a.id} 
                      className="group flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/[0.07] hover:border-emerald-500/30 transition-all duration-300"
                    >

                      <div className="hidden md:flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 shrink-0">
                        <span className="text-xs uppercase font-bold tracking-wider">{dateObj.toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span className="text-xl font-bold text-white">{dateObj.getDate()}</span>
                      </div>


                      <div className="md:hidden flex items-center gap-2 text-emerald-400 text-sm font-medium">
                        <Calendar className="h-4 w-4" />
                        {dateObj.toLocaleDateString()} at {dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>


                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-lg font-semibold text-white truncate">{a.user?.name || "Unknown Patient"}</h4>
                          <Badge variant="outline" className={`h-5 text-[10px] px-1.5 uppercase tracking-wide border-0 ${
                             a.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                             a.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                             'bg-yellow-500/10 text-yellow-400'
                          }`}>
                            {a.status || 'Scheduled'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          <span className="hidden sm:flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {a.user?.email}</span>
                        </div>
                        {a.notes && (
                           <p className="mt-2 text-sm text-white/70 line-clamp-1 flex items-center gap-1.5">
                             <FileText className="h-3.5 w-3.5 text-emerald-500" />
                             <span className="italic">&quot;{a.notes}&quot;</span>
                           </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                        {a.medicalRecordId ? (
                          <Button 
                            variant="outline"
                            className="flex-1 md:flex-none border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                            onClick={() => handleOpenRecord(a.medicalRecordId)}
                          >
                            View Record
                          </Button>
                        ) : (
                          <Button
                            className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(5,150,105,0.3)] hover:shadow-[0_0_25px_rgba(5,150,105,0.5)] transition-all"
                            onClick={() => handleCreateRecord(a)}
                            disabled={busyCreate === a.id}
                          >
                             {busyCreate === a.id ? "Starting..." : "Start Consultation"} 
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          className="flex-1 md:flex-none border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50"
                          onClick={() => handleCancelAppointment(a.id)}
                        >
                          {a.medicalRecordId ? "Delete" : "Cancel"}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-white hover:bg-white/10"
                          onClick={() => handleViewPatient(a.user?.id)}
                          title="View Patient Profile"
                        >
                           <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
            
            {pagination && (
              <div className="flex items-center justify-between py-6">
                <Button
                  onClick={() => setPage(Math.max(1, (pagination?.page || page) - 1))}
                  disabled={(pagination?.page || page) <= 1}
                  variant="ghost"
                  className="text-muted-foreground hover:text-white hover:bg-white/10"
                >
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: pagination.totalPages || 1 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        (pagination.page || page) === i + 1 ? "w-8 bg-emerald-500" : "w-1.5 bg-white/20"
                      }`} 
                    />
                  ))}
                </div>

                <Button
                  onClick={() => setPage(Math.min((pagination?.totalPages || 1), (pagination?.page || page) + 1))}
                  disabled={(pagination?.page || page) >= (pagination?.totalPages || 1)}
                  variant="ghost"
                  className="text-muted-foreground hover:text-white hover:bg-white/10"
                >
                  Next
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}