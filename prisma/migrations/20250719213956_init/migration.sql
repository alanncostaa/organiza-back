/*
  Warnings:

  - Added the required column `iduser` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "iduser" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_iduser_fkey" FOREIGN KEY ("iduser") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
