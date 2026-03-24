import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Organization from '@/lib/models/Organization';
import User from '@/lib/models/User';
import { logActivity } from '@/lib/activity';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { systemName, adminName, adminEmail, adminPassword } = body;

    await connectToDatabase();
    const orgExists = await Organization.findOne({ name: systemName });
    if (orgExists) return NextResponse.json({ message: 'System name already taken' }, { status: 400 });

    const userExists = await User.findOne({ email: adminEmail });
    if (userExists) return NextResponse.json({ message: 'Admin email already registered' }, { status: 400 });

    const org = await Organization.create({
      name: systemName,
      status: 'pending',
    });

    const user = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      organizationId: org._id,
      isApproved: false,
    });

    org.ownerId = user._id;
    await org.save();

    await logActivity(
      user._id.toString(),
      'System Registered',
      `${systemName} has submitted an application for brand status.`,
      'organization',
      org._id.toString(),
      null
    );

    return NextResponse.json({
      message: 'Application for Franchise System submitted to Super Admin for approval.',
      system: org,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
