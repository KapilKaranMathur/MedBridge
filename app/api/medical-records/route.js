import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { appointmentId, patientId, problem = "", prescription = "" } = body;

    if (!appointmentId || !patientId) {
      return NextResponse.json({ error: "Missing appointmentId or patientId" }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({ where: { id: Number(appointmentId) } });
    if (!appointment || appointment.doctorId == null) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } });
    if (!doctor || appointment.doctorId !== doctor.id) {
      return NextResponse.json({ error: "Not allowed for this appointment" }, { status: 403 });
    }

    const record = await prisma.medicalRecord.create({
      data: {
        appointmentId: Number(appointmentId),
        doctorId: doctor.id,
        patientId,
        problem,
        prescription,
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (err) {
    console.error("POST /api/medical-records error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
