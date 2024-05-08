import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PrismaClient } from '@prisma/client';

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const db = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = db;
