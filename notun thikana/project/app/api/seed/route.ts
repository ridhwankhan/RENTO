import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/db/seed';

export async function GET() {
  try {
    const result = await seedDatabase();
    
    if (result.success) {
      return NextResponse.json({ message: 'Database seeded successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Error seeding database', error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in seed route:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
