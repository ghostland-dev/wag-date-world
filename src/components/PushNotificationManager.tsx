import { useState, useEffect } from "react";
import { Bell, BellOff, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

interface PushNotification {
  id: string;
  title: string;
  body: string;
  type: 'match' | 'message' | 'like' | 'system';
  timestamp: Date;
  read: boolean;
}

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    denied: false,
    default: true
  });
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported('Notification' in window && 'serviceWorker' in navigator);
    
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      setPermission({
        granted: currentPermission === 'granted',
        denied: currentPermission === 'denied',
        default: currentPermission === 'default'
      });
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast({
        title: "Non supporté",
        description: "Votre navigateur ne supporte pas les notifications push",
        variant: "destructive"
      });
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      const newPermission = {
        granted: result === 'granted',
        denied: result === 'denied',
        default: result === 'default'
      };
      
      setPermission(newPermission);

      if (result === 'granted') {
        toast({
          title: "✅ Notifications activées",
          description: "Vous recevrez maintenant des notifications push"
        });
        return true;
      } else if (result === 'denied') {
        toast({
          title: "❌ Notifications refusées",
          description: "Vous pouvez les activer dans les paramètres du navigateur",
          variant: "destructive"
        });
      }
      
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Erreur",
        description: "Impossible de demander la permission de notification",
        variant: "destructive"
      });
      return false;
    }
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (permission.granted && isSupported) {
      try {
        const notification = new Notification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options
        });

        // Auto close after 5 seconds
        setTimeout(() => {
          notification.close();
        }, 5000);

        return notification;
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }
    return null;
  };

  const sendMatchNotification = (animalName: string) => {
    sendNotification("🎉 Nouveau Match!", {
      body: `Vous avez un nouveau match avec ${animalName}!`,
      tag: 'match',
      requireInteraction: true
    });
  };

  const sendMessageNotification = (senderName: string) => {
    sendNotification("💬 Nouveau Message", {
      body: `${senderName} vous a envoyé un message`,
      tag: 'message'
    });
  };

  const sendLikeNotification = (animalName: string) => {
    sendNotification("💖 Nouveau Like", {
      body: `${animalName} vous a liké!`,
      tag: 'like'
    });
  };

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
    sendMatchNotification,
    sendMessageNotification,
    sendLikeNotification
  };
};

export const PushNotificationManager = () => {
  const { 
    permission, 
    isSupported, 
    requestPermission,
    sendMatchNotification,
    sendMessageNotification,
    sendLikeNotification
  } = usePushNotifications();
  
  const [notifications, setNotifications] = useLocalStorage<PushNotification[]>('petmatch_push_notifications', []);
  const [showDemo, setShowDemo] = useState(false);

  // Demo notifications for testing
  const sendDemoNotifications = async () => {
    setShowDemo(true);
    
    setTimeout(() => sendMatchNotification("Luna le Golden Retriever"), 1000);
    setTimeout(() => sendMessageNotification("Marie (propriétaire de Max)"), 3000);
    setTimeout(() => sendLikeNotification("Bella le Labrador"), 5000);
    
    setTimeout(() => setShowDemo(false), 7000);
  };

  if (!isSupported) {
    return (
      <Card className="p-4 bg-muted/50">
        <div className="flex items-center gap-3">
          <BellOff className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="font-medium text-muted-foreground">Notifications non supportées</p>
            <p className="text-sm text-muted-foreground">Votre navigateur ne supporte pas les notifications push</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Notifications Push</h3>
                <p className="text-sm text-muted-foreground">
                  Recevez des notifications en temps réel pour vos matches et messages
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge 
                variant={permission.granted ? "default" : permission.denied ? "destructive" : "secondary"}
                className="flex items-center gap-1"
              >
                {permission.granted ? (
                  <>
                    <Check className="w-3 h-3" />
                    Activées
                  </>
                ) : permission.denied ? (
                  <>
                    <X className="w-3 h-3" />
                    Refusées
                  </>
                ) : (
                  "Non configurées"
                )}
              </Badge>
              
              {permission.granted && (
                <Badge variant="outline" className="text-xs">
                  🔔 {notifications.filter(n => !n.read).length} non lues
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {!permission.granted && (
              <Button onClick={requestPermission} className="w-full">
                <Bell className="w-4 h-4 mr-2" />
                Activer
              </Button>
            )}
            
            {permission.granted && (
              <Button 
                onClick={sendDemoNotifications} 
                variant="outline"
                disabled={showDemo}
                className="w-full"
              >
                {showDemo ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin border-2 border-primary border-t-transparent rounded-full" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 mr-2" />
                    Tester
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {permission.granted && (
        <Card className="p-4">
          <h4 className="font-medium mb-3 text-foreground">Types de notifications</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">🎉 Nouveaux matches</span>
              <Badge variant="outline" className="text-xs">Activé</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">💬 Nouveaux messages</span>
              <Badge variant="outline" className="text-xs">Activé</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">💖 Nouveaux likes</span>
              <Badge variant="outline" className="text-xs">Activé</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">📢 Annonces importantes</span>
              <Badge variant="outline" className="text-xs">Activé</Badge>
            </div>
          </div>
        </Card>
      )}

      {permission.denied && (
        <Card className="p-4 border-destructive/20 bg-destructive/5">
          <div className="space-y-2">
            <h4 className="font-medium text-destructive">Notifications désactivées</h4>
            <p className="text-sm text-muted-foreground">
              Pour activer les notifications, allez dans les paramètres de votre navigateur :
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Chrome: Paramètres → Confidentialité et sécurité → Paramètres du site → Notifications</li>
              <li>• Firefox: Paramètres → Vie privée et sécurité → Permissions → Notifications</li>
              <li>• Safari: Préférences → Sites web → Notifications</li>
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
};