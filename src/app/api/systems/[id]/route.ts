import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Organization from '@/lib/models/Organization';
import User from '@/lib/models/User';
import Franchise from '@/lib/models/Franchise';
import Product from '@/lib/models/Product';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const user = await verifyAuth(req);
    if (!user || user.role !== 'system-superadmin') return forbiddenResponse();

    await connectToDatabase();
    const body = await req.json();
    const org = await Organization.findByIdAndUpdate(id, body, { new: true });
    if (!org) return NextResponse.json({ message: 'System not found' }, { status: 404 });

    return NextResponse.json(org);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const user = await verifyAuth(req);
    if (!user || user.role !== 'system-superadmin') return forbiddenResponse();

    await connectToDatabase();
    const orgId = id;
    const org = await Organization.findById(orgId);
    if (!org) return NextResponse.json({ message: 'System not found' }, { status: 404 });

    await User.deleteMany({ organizationId: orgId });
    await Franchise.deleteMany({ organizationId: orgId });
    await Product.deleteMany({ organizationId: orgId });
    await org.deleteOne();

    return NextResponse.json({ message: 'System and all its associated data permanently removed.' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
