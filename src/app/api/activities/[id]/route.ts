import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Activity from '@/lib/models/Activity';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    await connectToDatabase();
    const activity = await Activity.findByIdAndDelete(id);
    if (!activity) return NextResponse.json({ message: 'Activity not found' }, { status: 404 });

    return NextResponse.json({ message: 'Activity dismissed from mesh' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
