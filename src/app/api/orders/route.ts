import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import { verifyAuth, unauthorizedResponse } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    await connectToDatabase();
    let query: any = {};
    if (user.role === 'franchisee' || user.role === 'staff') {
      query = { franchiseId: user.franchiseId };
    } else if (user.role === 'admin') {
      query = { organizationId: user.organizationId };
    }

    const orders = await Order.find(query)
      .populate('franchiseId', 'franchiseName')
      .populate('products.productId', 'name')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return unauthorizedResponse();

    if (!user.franchiseId) {
      return NextResponse.json({ message: 'User does not belong to a franchise.' }, { status: 400 });
    }

    const body = await req.json();
    const { products } = body;

    await connectToDatabase();
    let calculatedTotal = 0;
    const processedProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json({ message: `Product ${item.productId} not found` }, { status: 404 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ message: `Insufficient stock for ${product.name}` }, { status: 400 });
      }

      calculatedTotal += product.basePrice * item.quantity;
      processedProducts.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.basePrice,
      });

      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      franchiseId: user.franchiseId,
      products: processedProducts,
      totalAmount: calculatedTotal,
      status: 'completed',
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
