"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  MapPin,
  Stethoscope,
  Clock,
  User,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle,
  Filter,
  Star,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Mock specialties for the filter (In a real app, fetch these)
const SPECIALTIES = [
  "Cardiology",
  "Dermatology",
  "Neurology",
  "General",
  "Pediatrics",
];

export default function DoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");
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
    loadDoctors();
  }, []);

  useEffect(() => {
    // Client-side filtering for immediate feedback
    let result = doctors;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialization.toLowerCase().includes(q)
      );
    }

    if (selectedSpecialty !== "All") {
      result = result.filter((d) =>
        d.specialization.includes(selectedSpecialty)
      );
    }

    setFilteredDoctors(result);
  }, [search, selectedSpecialty, doctors]);

  async function loadDoctors() {
    setLoading(true);
    try {
      // In a real scenario, you might pass search params to the API
      // keeping it simple here to allow client-side specialty filtering easily
      const res = await fetch(`/api/doctors`);
      const json = await res.json();
      const data = json.data || [];
      setDoctors(data);
      setFilteredDoctors(data);
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 pt-32 pb-12">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-zinc-900/50 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <ShieldCheck className="h-8 w-8 text-emerald-500" />
                Find a Specialist
              </h1>
              <p className="text-zinc-400 mt-2 max-w-xl text-lg">
                Access our network of verified medical professionals.
              </p>
            </div>

            {/* Quick Stats or Info could go here */}
            <div className="hidden md:flex items-center gap-2 text-sm text-zinc-500 bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {doctors.length} Doctors Available Now
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-zinc-500" />
                <Input
                  placeholder="Search by doctor name, specialty, or condition..."
                  className="pl-12 h-14 bg-zinc-900 border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500/50 transition-all text-base"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Specialty Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              <Button
                variant="outline"
                onClick={() => setSelectedSpecialty("All")}
                className={cn(
                  "h-14 rounded-xl border-zinc-800 min-w-[80px]",
                  selectedSpecialty === "All"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/50"
                    : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
                )}
              >
                All
              </Button>
              {SPECIALTIES.map((spec) => (
                <Button
                  key={spec}
                  variant="outline"
                  onClick={() => setSelectedSpecialty(spec)}
                  className={cn(
                    "h-14 rounded-xl border-zinc-800 min-w-[100px]",
                    selectedSpecialty === spec
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/50"
                      : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
                  )}
                >
                  {spec}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-[340px] rounded-2xl bg-zinc-900/50 animate-pulse border border-zinc-800/50"
              />
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-zinc-900/30 rounded-3xl border border-zinc-800/50 border-dashed">
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 border border-zinc-800">
              <Search className="h-6 w-6 text-zinc-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No specialists found
            </h3>
            <p className="text-zinc-500 max-w-sm mx-auto">
              We couldn't find any doctors matching "{search}". Try adjusting
              your filters.
            </p>
            <Button
              variant="link"
              onClick={() => {
                setSearch("");
                setSelectedSpecialty("All");
              }}
              className="text-emerald-500 mt-2"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="group bg-zinc-900 border-zinc-800/80 hover:border-emerald-500/30 transition-all duration-300 flex flex-col overflow-hidden relative"
              >
                {/* Available Indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 bg-zinc-950/50 backdrop-blur rounded-full border border-zinc-800 text-[10px] font-medium text-emerald-400 z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Available
                </div>

                <div className="h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 relative">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
                </div>

                <CardContent className="pt-0 pb-6 flex-1 flex flex-col px-6">
                  {/* Avatar */}
                  <div className="-mt-12 mb-4 relative inline-block self-start">
                    <div className="h-20 w-20 rounded-2xl bg-zinc-800 border-4 border-zinc-900 flex items-center justify-center text-2xl font-bold text-zinc-400 group-hover:text-emerald-400 group-hover:border-zinc-800 transition-colors shadow-xl">
                      {doctor.name.charAt(0)}
                    </div>
                  </div>

                  <div className="space-y-1 mb-4">
                    <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors truncate">
                      {doctor.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-0 rounded-md px-2 font-normal"
                      >
                        {doctor.specialization}
                      </Badge>
                      <span className="text-zinc-600 text-xs flex items-center gap-1">
                        <Star className="h-3 w-3 fill-zinc-700 text-zinc-700" />
                        4.9
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1">
                    <div className="flex items-start gap-3 text-sm text-zinc-400">
                      <Stethoscope className="h-4 w-4 text-zinc-600 mt-0.5 shrink-0" />
                      <span className="line-clamp-1">
                        {doctor.qualification || "MD, Specialist"}
                      </span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-zinc-400">
                      <Clock className="h-4 w-4 text-zinc-600 mt-0.5 shrink-0" />
                      <span>{doctor.experienceYears}+ Years Exp.</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-zinc-400">
                      <MapPin className="h-4 w-4 text-zinc-600 mt-0.5 shrink-0" />
                      <span className="truncate">
                        {doctor.city || "Main Clinic"}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="px-6 pb-6 pt-0">
                  <Button
                    onClick={() => openBookingModal(doctor)}
                    className="w-full bg-white text-zinc-900 hover:bg-emerald-500 hover:text-white transition-all duration-300 font-medium h-11 rounded-lg"
                  >
                    Book Appointment
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 sm:max-w-[500px] p-0 gap-0 overflow-hidden shadow-2xl shadow-black/50">
          {success ? (
            <div className="p-12 flex flex-col items-center justify-center text-center space-y-6 bg-zinc-950">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 animate-in zoom-in duration-300">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <DialogTitle className="text-2xl font-bold text-white">
                  Booking Confirmed
                </DialogTitle>
                <p className="text-zinc-500">
                  Your appointment with{" "}
                  <span className="text-emerald-400 font-medium">
                    {selectedDoctor?.name}
                  </span>{" "}
                  has been scheduled.
                </p>
              </div>
              <p className="text-xs text-zinc-600 animate-pulse">
                Redirecting to dashboard...
              </p>
            </div>
          ) : (
            <>
              <div className="p-6 border-b border-zinc-800 bg-zinc-900/50">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    Book Appointment
                  </DialogTitle>
                  <DialogDescription className="text-zinc-500">
                    Complete the form below to request a consultation.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="p-6 space-y-6">
                {/* Doctor Summary in Modal */}
                <div className="flex items-center gap-4 p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                  <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-zinc-400">
                    {selectedDoctor?.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {selectedDoctor?.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {selectedDoctor?.specialization}
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> {error}
                  </div>
                )}

                <div className="grid gap-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-12 bg-zinc-950 border-zinc-800 hover:bg-zinc-900 hover:text-white transition-colors",
                            !date && "text-zinc-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-zinc-950 border-zinc-800">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          disabled={(date) => date < new Date()}
                          className="rounded-md border border-zinc-800"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Time
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                      <Input
                        type="time"
                        className="pl-10 h-12 bg-zinc-950 border-zinc-800 text-white focus-visible:ring-emerald-500/30"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Reason for Visit
                    </Label>
                    <Textarea
                      placeholder="Briefly describe your symptoms..."
                      className="bg-zinc-950 border-zinc-800 text-white min-h-[100px] resize-none focus-visible:ring-emerald-500/30"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 pt-2 bg-zinc-950">
                <Button
                  onClick={handleBookAppointment}
                  disabled={submitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium h-12 rounded-lg transition-all"
                >
                  {submitting ? "Processing..." : "Confirm Booking"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
