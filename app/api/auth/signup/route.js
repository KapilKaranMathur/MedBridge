import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      role,

      specialization,
      qualification,
      experienceYears,
      city,
      consultationFee,

      age,
      gender,
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!role || !["doctor", "patient"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role,
        },
      });

      if (role === "doctor") {
        await tx.doctor.create({
          data: {
            name,
            specialization,
            qualification,
            experienceYears: Number(experienceYears),
            city,
            consultationFee: Number(consultationFee || 0), // Default to 0 if not provided, though UI removed it
            userId: user.id,
          },
        });
      } else if (role === "patient") {
        await tx.patient.create({
          data: {
            age: Number(age) || null,
            gender: gender || null,
            userId: user.id,
          },
        });
      }
      
      return user;
    });

    return NextResponse.json(
      { message: "Signup successful", userId: result.id, role: result.role },
      { status: 201 }
    );
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
