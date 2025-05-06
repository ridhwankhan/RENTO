import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("rento");

    // Test connection by getting collections info
    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      connected: true,
      collections: collections.map(c => c.name)
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to database', details: error },
      { status: 500 }
    );
  }
}