import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    console.log("GET /api/medical-records/[id] - User:", user?.id, user?.role);
    
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id: paramId } = await params;
    const id = Number(paramId);
    console.log("GET /api/medical-records/[id] - Record ID:", id);

    const record = await prisma.medicalRecord.findUnique({
      where: { id },
      include: { 
        doctor: { select: { id: true, name: true, specialization: true } },
        patient: { select: { id: true, name: true, email: true } },
        followUps: { orderBy: { createdAt: "asc" } }
      },
    });
    
    if (!record) {
      console.log("GET /api/medical-records/[id] - Record not found");
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    console.log("GET /api/medical-records/[id] - Record found:", {
      recordId: record.id,
      doctorId: record.doctorId,
      patientId: record.patientId
    });

    // Allow access for doctor or patient
    let doctor = null;
    if (user.role === "doctor") {
      doctor = await prisma.doctor.findUnique({ where: { userId: user.id } });
      console.log("GET /api/medical-records/[id] - Doctor profile:", doctor?.id);
    }

    const isDoctor = doctor && record.doctorId === doctor.id;
    const isPatient = record.patientId === user.id;
    
    console.log("GET /api/medical-records/[id] - Access check:", { isDoctor, isPatient });

    if (!isDoctor && !isPatient) {
      console.log("GET /api/medical-records/[id] - Forbidden");
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(record);
  } catch (err) {
    console.error("GET /api/medical-records/[id] error:", err);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== "doctor") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id: paramId } = await params;
    const id = Number(paramId);
    const body = await request.json();
    const { prescription, status } = body;

    const record = await prisma.medicalRecord.findUnique({ where: { id } });
    if (!record) return NextResponse.json({ message: "Not found" }, { status: 404 });

    // Verify doctor owns this record
    const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } });
    if (!doctor || record.doctorId !== doctor.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.medicalRecord.update({
      where: { id },
      data: {
        ...(prescription !== undefined && { prescription }),
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH /api/medical-records/[id]", err);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id: paramId } = await params;
    const id = Number(paramId);
    const body = await request.json();
    const { prescription, status } = body;

    const record = await prisma.medicalRecord.findUnique({ where: { id } });
    if (!record) return NextResponse.json({ message: "Not found" }, { status: 404 });

    if (user.role !== "doctor") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const updated = await prisma.medicalRecord.update({
      where: { id },
      data: {
        ...(prescription !== undefined && { prescription }),
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/medical-records/[id]", err);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id: paramId } = await params;
    const id = Number(paramId);
    const record = await prisma.medicalRecord.findUnique({ where: { id } });
    if (!record) return NextResponse.json({ message: "Not found" }, { status: 404 });

    if (user.role !== "doctor" && user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.followUp.deleteMany({ where: { medicalRecordId: id } });
    await prisma.medicalRecord.delete({ where: { id } });

    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE /api/medical-records/[id]", err);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
