'use client'
import { useState } from 'react';
import { Card, CardHeader, CardFooter, CardContent } from '@/components/ui/card';
import { CheckCircleIcon } from 'lucide-react';
import { Spinner } from "@/components/spinner";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Your Habit is Due', message: 'Remember to check in on your habit today!', read: false },
    { id: 2, title: 'New Habit Added', message: 'You have successfully added a new habit!', read: false },
  ]);
  const [isLoading, setLoading] = useState(false); 

  const markAsRead = (id: number) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = async () => {
    setLoading(true); 
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
        <button 
          onClick={markAllAsRead} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <Spinner />
              Marking as Read...
            </span>
          ) : (
            'Mark All as Read'
          )}
        </button>
      </div>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`bg-white shadow-md hover:shadow-lg rounded-lg ${notification.read ? 'bg-gray-100' : 'bg-blue-50 border-l-4 border-blue-400'}`}
          >
            <CardHeader className="flex items-center space-x-3">
              <h3 className={`font-medium text-lg text-gray-800 ${notification.read ? '' : 'font-semibold text-blue-600'}`}>
                {notification.title}
              </h3>
            </CardHeader>
            <CardContent>
              <p className={`text-gray-600 ${notification.read ? 'line-through text-gray-500' : ''}`}>{notification.message}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="text-sm text-gray-500">5 minutes ago</span>
              {!notification.read && (
                <CheckCircleIcon 
                  className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-700 transition duration-300"
                  onClick={() => markAsRead(notification.id)}
                />
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
