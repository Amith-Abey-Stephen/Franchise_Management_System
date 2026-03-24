import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Franchise from '@/lib/models/Franchise';
import User from '@/lib/models/User';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { franchiseName, region, ownerEmail, ownerPassword, ownerName, organizationId } = body;

    if (!organizationId) {
      return NextResponse.json({ message: 'Franchise system must be specified' }, { status: 400 });
    }

    await connectToDatabase();
    const userExists = await User.findOne({ email: ownerEmail });
    if (userExists) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
    }

    const newUser = await User.create({
      name: ownerName || franchiseName,
      email: ownerEmail,
      password: ownerPassword,
      role: 'franchisee',
      organizationId,
      isApproved: false,
    });

    const franchise = await Franchise.create({
      franchiseName,
      ownerId: newUser._id,
      region,
      commissionPercentage: 10,
      status: 'pending',
      organizationId,
    });

    newUser.franchiseId = franchise._id;
    await newUser.save();

    return NextResponse.json({ message: 'Application submitted to System successfully.' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
