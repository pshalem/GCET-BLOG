import { motion } from 'framer-motion';
import { 
  Bell, Check, CheckCheck, Heart, MessageCircle, 
  UserPlus, Calendar, Award, Pin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppStore } from '@/store';
import { formatDistanceToNow } from 'date-fns';
import type { Notification } from '@/types';

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'post_like':
      return Heart;
    case 'comment':
      return MessageCircle;
    case 'mention':
      return UserPlus;
    case 'announcement':
      return Calendar;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'post_like':
      return 'text-reaction-like';
    case 'comment':
      return 'text-primary';
    case 'mention':
      return 'text-accent';
    case 'announcement':
      return 'text-warning';
    default:
      return 'text-muted-foreground';
  }
};

export default function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadNotifications } = useAppStore();

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsRead();
  };

  const unreadNotifs = notifications.filter(n => !n.read);
  const readNotifs = notifications.filter(n => n.read);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Bell className="w-8 h-8 mr-3" />
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with your community activity
          </p>
        </div>
        
        {unreadNotifications > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline">
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Bell className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-foreground">{notifications.length}</div>
            <p className="text-sm text-muted-foreground">Total Notifications</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <Badge className="w-8 h-8 mx-auto mb-2 flex items-center justify-center p-0">
              {unreadNotifications}
            </Badge>
            <div className="text-2xl font-bold text-foreground">{unreadNotifications}</div>
            <p className="text-sm text-muted-foreground">Unread</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <Check className="w-8 h-8 mx-auto mb-2 text-success" />
            <div className="text-2xl font-bold text-foreground">{readNotifs.length}</div>
            <p className="text-sm text-muted-foreground">Read</p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <div className="space-y-6">
        {/* Unread Notifications */}
        {unreadNotifs.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Badge variant="destructive" className="mr-2">
                {unreadNotifs.length}
              </Badge>
              New Notifications
            </h2>
            
            <div className="space-y-3">
              {unreadNotifs.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const iconColor = getNotificationColor(notification.type);
                
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className="border-l-4 border-l-primary bg-primary/5">
                      <CardContent className="pt-4">
                        <div className="flex items-start space-x-4">
                          <div className={`p-2 rounded-full bg-background ${iconColor}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          
                          <div className="flex-1 space-y-1">
                            <h3 className="font-medium text-foreground">
                              {notification.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Mark as read
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Read Notifications */}
        {readNotifs.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Check className="w-5 h-5 mr-2 text-success" />
              Recent Activity
            </h2>
            
            <div className="space-y-3">
              {readNotifs.slice(0, 10).map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const iconColor = getNotificationColor(notification.type);
                
                return (
                  <Card key={notification.id} className="opacity-75 hover:opacity-100 transition-opacity">
                    <CardContent className="pt-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-full bg-muted ${iconColor}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <h3 className="font-medium text-foreground">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {readNotifs.length > 10 && (
              <div className="text-center mt-4">
                <Button variant="outline">Load More</Button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {notifications.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="w-16 h-16 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2 text-foreground">No notifications yet</h3>
              <p className="text-muted-foreground mb-4">
                When you start engaging with the community, you'll see notifications here.
              </p>
              <Button>Explore Posts</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
}