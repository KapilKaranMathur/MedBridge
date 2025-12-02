"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, MapPin, Stethoscope, Clock, User, Calendar as CalendarIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function DoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Booking modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState();
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDoctors();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  async function loadDoctors() {
    setLoading(true);
    try {
      const res = await fetch(`/api/doctors?search=${search}`);
      const json = await res.json();
      setDoctors(json.data || []);
    } catch (error) {
      console.error("Failed to load doctors", error);
    } finally {
      setLoading(false);
    }
  }

  function openBookingModal(doctor) {
    setSelectedDoctor(doctor);
    setIsBookingOpen(true);
    setDate(undefined);
    setTime("");
    setNotes("");
    setError("");
    setSuccess(false);
  }

  async function handleBookAppointment() {
    if (!date || !time) {
      setError("Please select both date and time");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const dateTime = new Date(date);
      const [hours, minutes] = time.split(":");
      dateTime.setHours(parseInt(hours), parseInt(minutes));

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          dateTime: dateTime.toISOString(),
          notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to book appointment");
      }

      setSuccess(true);
      setTimeout(() => {
        setIsBookingOpen(false);
        router.push("/patient/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-black pb-24 pt-28 relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/8 via-transparent to-transparent pointer-events-none -z-10" />
      <div className="fixed top-40 right-0 w-[500px] h-[500px] bg-emerald-500/3 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-40 left-0 w-[400px] h-[400px] bg-blue-500/3 rounded-full blur-3xl pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent tracking-tight leading-tight">
              Find Your Doctor
            </h1>
            <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Connect with top specialists for personalized healthcare
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-60" />
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
                <Input
                  placeholder="Search by name or specialization..."
                  className="pl-14 pr-6 h-16 bg-zinc-950 border border-zinc-800/50 rounded-2xl text-white placeholder:text-gray-600 focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/30 transition-all shadow-lg shadow-black/20"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[420px] rounded-3xl bg-zinc-950 animate-pulse border border-zinc-900" />
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="py-40 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/10 to-blue-500/10 mb-8 border border-zinc-900">
              <User className="h-12 w-12 text-emerald-500/60" />
            </div>
            <h3 className="text-3xl font-semibold text-white mb-3">No doctors found</h3>
            <p className="text-gray-600 text-lg">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="group relative bg-zinc-950 border border-zinc-900 hover:border-emerald-500/20 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/5">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-blue-500/0 group-hover:from-emerald-500/[0.02] group-hover:to-blue-500/[0.02] transition-all duration-500" />
                
                <CardContent className="relative p-10 space-y-8">
                  <div className="flex items-start justify-between">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 flex items-center justify-center ring-1 ring-zinc-800 group-hover:ring-emerald-500/20 transition-all duration-300">
                        <span className="text-3xl font-bold text-white">
                          {doctor.name.charAt(0)}
                        </span>
                      </div>
                      <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-emerald-500 rounded-full border-[3px] border-zinc-950" />
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/15 transition-colors px-3 py-1">
                      {doctor.specialization}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-2.5">
                      <Stethoscope className="h-4 w-4 text-emerald-500/50" />
                      {doctor.qualification || 'Medical Specialist'}
                    </p>
                  </div>

                  <div className="space-y-4 pt-5 border-t border-zinc-900">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-3 text-emerald-500/50" />
                      {doctor.city}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-3 text-emerald-500/50" />
                      {doctor.experienceYears} Years Experience
                    </div>
                  </div>

                  <Button 
                    onClick={() => openBookingModal(doctor)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold h-14 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/30 transition-all duration-300 mt-6"
                  >
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="bg-zinc-950 border border-zinc-800 text-white max-w-lg">
          {success ? (
            <div className="py-12 text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 mb-4 border border-emerald-500/20">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
              </div>
              <DialogTitle className="text-2xl font-bold">Booking Confirmed!</DialogTitle>
              <p className="text-gray-400">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Book Appointment</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Schedule a consultation with {selectedDoctor?.name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-6">
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
                    <AlertCircle className="h-5 w-5" /> {error}
                  </div>
                )}

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-400">Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-14 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded-xl transition-colors",
                          !date && "text-gray-500"
                        )}
                      >
                        <CalendarIcon className="mr-3 h-5 w-5" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-zinc-950 border border-zinc-800">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-xl"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-400">Select Time</Label>
                  <Input 
                    type="time" 
                    className="h-14 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/30"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-400">Notes (Optional)</Label>
                  <Textarea 
                    placeholder="Describe your symptoms or reason for visit..." 
                    className="bg-zinc-900 border border-zinc-800 rounded-xl text-white min-h-[120px] resize-none focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/30 placeholder:text-gray-600"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter className="pt-6">
                <Button 
                  onClick={handleBookAppointment}
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold h-14 rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all"
                >
                  {submitting ? "Confirming..." : "Confirm Booking"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
