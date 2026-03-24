import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Franchise from '@/lib/models/Franchise';
import User from '@/lib/models/User';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';
import { logActivity } from '@/lib/activity';

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    // Check permissions
    if (!['admin', 'system-superadmin', 'franchisee'].includes(user.role)) {
      return forbiddenResponse();
    }

    await connectToDatabase();
    let query: any = {};
    if (user.role !== 'system-superadmin') {
      query.organizationId = user.organizationId;
    }

    const franchises = await Franchise.find(query)
      .populate('ownerId', 'name email')
      .populate('parentId', 'franchiseName')
      .populate('organizationId', 'name');

    return NextResponse.json(franchises);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    if (!['admin', 'franchisee'].includes(user.role)) {
      return forbiddenResponse();
    }

    const body = await req.json();
    const { franchiseName, region, commissionPercentage, ownerEmail, ownerPassword, ownerName } = body;

    const orgId = user.organizationId;
    if (!orgId) return NextResponse.json({ message: 'Franchise system not identified' }, { status: 400 });

    let assignedOwnerId = user._id;

    await connectToDatabase();
    if (ownerEmail && ownerPassword) {
      const userExists = await User.findOne({ email: ownerEmail });
      if (userExists) return NextResponse.json({ message: 'Operator email already registered' }, { status: 400 });

      const newUser = await User.create({
        name: ownerName || franchiseName,
        email: ownerEmail,
        password: ownerPassword,
        role: 'franchisee',
        organizationId: orgId,
        isApproved: true,
      });
      assignedOwnerId = newUser._id;
    }

    const franchise = await Franchise.create({
      franchiseName,
      ownerId: assignedOwnerId,
      region,
      commissionPercentage: commissionPercentage || 10,
      status: user.role === 'admin' ? 'approved' : 'pending',
      organizationId: orgId,
      parentId: user.role === 'franchisee' ? user.franchiseId : null,
    });

    if (ownerEmail && ownerPassword) {
      await User.findByIdAndUpdate(assignedOwnerId, { franchiseId: franchise._id });
    }

    await logActivity(
      user._id.toString(),
      user.role === 'admin' ? 'Store Created' : 'Branch Requested',
      `${franchiseName} in ${region} has been added to the mesh.`,
      'franchise',
      orgId.toString(),
      franchise._id.toString()
    );

    return NextResponse.json(franchise, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
