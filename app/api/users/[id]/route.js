import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(_request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const id = params.id;
    if (user.id !== id && user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.followUp.deleteMany({ where: { authorId: id } });

    const records = await prisma.medicalRecord.findMany({ where: { patientId: id } });
    for (const r of records) {
      await prisma.followUp.deleteMany({ where: { medicalRecordId: r.id } });
      await prisma.medicalRecord.delete({ where: { id: r.id } });
    }

    await prisma.appointment.deleteMany({ where: { userId: id } });

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "Account and related data deleted" });
  } catch (err) {
    console.error("DELETE user", err);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
