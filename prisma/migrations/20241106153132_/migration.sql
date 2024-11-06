/*
  Warnings:

  - You are about to alter the column `betId` on the `Aposta` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Bet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Bet` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Aposta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ingressoId" INTEGER NOT NULL,
    "pontos" INTEGER NOT NULL,
    "betId" INTEGER NOT NULL,
    CONSTRAINT "Aposta_betId_fkey" FOREIGN KEY ("betId") REFERENCES "Bet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Aposta" ("betId", "id", "ingressoId", "pontos") SELECT "betId", "id", "ingressoId", "pontos" FROM "Aposta";
DROP TABLE "Aposta";
ALTER TABLE "new_Aposta" RENAME TO "Aposta";
CREATE TABLE "new_Bet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "fullName" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    CONSTRAINT "Bet_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Bet" ("companyName", "eventId", "fullName", "id", "userId") SELECT "companyName", "eventId", "fullName", "id", "userId" FROM "Bet";
DROP TABLE "Bet";
ALTER TABLE "new_Bet" RENAME TO "Bet";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
