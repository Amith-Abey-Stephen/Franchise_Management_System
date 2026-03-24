import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    await connectToDatabase();
    let query: any = {};
    if (user.role !== 'admin' && user.role !== 'system-superadmin') {
      query = { franchiseId: user.franchiseId };
    } else if (user.role === 'admin') {
        query = { organizationId: user.organizationId };
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      ...query,
      status: 'completed',
      createdAt: { $gte: sixMonthsAgo },
    });

    const statsMap: any = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${monthNames[d.getMonth()]}`;
      statsMap[key] = { name: key, sales: 0, count: 0 };
    }

    orders.forEach((order: any) => {
      const date = new Date(order.createdAt);
      const key = monthNames[date.getMonth()];
      if (statsMap[key]) {
        statsMap[key].sales += order.totalAmount;
        statsMap[key].count += 1;
      }
    });

    const result = Object.values(statsMap).reverse();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
