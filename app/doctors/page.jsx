"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDoctors();
  }, [search]);

  async function loadDoctors() {
    const res = await fetch(`/api/doctors?search=${search}`);
    const json = await res.json();
    setDoctors(json.data);
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Find Doctors</h1>

      <input
        placeholder="Search doctor or specialization"
        className="border px-3 py-2 rounded w-full mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((d) => (
          <div key={d.id} className="border p-4 rounded shadow">
            <h2 className="font-semibold text-xl">{d.name}</h2>
            <p className="text-gray-600">{d.specialization}</p>
            <p className="text-gray-700 mt-2">City: {d.city}</p>
            <p className="text-gray-700">Fee: ₹{d.consultationFee}</p>

            <Link
              href={`/doctors/${d.id}`}
              className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded"
            >
              View & Book
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
