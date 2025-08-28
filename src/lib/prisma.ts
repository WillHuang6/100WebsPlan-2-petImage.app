import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 创建一个安全的 Prisma 客户端，在构建时使用临时配置
let prismaClient: PrismaClient;

try {
  prismaClient = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
  });
} catch (error) {
  console.warn('Failed to initialize Prisma client:', error);
  // 在构建时或无数据库环境中创建一个基础客户端
  prismaClient = new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? prismaClient;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}