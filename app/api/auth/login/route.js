import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {

    if (!process.env.JWT_SECRET) {
      console.error("CRITICAL: JWT_SECRET is missing");
      return NextResponse.json({ error: "Server Error: JWT_SECRET is missing in Vercel env vars" }, { status: 500 });
    }
    if (!process.env.DATABASE_URL) {
      console.error("CRITICAL: DATABASE_URL is missing");
      return NextResponse.json({ error: "Server Error: DATABASE_URL is missing in Vercel env vars" }, { status: 500 });
    }

    const { email, password } = await req.json();


    let user;
    try {
      user = await prisma.user.findUnique({ where: { email } });
    } catch (dbError) {
      console.error("DB ERROR:", dbError);
      return NextResponse.json({ error: `Database Error: ${dbError.message}` }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials (User not found)" }, { status: 401 });
    }


    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid credentials (Password mismatch)" }, { status: 401 });
    }


    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
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
    return NextResponse.json({ 
      error: `Unexpected Login Error: ${err.message}` 
    }, { status: 500 });
  }
}
