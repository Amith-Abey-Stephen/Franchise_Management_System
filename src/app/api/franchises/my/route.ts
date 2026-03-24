import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Franchise from '@/lib/models/Franchise';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    await connectToDatabase();
    const franchiseId = user.franchiseId;
    const query: any = { organizationId: user.organizationId };

    let franchise;
    if (franchiseId) {
      franchise = await Franchise.findOne({ ...query, _id: franchiseId }).populate('ownerId', 'name email');
    } else {
      franchise = await Franchise.findOne({ ...query, ownerId: user._id }).populate('ownerId', 'name email');
    }

    if (!franchise) return NextResponse.json({ message: 'Franchise node not found' }, { status: 404 });
    return NextResponse.json(franchise);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
