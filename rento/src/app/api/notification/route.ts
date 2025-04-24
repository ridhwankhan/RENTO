import { NextResponse, NextRequest } from 'next/server';
import User from '@/models/user'; // Your Mongoose User model
import dbConnect from '@/lib/dbConnect';

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ notifications: user.notifications }, { status: 200 });
  } catch (error: any) {
    console.error('Notification API error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications', details: error.message }, { status: 500 });
  }
}



export async function PUT(req: NextRequest) {
  await dbConnect();

  const body = await req.json();
  const { id, notification } = body;

  if (!id || !notification) {
    return NextResponse.json({ message: 'User ID and notification are required.' }, { status: 400 });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $push: { notifications: notification } }, // <-- This pushes a new item to the array
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Error adding notification:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}