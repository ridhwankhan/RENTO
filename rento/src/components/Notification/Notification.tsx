"use client";

import React, { useState } from 'react';
import { useEffect } from 'react';

interface NotificationItem {
    message: string;
    createdAt: string; // Add createdAt property
}

const Notification: React.FC = () => {
    const [userNotifications, setUserNotifications] = useState<NotificationItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen((prevState) => !prevState);
    };
    useEffect(() => {
        const fetchNotifications = async () => {
          try {
            const response = await fetch('/api/notification?id=68099a5b34f18c60d9295699');

            if (!response.ok) {
              throw new Error('Failed to fetch notifications');
            }
      
            const userData = await response.json();
            console.log('Full user data from API:', userData); // ✅ See the full response
      
            const notifications: NotificationItem[] = userData.notifications ?? [];
            console.log('Extracted notifications:', notifications); // ✅ See just the notifications array
      
            setUserNotifications(notifications);
          } catch (error) {
            console.error('Error fetching notifications:', error);
            setUserNotifications([]);
          }
        };
      
        fetchNotifications();
      }, []);
      
      
    return (
    <div className="notification-container">
        {/* Notification icon with animation */}
        <div
            className={`notification-icon cursor-pointer ${isOpen ? 'animate-bounce' : ''}`}
            onClick={togglePopup}
        >
            🔔
        </div>
        {/* Popup visibility controlled by isOpen */}
        {isOpen && (
            <div
                className="notification-popup absolute bg-white p-5 shadow-lg rounded-lg"
                style={{ top: '60px', right: '180px', width: '400px', maxWidth: '90%' }}
            >
                <h4><strong>Notifications</strong></h4>
                <ul>
                    {/* Replace static notifications with dynamic user notifications */}
                    {userNotifications.length > 0 ? (
                        [...userNotifications].reverse().map((notification, index) => (
                            <li 
                                key={index} 
                                className="hover:shadow-md hover:bg-gray-100 transition-all duration-200 p-2 rounded"
                            >
                                <div>{notification.message}</div>
                                <div className="text-sm text-gray-500">
                                    {new Date(notification.createdAt).toLocaleString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    })}
                                </div>
                            </li>
                        ))
                    ) : (
                        <li>No new notifications</li>
                    )}
                </ul>
                <button 
                    onClick={() => window.location.href = '/notificationPage'} 
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
                >
                    Show more
                </button>
            </div>
        )}
    </div>
);
}
export default Notification;