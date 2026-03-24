import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyAuth, unauthorizedResponse, generateToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = await verifyAuth(req);
    if (!authUser) return unauthorizedResponse();

    await connectToDatabase();
    const user = await User.findById(authUser._id);
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    const body = await req.json();
    user.name = body.name || user.name;
    user.email = body.email || user.email;
    if (body.password) {
      user.password = body.password;
    }

    const updatedUser = await user.save();
    return NextResponse.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isApproved: updatedUser.isApproved,
      token: generateToken(updatedUser._id.toString()),
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
