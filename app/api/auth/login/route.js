import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: "1d" }
    );

    let redirectPath = "/";

    if (user.role === "doctor") {
      redirectPath = "/doctor/dashboard";
    } else if (user.role === "patient" || user.role === "user") {
      redirectPath = "/patient/dashboard";
    }

    const res = NextResponse.json({ success: true, redirectUrl: redirectPath });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24
    });

    return res;
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    // Return the actual error message to help debugging
    return NextResponse.json({ 
      error: `Login failed: ${err.message}` 
    }, { status: 500 });
  }
}
