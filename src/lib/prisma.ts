import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 创建PrismaClient实例，确保全局单例
function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
}

// 声明全局prisma实例
declare global {
  var __prisma: PrismaClient | undefined;
}

// 在开发环境使用全局变量避免热重载时重复初始化
// 在生产环境直接创建新实例
export const prisma = globalThis.__prisma ?? createPrismaClient();

// 在开发环境将实例保存到全局变量
if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

// 确保在应用关闭时断开连接
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}