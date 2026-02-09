'use client';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    const users = rows as any[];
    if (users.length === 0) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const user = users[0];
    
    if (!user.password) {
      console.error(`Authentication error: User ${email} found but has no password.`);
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const hash = user.password.replace(/^\$2y\$/, '$2a\$');
    const isPasswordValid = await bcrypt.compare(password, hash);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Don't send the password hash to the client
    const { password: _, ...userToReturn } = user;

    return NextResponse.json(userToReturn);

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
