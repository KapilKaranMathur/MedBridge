import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(request, { params }) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: paramId } = await params;
    const id = parseInt(paramId, 10);
    const body = await request.json();
    const { status, dateTime, notes } = body;

    const existing = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== currentUser.id) {
      return NextResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(dateTime && { dateTime: new Date(dateTime) }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        doctor: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/appointments/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: paramId } = await params;
    const id = Number(paramId);

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { doctor: true },
    });

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    // Authorization check
    let isAuthorized = false;

    if (user.role === "doctor") {
      // Check if the doctor owns this appointment
      const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } });
      if (doctor && doctor.id === appointment.doctorId) {
        isAuthorized = true;
      }
    } else {
      // Check if the patient owns this appointment
      if (appointment.userId === user.id) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Appointment cancelled" });
  } catch (err) {
    console.error("DELETE /api/appointments/[id] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
