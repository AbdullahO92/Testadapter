// Minimal augmentation to satisfy tests without generated Prisma client types
declare module '@prisma/client' {
    interface PrismaClient {
        // Only what our tests touch
        user: {
            findUnique: (args: any) => Promise<any>
        }
    }
}

