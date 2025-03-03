import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

const neon = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(neon);

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
export const prisma = new PrismaClient({ adapter });
