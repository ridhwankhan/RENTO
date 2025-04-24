"use client";

import React, { useState, useEffect } from 'react';

const NotificationPage: React.FC = () => {



  const userId = '123'; // Replace '123' with the actual user ID logic

  useEffect(() => {
    fetch(`/api/notification?id=68099a5b34f18c60d9295699`)
      .then(res => res.json())
      .then(data => setNotifications(data.notifications));
  }, [userId]);

  const [activeTab, setActiveTab] = useState('all');
  interface Notification {
    id: number;
    type: string;
    title: string;
    description?: string;
    time: string;
    urgency: string;
    read: boolean;
    image?: string;
    amount?: string;
    dueDate?: string;
    currentBid?: string;
    actions?: string[];
  }

  const [notifications, setNotifications] = useState<Notification[]>([
    // {
    //   id: 1,
    //   type: 'listing',
    //   title: 'New Property Listed',
    //   description: 'A new 2-bedroom apartment has been listed in your area of interest.',
    //   time: '2 hours ago',
    //   urgency: 'regular',
    //   read: false,
    //   image: 'https://readdy.ai/api/search-image?query=modern%20minimalist%202%20bedroom%20apartment%20with%20large%20windows%20and%20bright%20interior%2C%20clean%20design%2C%20neutral%20colors%2C%20professional%20real%20estate%20photography%20style%2C%20simple%20background&width=80&height=80&seq=listing1&orientation=squarish',
    //   actions: ['View Listing']
    // },
    // {
    //   id: 2,
    //   type: 'payment',
    //   title: 'Rent Payment Due',
    //   description: 'Your monthly rent payment of $1,200 is due in 3 days.',
    //   time: '1 day ago',
    //   urgency: 'important',
    //   read: false,
    //   amount: '$1,200',
    //   dueDate: 'April 26, 2025',
    //   actions: ['Pay Now']
    // },
    // {
    //   id: 3,
    //   type: 'bid',
    //   title: 'Bid Update',
    //   description: 'Your bid on 123 Main Street has been outbid by another user.',
    //   time: '3 days ago',
    //   urgency: 'regular',
    //   read: true,
    //   currentBid: '$350,000',
    //   actions: ['View Listing', 'Increase Bid']
    // },
    // {
    //   id: 4,
    //   type: 'announcement',
    //   title: 'System Maintenance',
    //   description: 'Our platform will be undergoing scheduled maintenance on April 25th from 2:00 AM to 4:00 AM EST. Some features may be temporarily unavailable.',
    //   time: '1 week ago',
    //   urgency: 'regular',
    //   read: true,
    //   actions: []
    // },
    // {
    //   id: 5,
    //   type: 'alert',
    //   title: 'Urgent: Building Inspection',
    //   description: 'There will be a mandatory building inspection for all units at 456 Park Avenue on April 30th between 9:00 AM and 12:00 PM.',
    //   time: '2 days ago',
    //   urgency: 'urgent',
    //   read: false,
    //   actions: ['Add to Calendar']
    // },
    // {
    //   id: 6,
    //   type: 'listing',
    //   title: 'Price Drop Alert',
    //   description: 'A property you saved has reduced its price by $25,000.',
    //   time: '5 hours ago',
    //   urgency: 'important',
    //   read: false,
    //   image: 'https://readdy.ai/api/search-image?query=beautiful%20modern%20house%20with%20price%20drop%20sign%2C%20professional%20real%20estate%20photography%20with%20clean%20background%2C%20high%20quality%20image%20with%20natural%20lighting&width=80&height=80&seq=listing2&orientation=squarish',
    //   actions: ['View Property']
    // },
    // {
    //   id: 7,
    //   type: 'payment',
    //   title: 'Payment Confirmation',
    //   description: 'Your rent payment of $1,500 has been successfully processed.',
    //   time: '2 weeks ago',
    //   urgency: 'regular',
    //   read: true,
    //   amount: '$1,500',
    //   actions: ['View Receipt']
    // }
  ]);

  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    listings: true,
    payments: true,
    bids: true,
    announcements: true,
    alerts: true,
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: false
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const handleToggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handlePreferenceChange = (preference: string) => {
    setPreferences({
      ...preferences,
      [preference]: !preferences[preference as keyof typeof preferences]
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    return notification.type === activeTab;
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-500';
      case 'important': return 'bg-orange-500';
      default: return 'bg-blue-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'listing': return <i className="fas fa-home text-blue-500"></i>;
      case 'payment': return <i className="fas fa-dollar-sign text-green-500"></i>;
      case 'bid': return <i className="fas fa-gavel text-purple-500"></i>;
      case 'announcement': return <i className="fas fa-bullhorn text-yellow-500"></i>;
      case 'alert': return <i className="fas fa-exclamation-circle text-red-500"></i>;
      default: return <i className="fas fa-bell text-gray-500"></i>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-lg min-h-[1024px]">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 !rounded-button whitespace-nowrap cursor-pointer"
              >
                Mark all as read
              </button>
              <button 
                onClick={handleToggleSettings}
                className="text-gray-600 hover:text-gray-800 cursor-pointer !rounded-button whitespace-nowrap"
              >
                <i className="fas fa-cog text-xl"></i>
              </button>
            </div>
          </div>
          
          <div className="flex space-x-4 border-b border-gray-200 pb-4">
            <button 
              onClick={() => handleTabChange('all')}
              className={`px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All
            </button>
            <button 
              onClick={() => handleTabChange('unread')}
              className={`px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer ${activeTab === 'unread' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Unread
            </button>
            <button 
              onClick={() => handleTabChange('listing')}
              className={`px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer ${activeTab === 'listing' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Listings
            </button>
            <button 
              onClick={() => handleTabChange('payment')}
              className={`px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer ${activeTab === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Payments
            </button>
            <button 
              onClick={() => handleTabChange('announcement')}
              className={`px-4 py-2 !rounded-button whitespace-nowrap cursor-pointer ${activeTab === 'announcement' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Announcements
            </button>
          </div>
        </div>

        <div className="p-6">
          {showSettings ? (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-fade-in">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Notification Preferences</h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700">Notification Types</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <i className="fas fa-home text-blue-500 mr-3"></i>
                        <span>Listing Notifications</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={preferences.listings}
                          onChange={() => handlePreferenceChange('listings')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <i className="fas fa-dollar-sign text-green-500 mr-3"></i>
                        <span>Payment Notifications</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={preferences.payments}
                          onChange={() => handlePreferenceChange('payments')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <i className="fas fa-gavel text-purple-500 mr-3"></i>
                        <span>Bid Notifications</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={preferences.bids}
                          onChange={() => handlePreferenceChange('bids')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <i className="fas fa-bullhorn text-yellow-500 mr-3"></i>
                        <span>Announcements</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={preferences.announcements}
                          onChange={() => handlePreferenceChange('announcements')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <i className="fas fa-exclamation-circle text-red-500 mr-3"></i>
                        <span>System Alerts</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={preferences.alerts}
                          onChange={() => handlePreferenceChange('alerts')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700">Delivery Methods</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <i className="fas fa-envelope text-blue-500 mr-3"></i>
                        <span>Email Notifications</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={preferences.emailNotifications}
                          onChange={() => handlePreferenceChange('emailNotifications')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <i className="fas fa-bell text-orange-500 mr-3"></i>
                        <span>Push Notifications</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={preferences.pushNotifications}
                          onChange={() => handlePreferenceChange('pushNotifications')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <i className="fas fa-volume-up text-purple-500 mr-3"></i>
                        <span>Sound Notifications</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={preferences.soundEnabled}
                          onChange={() => handlePreferenceChange('soundEnabled')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleToggleSettings}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors !rounded-button whitespace-nowrap cursor-pointer"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          ) : (
            <>
              {filteredNotifications.length > 0 ? (
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`flex border rounded-lg overflow-hidden transition-all duration-200 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                    >
                      <div className={`w-2 ${getUrgencyColor(notification.urgency)}`}></div>
                      <div className="flex-1 p-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-4 mt-1">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              {getTypeIcon(notification.type)}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                                {!notification.read && (
                                  <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></span>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">{notification.time}</span>
                            </div>
                            
                            <p className="text-gray-600 mt-1">{notification.message}</p>
                            
                            {notification.type === 'listing' && notification.image && (
                              <div className="mt-3 flex items-center">
                                <div className="w-20 h-20 rounded-md overflow-hidden">
                                  <img 
                                    src={notification.image} 
                                    alt="Property" 
                                    className="w-full h-full object-cover object-top"
                                  />
                                </div>
                                <div className="ml-4">
                                  <span className="text-sm text-gray-500">New listing in your area</span>
                                </div>
                              </div>
                            )}
                            
                            {notification.type === 'payment' && (
                              <div className="mt-3 bg-gray-50 p-3 rounded-md">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <span className="text-sm text-gray-500">Amount:</span>
                                    <span className="ml-2 font-semibold">{notification.amount}</span>
                                  </div>
                                  {notification.dueDate && (
                                    <div>
                                      <span className="text-sm text-gray-500">Due Date:</span>
                                      <span className="ml-2 font-semibold">{notification.dueDate}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {notification.type === 'bid' && (
                              <div className="mt-3 bg-gray-50 p-3 rounded-md">
                                <div className="flex items-center">
                                  <span className="text-sm text-gray-500">Current Bid:</span>
                                  <span className="ml-2 font-semibold">{notification.currentBid}</span>
                                </div>
                              </div>
                            )}
                            
                            {notification.actions && notification.actions.length > 0 && (
                              <div className="mt-4 flex space-x-3">
                                {notification.actions.map((action, index) => (
                                    <button 
                                    key={index}
                                    onClick={() => {
                                      if (notification.type === 'listing' && notification.listingId) {
                                      window.location.href = `/houseDetailsPage/${notification.listingId}`;
                                      }
                                    }}
                                    className={`px-4 py-2 text-sm rounded-md transition-colors !rounded-button whitespace-nowrap cursor-pointer ${
                                      index === 0 
                                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                    >
                                    {action}
                                    </button>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-shrink-0 ml-4 flex flex-col space-y-2">
                            {!notification.read && (
                              <button 
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-blue-600 hover:text-blue-800 !rounded-button whitespace-nowrap cursor-pointer"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                            )}
                            <button 
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="text-gray-400 hover:text-red-600 !rounded-button whitespace-nowrap cursor-pointer"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                    <i className="fas fa-bell text-blue-300 text-4xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No notifications yet</h3>
                  <p className="text-gray-500 text-center max-w-md">
                    You'll receive notifications here when there are updates to your listings, payments, or when you receive announcements.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;

