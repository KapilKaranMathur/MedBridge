// app/api/doctor/appointments/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || "1");
    const pageSize = Number(url.searchParams.get("pageSize") || "20");
    const search = (url.searchParams.get("search") || "").trim();
    const skip = (page - 1) * pageSize;

    let where = {};

    if (user.role === "doctor") {
      const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } });
      if (!doctor) {
        return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });
      }
      where.doctorId = doctor.id;
      if (search) {
        where.OR = [
          { notes: { contains: search, mode: "insensitive" } },
          { user: { name: { contains: search, mode: "insensitive" } } },
        ];
      }
    } else {
      // Patient or regular user
      where.userId = user.id;
      if (search) {
        where.OR = [
          { notes: { contains: search, mode: "insensitive" } },
          { doctor: { name: { contains: search, mode: "insensitive" } } },
        ];
      }
    }

    const [appointments, totalCount] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          doctor: { select: { id: true, name: true, specialization: true } },
          medicalRecord: { select: { id: true } },
        },
        orderBy: { dateTime: "asc" },
        skip,
        take: pageSize,
      }),
      prisma.appointment.count({ where }),
    ]);

    const data = appointments.map((a) => ({
      id: a.id,
      dateTime: a.dateTime,
      status: a.status,
      notes: a.notes,
      user: a.user ? { id: a.user.id, name: a.user.name, email: a.user.email } : null,
      doctor: a.doctor ? { id: a.doctor.id, name: a.doctor.name, specialization: a.doctor.specialization } : null,
      medicalRecordId: a.medicalRecord ? a.medicalRecord.id : null,
    }));

    return NextResponse.json({
      data,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (err) {
    console.error("GET /api/doctor/appointments error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { doctorId, dateTime, notes } = body;

    if (!doctorId || !dateTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: user.id,
        doctorId: parseInt(doctorId),
        dateTime: new Date(dateTime),
        status: "Scheduled",
        notes: notes || "",
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (err) {
    console.error("POST /api/appointments error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
