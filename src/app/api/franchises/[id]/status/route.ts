import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Franchise from '@/lib/models/Franchise';
import User from '@/lib/models/User';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';
import { logActivity } from '@/lib/activity';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    if (!['admin', 'system-superadmin'].includes(user.role)) return forbiddenResponse();

    const body = await req.json();
    const { status, commissionPercentage } = body;

    await connectToDatabase();
    const query: any = { _id: id };
    if (user.role !== 'system-superadmin') {
      query.organizationId = user.organizationId;
    }

    const franchise = await Franchise.findOne(query);
    if (!franchise) return NextResponse.json({ message: 'Franchise not found' }, { status: 404 });

    franchise.status = status || franchise.status;
    if (commissionPercentage) franchise.commissionPercentage = commissionPercentage;

    if (status === 'approved') {
      await User.findByIdAndUpdate(franchise.ownerId, { isApproved: true });
    }

    const updatedFranchise = await franchise.save();

    await logActivity(
      user._id.toString(),
      `Branch ${status === 'approved' ? 'Approved' : 'Updated'}`,
      `${updatedFranchise.franchiseName} status set to ${updatedFranchise.status}.`,
      'franchise',
      user.organizationId?.toString() || null,
      updatedFranchise._id.toString()
    );

    return NextResponse.json(updatedFranchise);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
