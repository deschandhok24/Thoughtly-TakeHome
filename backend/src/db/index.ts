import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); // uses pool from DATABASE_URL
export default prisma;