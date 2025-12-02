import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const id = Number(params.id);

    const record = await prisma.medicalRecord.findUnique({
      where: { id },
      include: { doctor: true, patient: true, followUps: { orderBy: { createdAt: "asc" } } },
    });
    if (!record) return NextResponse.json({ message: "Not found" }, { status: 404 });

    if (user.role === "user" && record.patientId !== user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(record);
  } catch (err) {
    console.error("GET /api/medical-records/[id]", err);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const id = Number(params.id);
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

export async function DELETE(_request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const id = Number(params.id);
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
