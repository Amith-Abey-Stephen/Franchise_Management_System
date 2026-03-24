import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Activity from '@/lib/models/Activity';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    await connectToDatabase();
    let query: any = {};
    if (user.role !== 'system-superadmin') {
      query.organizationId = user.organizationId;
    }

    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name role');

    return NextResponse.json(activities);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
