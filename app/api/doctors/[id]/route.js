import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_request, { params }) {
  try {
    const id = parseInt(params.id, 10);

    const doctor = await prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      return NextResponse.json(
        { message: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(doctor);
  } catch (error) {
    console.error("GET /api/doctors/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch doctor" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    const body = await request.json();

    const {
      name,
      specialization,
      city,
      experienceYears,
      consultationFee,
    } = body;

    const updatedDoctor = await prisma.doctor.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(specialization !== undefined && { specialization }),
        ...(city !== undefined && { city }),
        ...(experienceYears !== undefined && {
          experienceYears: Number(experienceYears),
        }),
        ...(consultationFee !== undefined && {
          consultationFee: Number(consultationFee),
        }),
      },
    });

    return NextResponse.json(updatedDoctor);
  } catch (error) {
    console.error("PUT /api/doctors/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to update doctor" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const id = parseInt(params.id, 10);

    await prisma.doctor.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/doctors/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to delete doctor" },
      { status: 500 }
    );
  }
}
