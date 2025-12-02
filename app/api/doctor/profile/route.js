import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!user.role || String(user.role).toLowerCase() !== "doctor") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        userId: true,
        name: true,
        specialization: true,
        qualification: true,
        experienceYears: true,
        city: true,
        profilePhoto: true,
        createdAt: true
      }
    });

    if (!doctor) return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });

    return NextResponse.json({ doctor });
  } catch (err) {
    console.error("GET /api/doctor/profile error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!user.role || String(user.role).toLowerCase() !== "doctor") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { specialization, qualification, experienceYears, city, availabilityInfo, avatarUrl, availableSlots } = body;

    const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } });
    if (!doctor) return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });

    const updated = await prisma.doctor.update({
      where: { id: doctor.id },
      data: {
        specialization: specialization ?? doctor.specialization,
        qualification: qualification ?? doctor.qualification,
        experienceYears: typeof experienceYears === "number" ? experienceYears : doctor.experienceYears,
        city: city ?? doctor.city,
        profilePhoto: avatarUrl ?? doctor.profilePhoto,
      },
    });

    return NextResponse.json({ doctor: updated });
  } catch (err) {
    console.error("PATCH /api/doctor/profile error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!user.role || String(user.role).toLowerCase() !== "doctor") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } });
    if (!doctor) return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });

    // Cascade delete handled by database schema
    await prisma.user.delete({ where: { id: user.id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/doctor/profile error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
