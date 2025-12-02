import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const id = Number(params.id);
    const body = await request.json();
    const { message } = body;
    if (!message) return NextResponse.json({ message: "Message required" }, { status: 400 });

    const record = await prisma.medicalRecord.findUnique({ where: { id } });
    if (!record) return NextResponse.json({ message: "Record not found" }, { status: 404 });

    if (user.role === "user" && record.patientId !== user.id) {
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
    console.error("POST followup", err);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
