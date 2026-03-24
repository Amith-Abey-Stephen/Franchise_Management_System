import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import { verifyAuth, unauthorizedResponse, forbiddenResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    await connectToDatabase();
    let query: any = {};
    if (user.role !== 'system-superadmin') {
      query = { organizationId: user.organizationId };
    }

    const products = await Product.find(query);
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    if (!['admin', 'franchisee'].includes(user.role)) return forbiddenResponse();

    const body = await req.json();
    const { name, category, basePrice, stock, franchiseId } = body;
    const orgId = user.organizationId;

    const assignedFranchiseId = user.role === 'admin' ? (franchiseId || null) : user.franchiseId;

    await connectToDatabase();
    const product = await Product.create({
      name,
      category,
      basePrice,
      stock,
      franchiseId: assignedFranchiseId,
      organizationId: orgId,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
