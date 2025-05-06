import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import { Service } from '@/lib/db/models/Service';
import mongoose from 'mongoose';

export async function GET(
  request: Request,
  { params }: { params: { category: string; id: string } }
) {
  try {
    const { id } = params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid service ID' },
        { status: 400 }
      );
    }
    
    await dbConnect();
    
    const service = await Service.findById(id);
    
    if (!service) {
      return NextResponse.json(
        { message: 'Service not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(service);
  } catch (error) {
    console.error('Error fetching service details:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
