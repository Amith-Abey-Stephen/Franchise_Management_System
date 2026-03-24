import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Commission from '@/lib/models/Commission';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    await connectToDatabase();
    let query: any = {};
    if (user.role === 'system-superadmin') {
      query = {};
    } else if (user.role === 'admin') {
      query = { organizationId: user.organizationId };
    } else {
      query = { franchiseId: user.franchiseId };
    }

    const commissions = await Commission.find(query)
      .populate('franchiseId', 'franchiseName region')
      .sort({ month: -1 });

    return NextResponse.json(commissions);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
