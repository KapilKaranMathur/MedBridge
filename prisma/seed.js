const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const pass = await bcrypt.hash("password123", 10);

  const patient = await prisma.user.upsert({
    where: { email: "patient@example.com" },
    update: {},
    create: {
      email: "patient@example.com",
      name: "Demo Patient",
      passwordHash: pass,
      role: "user",
    },
  });

  const doctor = await prisma.doctor.create({
    data: {
      name: "Dr Demo",
      specialization: "General Physician",
      city: "Delhi",
      experienceYears: 7,
      consultationFee: 500,
      qualification: "MBBS",
    },
  });

  const appointment = await prisma.appointment.create({
    data: {
      userId: patient.id,
      doctorId: doctor.id,
      dateTime: new Date(Date.now() + 1000 * 60 * 60 * 24),
      status: "BOOKED",
      notes: "Having fever and body ache",
    },
  });

  const record = await prisma.medicalRecord.create({
    data: {
      appointmentId: appointment.id,
      doctorId: doctor.id,
      patientId: patient.id,
      problem: "Fever, sore throat",
      prescription: "Paracetamol 500mg twice daily for 3 days",
      status: "OPEN",
    },
  });

  await prisma.followUp.create({
    data: {
      medicalRecordId: record.id,
      authorId: patient.id,
      authorRole: "patient",
      message: "I still have fever after 2 days",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });