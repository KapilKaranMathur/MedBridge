ALTER TABLE "Doctor" ADD COLUMN     "profilePhoto" TEXT,
ADD COLUMN     "qualification" TEXT;

CREATE TABLE "MedicalRecord" (
    "id" SERIAL NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "patientId" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "prescription" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FollowUp" (
    "id" SERIAL NOT NULL,
    "medicalRecordId" INTEGER NOT NULL,
    "authorId" TEXT NOT NULL,
    "authorRole" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FollowUp_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MedicalRecord_appointmentId_key" ON "MedicalRecord"("appointmentId");

CREATE INDEX "FollowUp_medicalRecordId_idx" ON "FollowUp"("medicalRecordId");

CREATE INDEX "FollowUp_authorId_idx" ON "FollowUp"("authorId");

ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "MedicalRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "FollowUp" ADD CONSTRAINT "FollowUp_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
