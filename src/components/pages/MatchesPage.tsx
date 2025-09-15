import { useState } from "react";
import { MessageCircle, MapPin, Calendar, Heart, Users, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/StatsCard";
import { ChatModal } from "@/components/ChatModal";
import { animals, Animal } from "@/data/animals";
import { useUser } from "@/contexts/UserContext";
import { useAnalytics } from "@/hooks/useAnalytics";

interface MatchesPageProps {
  matches: string[];
}

export const MatchesPage = ({ matches }: MatchesPageProps) => {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const { user } = useUser();
  const { track } = useAnalytics();
  const matchedAnimals = animals.filter(animal => matches.includes(animal.id));

  const handleChatOpen = (animal: Animal) => {
    setSelectedAnimal(animal);
    track('profile_viewed', { animalId: animal.id, source: 'matches' });
  };

  if (matches.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <div className="text-6xl">💕</div>
          <h2 className="text-3xl font-bold text-foreground">
            Aucun match pour le moment
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Continuez à découvrir des profils pour trouver des partenaires parfaits pour votre animal
          </p>
        </div>
      </div>
    );
  }

  const dogMatches = matchedAnimals.filter(a => a.type === "Chien").length;
  const catMatches = matchedAnimals.filter(a => a.type === "Chat").length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-foreground mb-2">
          Vos Matches
        </h2>
        <p className="text-muted-foreground text-lg">
          {matches.length} compagnon{matches.length > 1 ? 's' : ''} intéressé{matches.length > 1 ? 's' : ''} par votre animal
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Matches"
          value={matches.length}
          icon={Heart}
          description="Nouveaux cette semaine"
          trend="up"
        />
        <StatsCard
          title="Chiens"
          value={dogMatches}
          icon={Users}
          description={`${Math.round((dogMatches / matches.length) * 100)}% du total`}
        />
        <StatsCard
          title="Chats"
          value={catMatches}
          icon={TrendingUp}
          description={`${Math.round((catMatches / matches.length) * 100)}% du total`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matchedAnimals.map((animal) => (
          <Card key={animal.id} className="overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-soft)] transition-all duration-300">
            <div className="relative">
              <img
                src={animal.image}
                alt={animal.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm">
                  {animal.type}
                </Badge>
              </div>
              <div className="absolute top-3 right-3">
                <div className="p-2 bg-primary/90 backdrop-blur-sm rounded-full">
                  <Heart className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">{animal.name}</h3>
                <p className="text-muted-foreground">{animal.breed}</p>
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
              
              <p className="text-foreground text-sm leading-relaxed line-clamp-3">
                {animal.description}
              </p>
              
              <Button 
                className="w-full bg-[var(--gradient-primary)] hover:opacity-90"
                size="sm"
                onClick={() => handleChatOpen(animal)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contacter
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {selectedAnimal && user && (
        <ChatModal
          isOpen={!!selectedAnimal}
          onClose={() => setSelectedAnimal(null)}
          conversation={{
            id: selectedAnimal.id,
            animalName: selectedAnimal.name,
            ownerName: 'Propriétaire',
            avatar: selectedAnimal.image,
            lastMessage: 'Nouveau match !',
            lastMessageTime: new Date(),
            unreadCount: 0,
            isOnline: true,
            messages: []
          }}
        />
      )}
    </div>
  );
};