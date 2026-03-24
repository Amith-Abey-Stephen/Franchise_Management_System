import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/lib/models/User';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    if (!['franchisee', 'admin'].includes(user.role)) return forbiddenResponse();

    await connectToDatabase();
    const staff = await User.findById(id);
    if (!staff || staff.franchiseId?.toString() !== user.franchiseId?.toString()) {
      return NextResponse.json({ message: 'Staff member not found' }, { status: 404 });
    }

    const body = await req.json();
    staff.name = body.name || staff.name;
    staff.email = body.email || staff.email;
    if (body.password) {
      staff.password = body.password;
    }

    const updatedStaff = await staff.save();
    return NextResponse.json({
      _id: updatedStaff._id,
      name: updatedStaff.name,
      email: updatedStaff.email,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    if (!['franchisee', 'admin'].includes(user.role)) return forbiddenResponse();

    await connectToDatabase();
    const staff = await User.findById(id);
    if (!staff || staff.franchiseId?.toString() !== user.franchiseId?.toString()) {
      return NextResponse.json({ message: 'Staff member not found' }, { status: 404 });
    }

    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Staff member removed' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
