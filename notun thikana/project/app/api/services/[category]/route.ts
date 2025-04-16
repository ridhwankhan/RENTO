import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { Service } from '@/lib/db/models/Service';

export async function GET(
  request: Request,
  { params }: { params: { category: string } }
) {
  try {
    const category = params.category;
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    await dbConnect();
    
    let query: any = { category };
    
    // Search by name or description if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    const services = await Service.find(query).sort({ rating: -1 });
    
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services by category:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
