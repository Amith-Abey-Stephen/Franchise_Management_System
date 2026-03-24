import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { name, email, password, role, franchiseId } = await req.json();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      franchiseId,
      isApproved: role === 'admin' ? true : false,
    });

    if (user) {
      return NextResponse.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        franchiseId: user.franchiseId,
        isApproved: user.isApproved,
        token: generateToken(user._id.toString()),
      }, { status: 201 });
    } else {
      return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
