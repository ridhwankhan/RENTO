import { NextResponse } from 'next/server';
import { after } from 'next/server';
import clientPromise from '@/lib/mongodb';
// Keep this import if you need ObjectId elsewhere in the file
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const payment = await request.json();

    // Validate required fields
    if (!payment.userId || !payment.propertyId || !payment.amount || !payment.method) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("rento");

    // Add payment to database with pending status
    const newPayment = {
      ...payment,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    const result = await db.collection("payments").insertOne(newPayment);

    // Create notification for property owner
    // In a real app, you'd query the database to get the ownerId based on propertyId
    const ownerId = 'OWNER123'; // Mock owner ID for now

    const notification = {
      ownerId,
      type: 'payment',
      message: `New payment of ${payment.amount} received for property ${payment.propertyId}`,
      paymentId: result.insertedId.toString(),
      read: false,
      timestamp: new Date().toISOString()
    };

    // Use after() to handle notification creation asynchronously
    after(async () => {
      await db.collection("notifications").insertOne(notification);
      console.log('Notification created:', notification);
    });

    return NextResponse.json({
      message: 'Payment submitted successfully',
      payment: {
        id: result.insertedId.toString(),
        ...newPayment
      }
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}

// Get all payments (with optional filtering)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    const client = await clientPromise;
    const db = client.db("rento");

    let query: any = {};

    if (ownerId) {
      // In a real app, you'd filter by payments for properties owned by this owner
      query.ownerId = ownerId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (status) {
      query.status = status;
    }

    const payments = await db.collection("payments")
      .find(query)
      .sort({ timestamp: -1 })
      .toArray();

    // Convert MongoDB _id to string id for client-side use
    const formattedPayments = payments.map(payment => ({
      id: payment._id.toString(),
      ...payment,
      _id: undefined
    }));

    return NextResponse.json(formattedPayments);
  } catch (error) {
    console.error('Payment fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

