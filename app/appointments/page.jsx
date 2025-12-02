"use client";
import { useEffect, useState } from "react";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    const res = await fetch("/api/appointments");
    const json = await res.json();
    setAppointments(json.data || []);
  }

  async function cancel(id) {
    await fetch(`/api/appointments/${id}`, { method: "DELETE" });
    loadAppointments();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Appointments</h1>

      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((a) => (
            <div key={a.id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-semibold">{a.doctor.name}</h2>
              <p>{a.doctor.specialization}</p>
              <p>Date: {new Date(a.dateTime).toLocaleString()}</p>
              <p>Status: {a.status}</p>

              <button
                onClick={() => cancel(a.id)}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
