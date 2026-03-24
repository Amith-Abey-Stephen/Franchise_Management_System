import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Franchise from '@/lib/models/Franchise';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';
import { logActivity } from '@/lib/activity';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    if (!['admin', 'system-superadmin'].includes(user.role)) return forbiddenResponse();

    await connectToDatabase();
    const query: any = { _id: id };
    if (user.role !== 'system-superadmin') {
      query.organizationId = user.organizationId;
    }

    const body = await req.json();
    const franchise = await Franchise.findOneAndUpdate(query, body, { new: true });
    if (!franchise) return NextResponse.json({ message: 'Franchise not found' }, { status: 404 });

    return NextResponse.json(franchise);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    if (!['admin', 'system-superadmin'].includes(user.role)) return forbiddenResponse();

    await connectToDatabase();
    const query: any = { _id: id };
    if (user.role !== 'system-superadmin') {
      query.organizationId = user.organizationId;
    }

    const franchise = await Franchise.findOneAndDelete(query);
    if (!franchise) return NextResponse.json({ message: 'Franchise not found' }, { status: 404 });

    await logActivity(
      user._id.toString(),
      'Store Removed',
      `${franchise.franchiseName} has been disconnected from the network.`,
      'franchise',
      user.organizationId?.toString() || null,
      null
    );

    return NextResponse.json({ message: 'Franchise removed from network' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
