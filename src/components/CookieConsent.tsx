import { useState, useEffect } from "react";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const CookieConsent = () => {
  const [cookieConsent, setCookieConsent] = useLocalStorage('petmatch_cookie_consent', null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (cookieConsent === null) {
      const timer = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [cookieConsent]);

  const handleAccept = () => {
    setCookieConsent('accepted');
    setShowBanner(false);
    
    // Enable analytics and tracking
    console.log('Cookies accepted - enabling analytics');
  };

  const handleDecline = () => {
    setCookieConsent('declined');
    setShowBanner(false);
    
    // Disable non-essential cookies
    console.log('Cookies declined - disabling non-essential tracking');
  };

  if (!showBanner || cookieConsent !== null) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <Card className="p-6 shadow-[var(--shadow-card)] border-2 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <Cookie className="w-5 h-5 text-primary" />
          </div>
          
          <div className="flex-1 space-y-3">
            <h3 className="font-semibold text-foreground">
              Nous utilisons des cookies
            </h3>
            <p className="text-sm text-muted-foreground">
              Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic 
              et personnaliser le contenu. Vous pouvez choisir quels cookies accepter.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={handleAccept}
                className="bg-[var(--gradient-primary)] hover:opacity-90"
                size="sm"
              >
                Accepter tous
              </Button>
              <Button 
                onClick={handleDecline}
                variant="outline"
                size="sm"
              >
                Refuser non-essentiels
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs"
                asChild
              >
                <a href="#privacy">Paramètres</a>
              </Button>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleDecline}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};