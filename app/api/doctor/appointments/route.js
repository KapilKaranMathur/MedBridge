import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import jwt from "jsonwebtoken";

async function resolveUser(request) {
  try {
    const user = await getCurrentUser(request);
    if (user) return user;
  } catch (e) {
    console.debug("getCurrentUser failed:", e?.message ?? e);
  }

  try {
    const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
    if (!authHeader) return null;
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return null;
    const token = parts[1];

    const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || "devsecret";
    const payload = jwt.verify(token, secret);
    const userId = payload?.userId || payload?.id || payload?.sub;
    if (!userId) return null;

    const user = await prisma.user.findUnique({ where: { id: String(userId) } });
    return user;
  } catch (e) {
    console.debug("Token-based auth failed:", e?.message ?? e);
    return null;
  }
}

export async function GET(request) {
  try {
    const user = await resolveUser(request);

    if (!user || !user.role || String(user.role).toLowerCase() !== "doctor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const doctor = await prisma.doctor.findUnique({ where: { userId: user.id } });
    if (!doctor) {
      return NextResponse.json({ error: "Doctor profile not found" }, { status: 404 });
    }

    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || "1");
    const pageSize = Number(url.searchParams.get("pageSize") || "20");
    const search = (url.searchParams.get("search") || "").trim();
    const skip = Math.max(0, (page - 1)) * Math.max(1, pageSize);


    const where = { doctorId: doctor.id };
    if (search) {
      where.OR = [
        { notes: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [appointments, totalCount] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
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
