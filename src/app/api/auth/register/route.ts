import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateToken } from '@/lib/auth/auth';
import { db } from '@/lib/utils/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      }
    });

    // Generate JWT token
    const token = generateToken(user.id);

    // Return the user without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
