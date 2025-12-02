const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const doctor = await prisma.doctor.findFirst();
  if (doctor) {
    console.log(`Doctor ID: ${doctor.id}`);
  } else {
    console.log("No doctors found");
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
