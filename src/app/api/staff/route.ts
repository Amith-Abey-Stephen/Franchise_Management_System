import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    if (!['franchisee', 'admin'].includes(user.role)) return forbiddenResponse();

    await connectToDatabase();
    const staff = await User.find({
      role: 'staff',
      franchiseId: user.franchiseId,
    }).select('-password');

    return NextResponse.json(staff);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    if (!['franchisee'].includes(user.role)) return forbiddenResponse();

    const body = await req.json();
    const { name, email, password } = body;

    await connectToDatabase();
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const staff = await User.create({
      name,
      email,
      password,
      role: 'staff',
      franchiseId: user.franchiseId,
      isApproved: true,
    });

    return NextResponse.json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
