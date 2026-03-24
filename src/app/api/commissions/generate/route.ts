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
    const { franchiseId, month } = body;

    await connectToDatabase();
    const franchise = await Franchise.findById(franchiseId);
    if (!franchise) return NextResponse.json({ message: 'Node not found' }, { status: 404 });

    const existing = await Commission.findOne({ franchiseId, month });
    if (existing) {
      return NextResponse.json({ message: 'Commission for this month already generated' }, { status: 400 });
    }

    const { totalSales, commissionAmount } = await calculateCommission(franchiseId, month);

    const commission = await Commission.create({
      franchiseId,
      organizationId: franchise.organizationId,
      month,
      totalSales,
      commissionAmount,
    });

    return NextResponse.json(commission, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
