import { Bell, Shield, MapPin, Filter, Heart, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const SettingsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-foreground mb-2">Paramètres</h2>
        <p className="text-muted-foreground text-lg">
          Personnalisez votre expérience PetMatch
        </p>
      </div>

      {/* Notifications */}
      <Card className="p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Notifications</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="matches-notifications" className="text-base font-medium">
                Nouveaux matches
              </Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des notifications pour les nouveaux matches
              </p>
            </div>
            <Switch id="matches-notifications" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="messages-notifications" className="text-base font-medium">
                Messages
              </Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des notifications pour les nouveaux messages
              </p>
            </div>
            <Switch id="messages-notifications" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="recommendations-notifications" className="text-base font-medium">
                Recommandations
              </Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des suggestions d'animaux compatibles
              </p>
            </div>
            <Switch id="recommendations-notifications" />
          </div>
        </div>
      </Card>

      {/* Privacy & Security */}
      <Card className="p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Confidentialité & Sécurité</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="public-profile" className="text-base font-medium">
                Profil public
              </Label>
              <p className="text-sm text-muted-foreground">
                Permettre aux autres utilisateurs de voir votre profil
              </p>
            </div>
            <Switch id="public-profile" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="location-sharing" className="text-base font-medium">
                Partage de localisation
              </Label>
              <p className="text-sm text-muted-foreground">
                Afficher votre ville dans les résultats de recherche
              </p>
            </div>
            <Switch id="location-sharing" defaultChecked />
          </div>
        </div>
      </Card>

      {/* Search Preferences */}
      <Card className="p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-3 mb-6">
          <Filter className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Préférences de recherche</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">
              Distance maximale: 50 km
            </Label>
            <Slider
              defaultValue={[50]}
              max={200}
              min={5}
              step={5}
              className="w-full"
            />
          </div>
          
          <div>
            <Label className="text-base font-medium mb-3 block">
              Type d'animal préféré
            </Label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les animaux</SelectItem>
                <SelectItem value="dog">Chiens seulement</SelectItem>
                <SelectItem value="cat">Chats seulement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-base font-medium mb-3 block">
              Objectif principal
            </Label>
            <Select defaultValue="both">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="both">Reproduction et socialisation</SelectItem>
                <SelectItem value="breeding">Reproduction uniquement</SelectItem>
                <SelectItem value="social">Socialisation uniquement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Help & Support */}
      <Card className="p-6 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold text-foreground">Aide & Support</h3>
        </div>
        
        <div className="space-y-3">
          <Button variant="ghost" className="w-full justify-start h-auto p-4">
            <div className="text-left">
              <div className="font-medium">Centre d'aide</div>
              <div className="text-sm text-muted-foreground">FAQ et guides d'utilisation</div>
            </div>
          </Button>
          
          <Button variant="ghost" className="w-full justify-start h-auto p-4">
            <div className="text-left">
              <div className="font-medium">Contacter le support</div>
              <div className="text-sm text-muted-foreground">Obtenir de l'aide personnalisée</div>
            </div>
          </Button>
          
          <Button variant="ghost" className="w-full justify-start h-auto p-4">
            <div className="text-left">
              <div className="font-medium">Conditions d'utilisation</div>
              <div className="text-sm text-muted-foreground">Lire nos conditions</div>
            </div>
          </Button>
        </div>
      </Card>
    </div>
  );
};