import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import User from './models/User';
import connectToDatabase from './mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey123';

export async function verifyAuth(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    await connectToDatabase();
    const user = await User.findById(decoded.id).select('-password');
    return user;
  } catch (error) {
    return null;
  }
}

export function generateToken(id: string) {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: (process.env.JWT_EXPIRES_IN as any) || '1d',
  });
}

export function forbiddenResponse(message = 'Forbidden') {
  return NextResponse.json({ message }, { status: 403 });
}

export function unauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json({ message }, { status: 401 });
}
