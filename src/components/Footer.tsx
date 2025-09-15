import { Heart, Mail, Shield, HelpCircle } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-[var(--gradient-primary)] rounded-full">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent">
                PetMatch
              </h3>
            </div>
            <p className="text-muted-foreground max-w-md">
              L'application de rencontres pour animaux de compagnie. Facilitez la reproduction responsable 
              et la socialisation de vos compagnons à quatre pattes.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Sécurisé & Confidentiel</span>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Support</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Centre d'aide
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Contactez-nous
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Signaler un problème
              </a>
            </div>
          </div>

          {/* Légal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Légal</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Conditions d'utilisation
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Cookies
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                Mentions légales
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 PetMatch. Tous droits réservés.
            </p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>Fait avec</span>
              <Heart className="w-4 h-4 text-primary" />
              <span>pour nos amis à quatre pattes</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};