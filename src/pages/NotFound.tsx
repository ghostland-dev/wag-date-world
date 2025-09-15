import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-primary/10 rounded-full">
            <AlertTriangle className="w-12 h-12 text-primary" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-bold text-foreground">Page introuvable</h2>
          <p className="text-muted-foreground">
            Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <div className="space-y-3">
          <Button 
            asChild
            className="w-full bg-[var(--gradient-primary)] gap-2"
          >
            <a href="/">
              <Home className="w-4 h-4" />
              Retourner à l'accueil
            </a>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full"
          >
            Page précédente
          </Button>
        </div>

        <div className="pt-4 text-xs text-muted-foreground">
          Si le problème persiste, contactez notre support technique
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
