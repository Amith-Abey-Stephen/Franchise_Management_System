import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Commission from '@/lib/models/Commission';
import Franchise from '@/lib/models/Franchise';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';
import { calculateCommission } from '@/lib/commissions';

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    if (!['admin', 'system-superadmin'].includes(user.role)) return forbiddenResponse();

    const body = await req.json();
    const { month } = body;

    await connectToDatabase();
    let franchiseQuery: any = { status: 'approved' };
    if (user.role !== 'system-superadmin') {
      franchiseQuery.organizationId = user.organizationId;
    }

    const franchises = await Franchise.find(franchiseQuery);
    const results = [];

    for (const franchise of franchises) {
      const existing = await Commission.findOne({ franchiseId: franchise._id, month });
      if (!existing) {
        const { totalSales, commissionAmount } = await calculateCommission(franchise._id.toString(), month);
        const commission = await Commission.create({
          franchiseId: franchise._id,
          organizationId: franchise.organizationId,
          month,
          totalSales,
          commissionAmount,
        });
        results.push(commission);
      }
    }

    return NextResponse.json({
      message: `Generated ${results.length} new commission reports for your network.`,
      data: results,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
