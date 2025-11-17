import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const SECRET = process.env.JWT_SECRET || "supersecretkey123";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ authenticated: false }, { status: 200 });

    const payload = jwt.verify(token, SECRET);
    if (!payload?.userId) return NextResponse.json({ authenticated: false }, { status: 200 });

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) return NextResponse.json({ authenticated: false }, { status: 200 });

    return NextResponse.json({ authenticated: true, user }, { status: 200 });
  } catch (err) {
    console.error("AUTH ME ERROR:", err);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
