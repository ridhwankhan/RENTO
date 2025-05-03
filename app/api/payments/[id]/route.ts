import { NextResponse } from 'next/server';

// This would be replaced with your actual database logic
const mockDb = {
  payments: [] as any[],
  notifications: [] as any[]
};

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await request.json();
    
    // Find the payment
    const paymentIndex = mockDb.payments.findIndex(p => p.id === id);
    
    if (paymentIndex === -1) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }
    
    // Update payment status
    mockDb.payments[paymentIndex] = {
      ...mockDb.payments[paymentIndex],
      status,
      updatedAt: new Date().toISOString()
    };
    
    // Create notification for tenant
    const payment = mockDb.payments[paymentIndex];
    const notification = {
      id: Date.now().toString(),
      userId: payment.userId,
      type: 'payment_update',
      message: `Your payment for property ${payment.propertyId} has been ${status}`,
      paymentId: payment.id,
      read: false,
      timestamp: new Date().toISOString()
    };
    
    mockDb.notifications.push(notification);
    
    return NextResponse.json({
      message: `Payment status updated to ${status}`,
      payment: mockDb.payments[paymentIndex]
    });
    
  } catch (error) {
    console.error('Payment update error:', error);
    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const payment = mockDb.payments.find(p => p.id === id);
  
  if (!payment) {
    return NextResponse.json(
      { error: 'Payment not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(payment);
}