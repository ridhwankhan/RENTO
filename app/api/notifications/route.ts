import { NextResponse } from 'next/server';

// This would be replaced with your actual database logic
const mockDb = {
  notifications: [] as any[]
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ownerId = searchParams.get('ownerId');
  const userId = searchParams.get('userId');
  const read = searchParams.get('read');
  
  let filteredNotifications = [...mockDb.notifications];
  
  if (ownerId) {
    filteredNotifications = filteredNotifications.filter(n => n.ownerId === ownerId);
  }
  
  if (userId) {
    filteredNotifications = filteredNotifications.filter(n => n.userId === userId);
  }
  
  if (read !== null) {
    const isRead = read === 'true';
    filteredNotifications = filteredNotifications.filter(n => n.read === isRead);
  }
  
  return NextResponse.json(filteredNotifications);
}

// Mark notifications as read
export async function PUT(request: Request) {
  try {
    const { ids } = await request.json();
    
    if (!Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    // Update read status for each notification
    ids.forEach(id => {
      const notificationIndex = mockDb.notifications.findIndex(n => n.id === id);
      if (notificationIndex !== -1) {
        mockDb.notifications[notificationIndex].read = true;
      }
    });
    
    return NextResponse.json({ message: 'Notifications marked as read' });
    
  } catch (error) {
    console.error('Notification update error:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}