"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DoctorDetail({ params }) {
  const router = useRouter();
  const { id } = params;

  const [doctor, setDoctor] = useState(null);
  const [dateTime, setDateTime] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetch(`/api/doctors/${id}`)
      .then((res) => res.json())
      .then((data) => setDoctor(data));
  }, [id]);

  async function book() {
    const res = await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        doctorId: id,
        dateTime,
        notes,
      }),
    });

    if (res.ok) {
      router.push("/appointments");
    } else {
      alert("Booking failed");
    }
  }

  if (!doctor) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{doctor.name}</h1>
      <p className="text-gray-600">{doctor.specialization}</p>
      <p>City: {doctor.city}</p>
      <p>Experience: {doctor.experienceYears} years</p>
      <p>Fee: ₹{doctor.consultationFee}</p>

      <div className="mt-6">
        <h2 className="font-semibold mb-2">Book Appointment</h2>

        <input
          type="datetime-local"
          className="border px-3 py-2 rounded w-full mb-3"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />

        <textarea
          className="border px-3 py-2 rounded w-full"
          rows="3"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button
          onClick={book}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
