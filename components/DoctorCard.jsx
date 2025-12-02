import Link from "next/link";

export default function DoctorCard({ doctor }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm flex flex-col h-full">
      <div className="flex-1">
        <h3 className="text-lg font-medium">{doctor.name}</h3>
        <div className="text-sm text-gray-600">{doctor.specialization}</div>
        <div className="text-sm mt-2 text-gray-700">City: {doctor.city}</div>
        <div className="text-sm mt-1 text-gray-700">Experience: {doctor.experienceYears} yrs</div>
        <div className="text-sm mt-1 text-gray-700">Fee: ₹{doctor.consultationFee}</div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link href={`/doctors/${doctor.id}`} className="px-3 py-2 border rounded text-sm">
          View Details
        </Link>
        <Link href={`/doctors/${doctor.id}`} className="px-3 py-2 bg-blue-600 text-white rounded text-sm">
          Book
        </Link>
      </div>
    </div>
  );
}
