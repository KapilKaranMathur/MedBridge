"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);


  async function fetchDoctorProfile() {
    const res = await fetch("/api/doctor/profile");
    if (res.ok) {
      const data = await res.json();
      setDoctor(data.doctor);
    }
  }

  async function fetchAppointments() {
    const res = await fetch("/api/doctor/appointments");
    if (res.ok) {
      const data = await res.json();
      setAppointments(data);
    }
  }

  useEffect(() => {
    async function load() {
      await fetchDoctorProfile();
      await fetchAppointments();
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  if (!doctor)
    return (
      <div className="p-6 text-red-500">
        Cannot load doctor profile. Please re-login.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card className="shadow">
        <CardHeader>
          <CardTitle className="text-xl">Doctor Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Name:</strong> {doctor.name}</p>
            <p><strong>Specialization:</strong> {doctor.specialization}</p>
            <p><strong>Qualification:</strong> {doctor.qualification || "N/A"}</p>
            <p><strong>Experience:</strong> {doctor.experienceYears} years</p>
            <p><strong>City:</strong> {doctor.city}</p>
            <p><strong>Consultation Fee:</strong> ₹{doctor.consultationFee}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow">
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p>No upcoming appointments</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((app) => (
                <Card key={app.id} className="p-4 border">
                  <p><strong>Patient:</strong> {app.user.name}</p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(app.dateTime).toLocaleString()}
                  </p>
                  <p><strong>Status:</strong> {app.status}</p>

                  <Button
                    className="mt-2"
                    onClick={() => {
                      window.location.href = `/records/${app.medicalRecordId}`;
                    }}
                  >
                    Open Medical Record
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
