import { Heart, X, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Animal {
  id: string;
  name: string;
  breed: string;
  age: string;
  location: string;
  image: string;
  description: string;
  type: "Chien" | "Chat";
  purpose: "Reproduction" | "Socialisation" | "Les deux";
}

interface AnimalCardProps {
  animal: Animal;
  onLike: (id: string) => void;
  onPass: (id: string) => void;
}

export const AnimalCard = ({ animal, onLike, onPass }: AnimalCardProps) => {
  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-soft)] transition-all duration-300 transform hover:scale-[1.02] animate-scale-in">
      <div className="relative">
        <img
          src={animal.image}
          alt={animal.name}
          className="w-full h-80 object-cover"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm">
            {animal.type}
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="outline" className="bg-card/90 backdrop-blur-sm">
            {animal.purpose}
          </Badge>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-foreground">{animal.name}</h3>
          <p className="text-muted-foreground font-medium">{animal.breed}</p>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{animal.age}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{animal.location}</span>
          </div>
        </div>
        
        <p className="text-foreground leading-relaxed">{animal.description}</p>
        
        <div className="flex gap-4 pt-2">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-[var(--transition-smooth)]"
            onClick={() => onPass(animal.id)}
          >
            <X className="w-5 h-5 mr-2" />
            Passer
          </Button>
          <Button
            size="lg"
            className="flex-1 bg-[var(--gradient-primary)] hover:opacity-90 transition-[var(--transition-smooth)]"
            onClick={() => onLike(animal.id)}
          >
            <Heart className="w-5 h-5 mr-2" />
            J'aime
          </Button>
        </div>
      </div>
    </Card>
  );
};