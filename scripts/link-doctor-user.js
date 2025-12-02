const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const doctorName = "doc";
  const doctorEmail = "doc@gmail.com";

  const user = await prisma.user.findUnique({ where: { email: doctorEmail } });
  if (!user) throw new Error("User not found: " + doctorEmail);

  const doctor = await prisma.doctor.findFirst({ where: { name: doctorName } });
  if (!doctor) throw new Error("Doctor not found: " + doctorName);

  await prisma.doctor.update({
    where: { id: doctor.id },
    data: { userId: user.id },
  });

  console.log(`Linked Doctor ${doctor.id} -> User ${user.id}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
