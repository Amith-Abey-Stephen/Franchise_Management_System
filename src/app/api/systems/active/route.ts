import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Organization from '@/lib/models/Organization';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const systems = await Organization.find({ status: 'active' }).select('name _id');
    return NextResponse.json(systems);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
