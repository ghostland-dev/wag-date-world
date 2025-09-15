import { useState } from "react";
import { AnimalCard } from "./AnimalCard";
import { FilterSection, FilterState } from "./FilterSection";
import { animals } from "@/data/animals";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface MatchSectionProps {
  onMatch: (id: string) => void;
}

export const MatchSection = ({ onMatch }: MatchSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    animalType: "all",
    purpose: "all", 
    distance: 50,
    ageRange: [1, 10],
  });
  const { toast } = useToast();

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
      description: `Vous avez liké ${filteredAnimals[currentIndex].name}`,
    });
    nextAnimal();
  };

  const handlePass = (id: string) => {
    toast({
      title: "Profil ignoré",
      description: `Vous avez passé ${filteredAnimals[currentIndex].name}`,
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
    setCurrentIndex(0); // Reset to first card when filters change
  };

  if (filteredAnimals.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto text-center space-y-6">
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
      </section>
    );
  }

  if (currentIndex >= filteredAnimals.length) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-md mx-auto text-center space-y-6">
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
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Découvrez vos matches
          </h2>
          <p className="text-muted-foreground text-lg">
            Swipez pour trouver le compagnon idéal pour votre animal
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
          <div className="relative">
            <FilterSection onFiltersChange={handleFiltersChange} />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <div className="text-sm text-muted-foreground">
            {currentIndex + 1} / {filteredAnimals.length} • {matches.length} match{matches.length > 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="flex justify-center">
          <AnimalCard
            animal={filteredAnimals[currentIndex]}
            onLike={handleLike}
            onPass={handlePass}
          />
        </div>
      </div>
    </section>
  );
};