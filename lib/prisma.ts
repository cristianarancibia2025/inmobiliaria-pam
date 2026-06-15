import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        // Si Vercel no encuentra la variable durante la construcción, usa esta falsa para no bloquearse.
        // Cuando la página esté en vivo, usará tu enlace real de Neon.
        url: process.env.DATABASE_URL || "postgresql://falso:falso@localhost:5432/falso_db",
      },
    },
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;