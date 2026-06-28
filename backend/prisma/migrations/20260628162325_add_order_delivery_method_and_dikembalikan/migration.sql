-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'DIKEMBALIKAN';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryMethod" TEXT NOT NULL DEFAULT 'REGULAR';
