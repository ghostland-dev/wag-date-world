import { useState } from "react";
import { SwipeCard } from "./SwipeCard";
import { AnimalDetailsModal } from "./AnimalDetailsModal";
import { FilterSection, FilterState } from "./FilterSection";
import { FavoriteButton, useFavorites } from "./FavoritesManager";
import { animals, Animal } from "@/data/animals";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw, Heart } from "lucide-react";
import { ResponsiveContainer } from "./ResponsiveContainer";

interface EnhancedMatchSectionProps {
  onMatch: (id: string) => void;
}

export const EnhancedMatchSection = ({ onMatch }: EnhancedMatchSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<string[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    animalType: "all",
    purpose: "all", 
    distance: 50,
    ageRange: [1, 10],
  });
  const { toast } = useToast();
  const { toggleFavorite } = useFavorites();

  // Filter animals based on current filters
  const filteredAnimals = animals.filter(animal => {
    if (filters.animalType !== "all") {
      const typeMatch = filters.animalType === "dog" ? "Chien" : "Chat";
      if (animal.type !== typeMatch) return false;
    }
    
    if (filters.purpose !== "all") {
      if (filters.purpose === "reproduction" && animal.purpose === "Socialisation") return false;
      if (filters.purpose === "socialisation" && animal.purpose === "Reproduction") return false;
    }
    
    return true;
  });

  const handleLike = (id: string) => {
    setMatches(prev => [...prev, id]);
    onMatch(id);
    toast({
      title: "C'est un match ! 💕",
      description: `Vous avez liké ${filteredAnimals[currentIndex]?.name}`,
    });
    nextAnimal();
  };

  const handlePass = (id: string) => {
    toast({
      title: "Profil ignoré",
      description: `Vous avez passé ${filteredAnimals[currentIndex]?.name}`,
      variant: "destructive",
    });
    nextAnimal();
  };

  const nextAnimal = () => {
    if (currentIndex < filteredAnimals.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const resetCards = () => {
    setCurrentIndex(0);
    setMatches([]);
    toast({
      title: "Cartes réinitialisées",
      description: "Prêt pour de nouvelles rencontres !",
    });
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentIndex(0);
  };

  const handleAnimalInfo = (animal: Animal) => {
    setSelectedAnimal(animal);
  };

  if (filteredAnimals.length === 0) {
    return (
      <ResponsiveContainer size="md" className="py-16">
        <div className="text-center space-y-6">
          <div className="text-6xl">🔍</div>
          <h2 className="text-3xl font-bold text-foreground">
            Aucun résultat
          </h2>
          <p className="text-muted-foreground">
            Aucun animal correspond à vos critères. Essayez d'ajuster vos filtres.
          </p>
          <Button onClick={() => handleFiltersChange({
            animalType: "all",
            purpose: "all",
            distance: 50,
            ageRange: [1, 10],
          })}>
            Réinitialiser les filtres
          </Button>
        </div>
      </ResponsiveContainer>
    );
  }

  if (currentIndex >= filteredAnimals.length) {
    return (
      <ResponsiveContainer size="md" className="py-16">
        <div className="text-center space-y-6">
          <div className="text-6xl">🎉</div>
          <h2 className="text-3xl font-bold text-foreground">
            Plus de profils !
          </h2>
          <p className="text-muted-foreground">
            Vous avez vu tous les animaux disponibles. 
            {matches.length > 0 && ` Vous avez ${matches.length} match${matches.length > 1 ? 's' : ''} !`}
          </p>
          <Button onClick={resetCards} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Recommencer
          </Button>
        </div>
      </ResponsiveContainer>
    );
  }

  const currentAnimal = filteredAnimals[currentIndex];

  return (
    <>
      <ResponsiveContainer size="lg" className="py-8 md:py-16">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2 md:mb-4">
            Découvrez vos matches
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Swipez pour trouver le compagnon idéal pour votre animal
          </p>
        </div>
        
        {/* Filters - Hidden on mobile for cleaner UI */}
        <div className="hidden md:flex justify-center mb-8">
          <FilterSection onFiltersChange={handleFiltersChange} />
        </div>
        
        {/* Progress and Stats */}
        <div className="text-center mb-6 md:mb-8">
          <div className="text-sm text-muted-foreground mb-2">
            {currentIndex + 1} / {filteredAnimals.length} • {matches.length} match{matches.length > 1 ? 's' : ''}
          </div>
          {/* Progress bar */}
          <div className="w-full max-w-xs mx-auto bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / filteredAnimals.length) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Main Card */}
        <div className="flex justify-center relative">
          {/* Next card preview (desktop only) */}
          {currentIndex < filteredAnimals.length - 1 && (
            <div className="hidden md:block absolute inset-0 z-0">
              <div className="transform scale-95 opacity-30">
                <SwipeCard
                  animal={filteredAnimals[currentIndex + 1]}
                  onLike={() => {}}
                  onPass={() => {}}
                  onInfoClick={() => {}}
                />
              </div>
            </div>
          )}
          
          {/* Current card */}
          <div className="relative z-10">
            <SwipeCard
              animal={currentAnimal}
              onLike={handleLike}
              onPass={handlePass}
              onInfoClick={handleAnimalInfo}
            />
            
            {/* Favorite button overlay */}
            <div className="absolute top-4 left-4 z-20">
              <FavoriteButton animalId={currentAnimal.id} />
            </div>
          </div>
        </div>

        {/* Mobile Filters Button */}
        <div className="flex justify-center mt-6 md:hidden">
          <FilterSection onFiltersChange={handleFiltersChange} />
        </div>
      </ResponsiveContainer>

      {/* Animal Details Modal */}
      {selectedAnimal && (
        <AnimalDetailsModal
          isOpen={!!selectedAnimal}
          onClose={() => setSelectedAnimal(null)}
          animal={selectedAnimal}
          onLike={handleLike}
          onPass={handlePass}
        />
      )}
    </>
  );
};