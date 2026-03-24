import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Organization from '@/lib/models/Organization';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    if (user.role !== 'system-superadmin') return forbiddenResponse();

    await connectToDatabase();
    const orgs = await Organization.find({}).populate('ownerId', 'name email');
    return NextResponse.json(orgs);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
