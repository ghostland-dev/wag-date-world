import { useState, useEffect } from "react";
import { Bell, Heart, MessageCircle, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: 'match' | 'message' | 'like' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
  actionUrl?: string;
}

export const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('petmatch_notifications', []);
  const { toast } = useToast();

  // Mock notifications for demo
  useEffect(() => {
    if (notifications.length === 0) {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'match',
          title: 'Nouveau match !',
          description: 'Luna et votre chien Max se sont likés mutuellement',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          read: false,
          avatar: '/placeholder.svg'
        },
        {
          id: '2',
          type: 'message',
          title: 'Nouveau message',
          description: 'Marie vous a envoyé un message concernant Luna',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          read: false,
          avatar: '/placeholder.svg'
        },
        {
          id: '3',
          type: 'like',
          title: 'Quelqu\'un a liké Max',
          description: 'Bella trouve Max très intéressant !',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          read: true,
          avatar: '/placeholder.svg'
        },
        {
          id: '4',
          type: 'system',
          title: 'Profil vérifié',
          description: 'Votre profil a été vérifié avec succès',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          read: true
        }
      ];
      setNotifications(mockNotifications);
    }
  }, [notifications.length, setNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    toast({
      title: "Notifications supprimées",
      description: "Toutes les notifications ont été effacées",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <Heart className="w-4 h-4 text-destructive" />;
      case 'message':
        return <MessageCircle className="w-4 h-4 text-primary" />;
      case 'like':
        return <Heart className="w-4 h-4 text-secondary" />;
      case 'system':
        return <Star className="w-4 h-4 text-yellow-500" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)}j`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-80 p-0" 
        align="end"
        sideOffset={8}
      >
        <div className="border-b p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={markAllAsRead}
                >
                  Tout marquer lu
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-destructive"
                onClick={clearAll}
              >
                Effacer tout
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {unreadCount === 0 ? 'Aucune nouvelle notification' : `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}`}
          </p>
        </div>
        
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune notification</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg mb-2 transition-colors cursor-pointer ${
                    notification.read 
                      ? 'hover:bg-muted/50' 
                      : 'bg-primary/5 border border-primary/20 hover:bg-primary/10'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {notification.avatar ? (
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={notification.avatar} />
                        <AvatarFallback>
                          {getNotificationIcon(notification.type)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-foreground text-sm">
                          {notification.title}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};