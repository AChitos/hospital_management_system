import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../utils/db';

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
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '7d',
  });
}

// Verify JWT token
export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
}

// Authenticate user by email and password
export async function authenticateUser(email: string, password: string) {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  return user;
}

// Get user by ID
export async function getUserById(userId: string) {
  return await db.user.findUnique({
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
}
