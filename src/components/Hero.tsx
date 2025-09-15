import { Heart, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="relative py-12 sm:py-20 px-4 bg-[var(--gradient-primary)] text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
      
      <div className="relative max-w-6xl mx-auto text-center space-y-6 sm:space-y-8">
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight">
            PetMatch
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl opacity-90 font-medium">
            L'application de rencontres pour vos compagnons à quatre pattes
          </p>
        </div>
        
        <p className="text-base sm:text-lg md:text-xl opacity-80 max-w-3xl mx-auto leading-relaxed px-4">
          Trouvez le partenaire idéal pour votre animal : adoption responsable, reproduction et 
          socialisation dans votre région.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center pt-6 sm:pt-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 sm:p-4 bg-white/20 rounded-full">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <span className="font-medium text-sm sm:text-base">Adoption responsable</span>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 sm:p-4 bg-white/20 rounded-full">
              <Users className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <span className="font-medium text-sm sm:text-base">Socialisation</span>
          </div>
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 sm:p-4 bg-white/20 rounded-full">
              <MapPin className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <span className="font-medium text-sm sm:text-base">Proximité</span>
          </div>
        </div>
        
        <div className="pt-6 sm:pt-8">
          <Button 
            size="lg" 
            variant="secondary"
            className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 hover:scale-105 transition-[var(--transition-smooth)]"
          >
            Commencer les rencontres
          </Button>
        </div>
      </div>
    </section>
  );
};