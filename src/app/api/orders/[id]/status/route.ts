import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    if (!['staff', 'franchisee', 'admin', 'system-superadmin'].includes(user.role)) return forbiddenResponse();

    const body = await req.json();
    const { status } = body;

    await connectToDatabase();
    const order = await Order.findById(id);
    if (!order) return NextResponse.json({ message: 'Order not found' }, { status: 404 });

    order.status = status;
    await order.save();

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
