import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }
    
    // In a real application, you would:
    // 1. Check if the user with this email exists.
    // 2. Generate a unique, secure password reset token.
    // 3. Store the token and its expiry date in the database, associated with the user.
    // 4. Send an email to the user with a link containing the token, e.g., /reset-password?token=...
    
    console.log(`Password reset requested for: ${email}. In a real app, an email would be sent.`);

    // Always return a success response to prevent email enumeration attacks.
    return NextResponse.json({ message: 'If a user with that email exists, a password reset link has been sent.' }, { status: 200 });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
