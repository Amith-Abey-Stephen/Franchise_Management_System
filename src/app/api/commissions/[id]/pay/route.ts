import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Commission from '@/lib/models/Commission';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    if (!['admin', 'system-superadmin'].includes(user.role)) return forbiddenResponse();

    await connectToDatabase();
    const commission = await Commission.findById(id);
    if (!commission) return NextResponse.json({ message: 'Commission report not found' }, { status: 404 });

    commission.paidStatus = true;
    // @ts-ignore
    commission.paidDate = Date.now();
    await commission.save();

    return NextResponse.json(commission);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
