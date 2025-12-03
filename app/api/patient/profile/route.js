import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    

    if (user.role && user.role !== "patient" && user.role !== "user") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const patient = await prisma.patient.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({ 
      patient: {
        ...patient,
        name: user.name,
        email: user.email,
      }
    });
  } catch (err) {
    console.error("GET /api/patient/profile error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    if (user.role && user.role !== "patient" && user.role !== "user") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { name, age, gender } = body;

    if (name) {
      await prisma.user.update({
        where: { id: user.id },
        data: { name },
      });
    }

    const patient = await prisma.patient.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        age: age ? Number(age) : null,
        gender: gender || null,
      },
      update: {
        age: age ? Number(age) : undefined,
        gender: gender || undefined,
      },
    });

    return NextResponse.json({ patient: { ...patient, name: name || user.name } });
  } catch (err) {
    console.error("PATCH /api/patient/profile error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    if (user.role && user.role !== "patient" && user.role !== "user") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Cascade delete handled by database schema
    await prisma.user.delete({ where: { id: user.id } });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/patient/profile error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
