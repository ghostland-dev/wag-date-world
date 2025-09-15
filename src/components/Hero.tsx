import { Heart, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="relative py-20 px-4 bg-[var(--gradient-primary)] text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
      
      <div className="relative max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            PetMatch
          </h1>
          <p className="text-xl md:text-2xl opacity-90 font-medium">
            L'application de rencontres pour vos compagnons à quatre pattes
          </p>
        </div>
        
        <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto leading-relaxed">
          Trouvez le partenaire idéal pour votre animal : reproduction responsable, 
          socialisation et nouvelles amitiés dans votre région.
        </p>
        
        <div className="flex flex-wrap justify-center gap-8 text-center pt-8">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-white/20 rounded-full">
              <Heart className="w-8 h-8" />
            </div>
            <span className="font-medium">Reproduction saine</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-white/20 rounded-full">
              <Users className="w-8 h-8" />
            </div>
            <span className="font-medium">Socialisation</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-white/20 rounded-full">
              <MapPin className="w-8 h-8" />
            </div>
            <span className="font-medium">Proximité</span>
          </div>
        </div>
        
        <div className="pt-8">
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-4 hover:scale-105 transition-[var(--transition-smooth)]"
          >
            Commencer les rencontres
          </Button>
        </div>
      </div>
    </section>
  );
};