'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface Notification {
  id: number;
  type: 'listing' | 'bid' | 'reminder' | 'announcement';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'listing',
      title: 'New Property Listed',
      message: 'A new property has been listed in your preferred area.',
      date: '2024-02-20',
      isRead: false
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Rent Due Reminder',
      message: 'Your rent payment is due in 5 days.',
      date: '2024-02-19',
      isRead: false
    },
    {
      id: 3,
      type: 'announcement',
      title: 'System Maintenance',
      message: 'The system will be under maintenance on Sunday.',
      date: '2024-02-18',
      isRead: true
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? {...notif, isRead: true} : notif
    ));
  };

  const deleteNotification = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      setNotifications(notifications.filter(notif => notif.id !== id));
      toast.success('Notification deleted successfully');
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`p-4 rounded-lg shadow-md ${
              notification.isRead ? 'bg-gray-100' : 'bg-white border-l-4 border-blue-500'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <h3 className="font-semibold text-lg">{notification.title}</h3>
                <p className="text-gray-600 mt-1">{notification.message}</p>
                <p className="text-sm text-gray-500 mt-2">{notification.date}</p>
              </div>
              <div className="flex items-center space-x-4">
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="text-sm text-blue-500 hover:text-blue-700"
                  >
                    Mark as read
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="text-sm text-red-500 hover:text-red-700 transition-colors duration-200"
                  aria-label="Delete notification"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No notifications to display
          </div>
        )}
      </div>
    </div>
  );
}


