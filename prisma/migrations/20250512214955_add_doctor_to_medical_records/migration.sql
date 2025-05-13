-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MedicalRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recordDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "diagnosis" TEXT NOT NULL,
    "symptoms" TEXT,
    "notes" TEXT,
    "vitalSigns" TEXT,
    "treatmentPlan" TEXT,
    "followUpDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT,
    CONSTRAINT "MedicalRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MedicalRecord_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_MedicalRecord" ("createdAt", "diagnosis", "followUpDate", "id", "notes", "patientId", "recordDate", "symptoms", "treatmentPlan", "updatedAt", "vitalSigns") SELECT "createdAt", "diagnosis", "followUpDate", "id", "notes", "patientId", "recordDate", "symptoms", "treatmentPlan", "updatedAt", "vitalSigns" FROM "MedicalRecord";
DROP TABLE "MedicalRecord";
ALTER TABLE "new_MedicalRecord" RENAME TO "MedicalRecord";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
