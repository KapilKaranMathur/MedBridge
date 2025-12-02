import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id: paramId } = await params;
    const id = Number(paramId);
    const body = await request.json();
    const { message } = body;
    if (!message) return NextResponse.json({ message: "Message required" }, { status: 400 });

    const record = await prisma.medicalRecord.findUnique({ where: { id } });
    if (!record) return NextResponse.json({ message: "Record not found" }, { status: 404 });

    // Check if user is the patient or the doctor
    const doctor = user.role === "doctor" ? await prisma.doctor.findUnique({ where: { userId: user.id } }) : null;
    const isDoctor = doctor && record.doctorId === doctor.id;
    const isPatient = record.patientId === user.id;

    if (!isDoctor && !isPatient) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const followup = await prisma.followUp.create({
      data: {
        medicalRecordId: id,
        authorId: user.id,
        authorRole: user.role === "doctor" ? "doctor" : "patient",
        message,
      },
    });

    return NextResponse.json(followup, { status: 201 });
  } catch (err) {
    console.error("POST followup error:", err);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
