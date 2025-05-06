import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Get notifications for a user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("rento");

    const notifications = await db.collection("notifications")
      .find({ userId })
      .sort({ timestamp: -1 })
      .toArray();

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// Create a new notification
export async function POST(request: Request) {
  try {
    const notification = await request.json();

    // Validate required fields
    if (!notification.userId || !notification.type || !notification.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("rento");

    // Add notification to database
    const newNotification = {
      ...notification,
      read: false,
      timestamp: new Date().toISOString()
    };

    const result = await db.collection("notifications").insertOne(newNotification);

    return NextResponse.json({
      success: true,
      notificationId: result.insertedId.toString()
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

// Mark notifications as read
export async function PUT(request: Request) {
  try {
    const { notificationIds } = await request.json();

    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      return NextResponse.json(
        { error: 'Notification IDs array is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("rento");

    // Convert string IDs to ObjectIds
    const objectIds = notificationIds.map(id => new ObjectId(id));

    // Update notifications to mark as read
    const result = await db.collection("notifications").updateMany(
      { _id: { $in: objectIds } },
      { $set: { read: true } }
    );

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}




