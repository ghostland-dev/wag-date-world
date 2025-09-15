import { useState } from "react";
import { AnimalCard } from "./AnimalCard";
import { animals } from "@/data/animals";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export const MatchSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<string[]>([]);
  const { toast } = useToast();

  const handleLike = (id: string) => {
    setMatches(prev => [...prev, id]);
    toast({
      title: "C'est un match ! 💕",
      description: `Vous avez liké ${animals[currentIndex].name}`,
    });
    nextAnimal();
  };

  const handlePass = (id: string) => {
    toast({
      title: "Profil ignoré",
      description: `Vous avez passé ${animals[currentIndex].name}`,
      variant: "destructive",
    });
    nextAnimal();
  };

  const nextAnimal = () => {
    if (currentIndex < animals.length - 1) {
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

  if (currentIndex >= animals.length) {
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
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Découvrez vos matches
          </h2>
          <p className="text-muted-foreground text-lg">
            Swipez pour trouver le compagnon idéal pour votre animal
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            {currentIndex + 1} / {animals.length} • {matches.length} match{matches.length > 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="flex justify-center">
          <AnimalCard
            animal={animals[currentIndex]}
            onLike={handleLike}
            onPass={handlePass}
          />
        </div>
      </div>
    </section>
  );
};