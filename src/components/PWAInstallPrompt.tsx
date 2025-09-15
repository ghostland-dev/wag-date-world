import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [installPromptDismissed, setInstallPromptDismissed] = useLocalStorage('pwa_install_dismissed', false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      if (!installPromptDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [installPromptDismissed]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installée');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setInstallPromptDismissed(true);
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <Card className="fixed bottom-4 right-4 p-4 max-w-sm z-50 shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-full">
          <Download className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex-1 space-y-2">
          <h4 className="font-semibold text-foreground">
            Installer PetMatch
          </h4>
          <p className="text-sm text-muted-foreground">
            Installez l'app sur votre téléphone pour un accès rapide et des notifications push.
          </p>
          
          <div className="flex gap-2">
            <Button onClick={handleInstall} size="sm" className="bg-[var(--gradient-primary)]">
              Installer
            </Button>
            <Button onClick={handleDismiss} variant="ghost" size="sm">
              Plus tard
            </Button>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};