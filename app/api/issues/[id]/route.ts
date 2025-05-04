import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { after } from 'next/server';

// Get a specific issue
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const client = await clientPromise;
    const db = client.db("rento");

    const issue = await db.collection("issues").findOne({ _id: new ObjectId(id) });

    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(issue);
  } catch (error) {
    console.error('Error fetching issue:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issue' },
      { status: 500 }
    );
  }
}

// Update issue status
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status, requesterId } = await request.json();

    const client = await clientPromise;
    const db = client.db("rento");

    // Find the issue
    const issue = await db.collection("issues").findOne({ _id: new ObjectId(id) });

    if (!issue) {
      return NextResponse.json(
        { error: 'Issue not found' },
        { status: 404 }
      );
    }

    let updateData: any = {
      status,
      updatedAt: new Date().toISOString()
    };

    let notificationData: any = {
      type: 'issue_update',
      issueId: id,
      read: false,
      timestamp: new Date().toISOString()
    };

    // Handle different status updates
    // When updating an issue to completed status:
    if (status === 'completed') {
      // Tenant confirming issue is resolved
      if (requesterId !== issue.tenantId) {
        return NextResponse.json(
          { error: 'Only the tenant can mark as completed' },
          { status: 403 }
        );
      }

      updateData.completedAt = new Date().toISOString();
      notificationData.userId = issue.ownerId;
      notificationData.message = `Issue "${issue.title}" has been marked as completed by the tenant.`;

      // Add points to owner's leaderboard score
      await db.collection("leaderboard").updateOne(
        { userId: issue.ownerId },
        {
          $inc: { score: 200 },
          $setOnInsert: { name: "Property Owner" } // Remove team field
        },
        { upsert: true }
      );
    }

    // Update the issue
    await db.collection("issues").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Create notification
    after(async () => {
      await db.collection("notifications").insertOne(notificationData);
    });

    return NextResponse.json({
      message: `Issue status updated to ${status}`,
      issue: {
        ...issue,
        ...updateData
      }
    });
  } catch (error) {
    console.error('Issue update error:', error);
    return NextResponse.json(
      { error: 'Failed to update issue' },
      { status: 500 }
    );
  }
}