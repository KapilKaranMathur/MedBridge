"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, MapPin, Stethoscope, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function BookAppointmentPage() {
  const params = useParams();
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState();
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await fetch(`/api/doctors/${params.id}`);
        if (!res.ok) throw new Error("Doctor not found");
        const json = await res.json();
        setDoctor(json);
      } catch (err) {
        setError("Failed to load doctor details");
      } finally {
        setLoading(false);
      }
    }
    fetchDoctor();
  }, [params.id]);

  async function handleBook() {
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
          doctorId: doctor.id,
          dateTime: dateTime.toISOString(),
          notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to book appointment");
      }

      router.push("/patient/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 flex justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-2xl px-6">
          <div className="h-8 bg-white/10 rounded w-1/3"></div>
          <div className="h-64 bg-white/5 rounded-xl border border-white/10"></div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background pt-24 flex flex-col items-center justify-center text-white">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold">Doctor Not Found</h1>
        <Button variant="link" onClick={() => router.back()} className="mt-4 text-emerald-400">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 pt-20 md:pt-24 relative overflow-hidden">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-1 space-y-6">
            <Card className="bg-white/5 border-white/10 overflow-hidden">
              <div className="h-32 bg-emerald-900/20 relative">
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                   <div className="h-20 w-20 rounded-full bg-black border-4 border-black flex items-center justify-center text-2xl font-bold text-white bg-emerald-600">
                      {doctor.name.charAt(0)}
                   </div>
                </div>
              </div>
              <CardContent className="pt-12 text-center pb-6">
                <h2 className="text-xl font-bold text-white">{doctor.name}</h2>
                <Badge variant="secondary" className="mt-2 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  {doctor.specialization}
                </Badge>
                
                <div className="mt-6 space-y-3 text-sm text-left">
                  <div className="flex items-center text-gray-400">
                    <Stethoscope className="h-4 w-4 mr-3 text-emerald-500" />
                    {doctor.qualification}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <MapPin className="h-4 w-4 mr-3 text-emerald-500" />
                    {doctor.city}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Clock className="h-4 w-4 mr-3 text-emerald-500" />
                    {doctor.experienceYears} Years Experience
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Book Appointment</CardTitle>
                <CardDescription>Select a date and time for your consultation.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-white">Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-black/20 border-white/10 text-white hover:bg-white/10",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-black border-white/10 text-white">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                        className="bg-black text-white rounded-md border border-white/10"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Select Time</Label>
                  <Input 
                    type="time" 
                    className="bg-black/20 border-white/10 text-white"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Notes (Optional)</Label>
                  <Textarea 
                    placeholder="Briefly describe your problem..." 
                    className="bg-black/20 border-white/10 text-white min-h-[100px]"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-11" 
                  onClick={handleBook}
                  disabled={submitting}
                >
                  {submitting ? "Confirming..." : "Confirm Booking"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
