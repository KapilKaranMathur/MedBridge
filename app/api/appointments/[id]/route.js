import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(request, { params }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const id = parseInt(params.id, 10);
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

export async function DELETE(_request, { params }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const id = parseInt(params.id, 10);

    const existing = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== currentUser.id) {
      return NextResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Appointment cancelled" });
  } catch (error) {
    console.error("DELETE /api/appointments/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
