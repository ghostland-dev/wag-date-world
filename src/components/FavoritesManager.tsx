import { useState } from "react";
import { Heart, Eye, MessageCircle, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";
import { animals, Animal } from "@/data/animals";

export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage<string[]>('petmatch_favorites', []);
  const { toast } = useToast();

  const addToFavorites = (animalId: string) => {
    if (!favorites.includes(animalId)) {
      setFavorites(prev => [...prev, animalId]);
      const animal = animals.find(a => a.id === animalId);
      toast({
        title: "Ajouté aux favoris",
        description: `${animal?.name} a été ajouté à votre liste de souhaits`,
      });
    }
  };

  const removeFromFavorites = (animalId: string) => {
    setFavorites(prev => prev.filter(id => id !== animalId));
    const animal = animals.find(a => a.id === animalId);
    toast({
      title: "Retiré des favoris",
      description: `${animal?.name} a été retiré de votre liste de souhaits`,
    });
  };

  const toggleFavorite = (animalId: string) => {
    if (favorites.includes(animalId)) {
      removeFromFavorites(animalId);
    } else {
      addToFavorites(animalId);
    }
  };

  const isFavorite = (animalId: string) => favorites.includes(animalId);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
  };
};

interface FavoriteButtonProps {
  animalId: string;
  className?: string;
}

export const FavoriteButton = ({ animalId, className }: FavoriteButtonProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isLiked = isFavorite(animalId);

  return (
    <Button
      variant={isLiked ? "default" : "outline"}
      size="icon"
      className={className}
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(animalId);
      }}
    >
      <Heart 
        className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`}
      />
    </Button>
  );
};

interface FavoritesPageProps {
  onAnimalClick?: (animal: Animal) => void;
  onContactClick?: (animal: Animal) => void;
}

export const FavoritesPage = ({ onAnimalClick, onContactClick }: FavoritesPageProps) => {
  const { favorites, removeFromFavorites } = useFavorites();
  const favoriteAnimals = animals.filter(animal => favorites.includes(animal.id));

  if (favorites.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <div className="text-6xl">💝</div>
          <h2 className="text-3xl font-bold text-foreground">
            Aucun favori pour le moment
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Ajoutez des animaux à votre liste de souhaits en cliquant sur le cœur lors de vos découvertes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-foreground mb-2">
          Ma Liste de Souhaits
        </h2>
        <p className="text-muted-foreground text-lg">
          {favorites.length} animal{favorites.length > 1 ? 'aux' : ''} dans vos favoris
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteAnimals.map((animal) => (
          <Card key={animal.id} className="overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-soft)] transition-all duration-300">
            <div className="relative">
              <img
                src={animal.image}
                alt={animal.name}
                className="w-full h-48 object-cover cursor-pointer"
                onClick={() => onAnimalClick?.(animal)}
              />
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm">
                  {animal.type}
                </Badge>
              </div>
              <div className="absolute top-3 right-3 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-card/90 backdrop-blur-sm"
                  onClick={() => removeFromFavorites(animal.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute bottom-3 right-3">
                <Badge 
                  variant={animal.purpose === "Reproduction" ? "destructive" : "default"}
                  className="bg-card/90 backdrop-blur-sm"
                >
                  {animal.purpose}
                </Badge>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">{animal.name}</h3>
                <p className="text-muted-foreground">{animal.breed}</p>
              </div>
              
              <p className="text-foreground text-sm leading-relaxed line-clamp-3">
                {animal.description}
              </p>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  className="flex-1"
                  size="sm"
                  onClick={() => onAnimalClick?.(animal)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir plus
                </Button>
                <Button 
                  className="flex-1 bg-[var(--gradient-primary)]"
                  size="sm"
                  onClick={() => onContactClick?.(animal)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contacter
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};