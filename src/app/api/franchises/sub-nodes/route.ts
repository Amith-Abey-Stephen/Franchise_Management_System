import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Franchise from '@/lib/models/Franchise';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    if (!['franchisee', 'admin', 'system-superadmin'].includes(user.role)) return forbiddenResponse();

    await connectToDatabase();
    const subFranchises = await Franchise.find({
      organizationId: user.organizationId,
    }).populate('ownerId', 'name email');

    return NextResponse.json(subFranchises);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
