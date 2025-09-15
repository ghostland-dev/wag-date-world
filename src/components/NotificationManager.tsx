import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export const NotificationManager = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage('petmatch_notifications', false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported('Notification' in window);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast({
        title: "Non supporté",
        description: "Les notifications ne sont pas supportées par votre navigateur",
        variant: "destructive",
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        
        // Show welcome notification
        new Notification('PetMatch', {
          body: 'Vous recevrez maintenant des notifications pour vos nouveaux matches !',
          icon: '/favicon.ico',
          tag: 'welcome'
        });
        
        toast({
          title: "Notifications activées !",
          description: "Vous recevrez des alertes pour vos nouveaux matches",
        });
      } else {
        toast({
          title: "Permission refusée",
          description: "Vous pouvez activer les notifications dans les paramètres de votre navigateur",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'activer les notifications",
        variant: "destructive",
      });
    }
  };

  const disableNotifications = () => {
    setNotificationsEnabled(false);
    toast({
      title: "Notifications désactivées",
      description: "Vous ne recevrez plus de notifications",
    });
  };

  const sendTestNotification = () => {
    if (permission === 'granted' && notificationsEnabled) {
      new Notification('Test PetMatch', {
        body: 'Ceci est une notification de test !',
        icon: '/favicon.ico',
        tag: 'test'
      });
    }
  };

  // Function to send match notifications (would be called from match logic)
  const sendMatchNotification = (animalName: string) => {
    if (permission === 'granted' && notificationsEnabled) {
      new Notification('Nouveau Match ! 💕', {
        body: `Vous avez un nouveau match avec ${animalName} !`,
        icon: '/favicon.ico',
        tag: 'match',
        requireInteraction: true
      });
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {permission === 'granted' && notificationsEnabled ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={disableNotifications}
            className="text-green-600"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={sendTestNotification}
            className="text-xs"
          >
            Test
          </Button>
        </>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={requestPermission}
          className="text-muted-foreground"
        >
          <BellOff className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

// Export the notification function for use in other components
export const sendMatchNotification = (animalName: string) => {
  if (Notification.permission === 'granted') {
    new Notification('Nouveau Match ! 💕', {
      body: `Vous avez un nouveau match avec ${animalName} !`,
      icon: '/favicon.ico',
      tag: 'match',
      requireInteraction: true
    });
  }
};