import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { after } from 'next/server';

// Create a new issue
export async function POST(request: Request) {
  try {
    const issue = await request.json();
    
    // Validate required fields
    if (!issue.tenantId || !issue.propertyId || !issue.title || !issue.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db("rento");
    
    // Get property details to find owner
    const property = await db.collection("properties").findOne({ _id: issue.propertyId });
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }
    
    // Add issue to database
    const newIssue = {
      ...issue,
      ownerId: property.ownerId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null
    };
    
    const result = await db.collection("issues").insertOne(newIssue);
    
    // Create notification for property owner
    const notification = {
      userId: property.ownerId,
      type: 'new_issue',
      message: `New issue reported: ${issue.title}`,
      issueId: result.insertedId.toString(),
      read: false,
      timestamp: new Date().toISOString()
    };
    
    // Use after() to handle notification creation asynchronously
    after(async () => {
      await db.collection("notifications").insertOne(notification);
    });
    
    return NextResponse.json({ 
      message: 'Issue reported successfully', 
      issue: {
        id: result.insertedId.toString(),
        ...newIssue
      }
    });
  } catch (error) {
    console.error('Issue creation error:', error);
    return NextResponse.json(
      { error: 'Failed to report issue' },
      { status: 500 }
    );
  }
}

// Get all issues (with filtering)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('ownerId');
    const tenantId = searchParams.get('tenantId');
    const propertyId = searchParams.get('propertyId');
    const status = searchParams.get('status');
    
    const client = await clientPromise;
    const db = client.db("rento");
    
    let query: any = {};
    
    if (ownerId) query.ownerId = ownerId;
    if (tenantId) query.tenantId = tenantId;
    if (propertyId) query.propertyId = propertyId;
    if (status) query.status = status;
    
    const issues = await db.collection("issues")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(issues);
  } catch (error) {
    console.error('Error fetching issues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch issues' },
      { status: 500 }
    );
  }
}