import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const city = searchParams.get("city") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "6", 10);
    const sortBy = searchParams.get("sortBy") || "experience";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * pageSize;

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { specialization: { contains: search, mode: "insensitive" } },
      ];
    }

    if (city) {
      where.city = { contains: city, mode: "insensitive" };
    }

    const orderBy = {};
    if (sortBy === "fee") {
      orderBy.consultationFee = sortOrder;
    } else {
      orderBy.experienceYears = sortOrder;
    }

    const [doctors, totalCount] = await Promise.all([
      prisma.doctor.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
      }),
      prisma.doctor.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return NextResponse.json({
      data: doctors,
      pagination: {
        page,
        pageSize,
        totalPages,
        totalCount,
      },
    });
  } catch (error) {
    console.error("GET /api/doctors error:", error);
    return NextResponse.json(
      { message: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      specialization,
      city,
      experienceYears,
      consultationFee,
    } = body;

    if (!name || !specialization || !city) {
      return NextResponse.json(
        { message: "Name, specialization & city are required" },
        { status: 400 }
      );
    }

    const doctor = await prisma.doctor.create({
      data: {
        name,
        specialization,
        city,
        experienceYears: Number(experienceYears || 0),
        consultationFee: Number(consultationFee || 0),
      },
    });

    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    console.error("POST /api/doctors error:", error);
    return NextResponse.json(
      { message: "Failed to create doctor" },
      { status: 500 }
    );
  }
}