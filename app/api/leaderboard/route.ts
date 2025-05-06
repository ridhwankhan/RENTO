import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("rento");

    // Get leaderboard data sorted by score in descending order (highest first)
    const leaderboard = await db.collection("leaderboard")
      .find()
      .sort({ score: -1 }) // -1 means descending order (highest first)
      .limit(20)
      .toArray();

    // Add rank to each entry
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    return NextResponse.json(rankedLeaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

// Add a new leaderboard entry or update an existing one
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.ownerId || !data.name || data.score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields (ownerId, name, score)' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("rento");

    // Check if entry already exists
    const existingEntry = await db.collection("leaderboard").findOne({ ownerId: data.ownerId });

    if (existingEntry) {
      // Update existing entry
      const result = await db.collection("leaderboard").updateOne(
        { ownerId: data.ownerId },
        {
          $set: {
            name: data.name,
            score: data.score,
            ...(data.team ? { team: data.team } : {})
          }
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Leaderboard entry updated',
        modifiedCount: result.modifiedCount
      });
    } else {
      // Create new entry
      const newEntry = {
        ownerId: data.ownerId,
        name: data.name,
        score: data.score,
        ...(data.team ? { team: data.team } : {})
      };

      const result = await db.collection("leaderboard").insertOne(newEntry);

      return NextResponse.json({
        success: true,
        message: 'Leaderboard entry created',
        entryId: result.insertedId.toString()
      });
    }
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to update leaderboard' },
      { status: 500 }
    );
  }
}



