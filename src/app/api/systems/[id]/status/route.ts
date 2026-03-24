import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Organization from '@/lib/models/Organization';
import User from '@/lib/models/User';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';
import { logActivity } from '@/lib/activity';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const user = await verifyAuth(req);
    if (!user || user.role !== 'system-superadmin') return forbiddenResponse();

    const body = await req.json();
    const { status } = body;

    await connectToDatabase();
    const org = await Organization.findById(id);
    if (!org) return NextResponse.json({ message: 'System not found' }, { status: 404 });

    org.status = status || org.status;
    if (status === 'active') {
      await User.findByIdAndUpdate(org.ownerId, { isApproved: true });
    }

    await org.save();
    await logActivity(
      user._id.toString(),
      `System ${status === 'active' ? 'Activated' : 'Updated'}`,
      `${org.name} kernel set to ${status}.`,
      'organization',
      org._id.toString(),
      null
    );

    return NextResponse.json({ message: `System status updated to ${status}`, system: org });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
