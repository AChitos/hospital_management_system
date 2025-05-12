import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@/generated/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development';

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare password with hashed password
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(userId: string, email: string, role: string): string {
  return jwt.sign({ userId, email, role }, JWT_SECRET, {
    expiresIn: '7d',
  });
}

// Verify JWT token
export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

// Authenticate user by email and password
export async function authenticateUser(email: string, password: string) {
  const prisma = new PrismaClient();
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return { success: false, message: 'Invalid password' };
    }

    // Generate token with additional user info
    const token = generateToken(user.id, user.email, user.role);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, message: 'Authentication failed' };
  } finally {
    await prisma.$disconnect();
  }
}

// Get user by ID
export async function getUserById(userId: string) {
  const prisma = new PrismaClient();
  
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}
