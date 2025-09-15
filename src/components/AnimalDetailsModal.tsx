import { useState } from "react";
import { Heart, X, MapPin, Calendar, Star, Shield, Camera, MessageCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Animal } from "@/data/animals";

interface AnimalDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  animal: Animal;
  onLike: (id: string) => void;
  onPass: (id: string) => void;
  onContact?: (animal: Animal) => void;
}

export const AnimalDetailsModal = ({ 
  isOpen, 
  onClose, 
  animal, 
  onLike, 
  onPass, 
  onContact 
}: AnimalDetailsModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Mock additional images for carousel
  const images = [animal.image, animal.image, animal.image];
  
  // Mock owner data
  const owner = {
    name: "Marie Dubois",
    avatar: animal.image,
    verifiedSince: "2023",
    rating: 4.8,
    responseTime: "~2h",
    location: animal.location,
    description: "Propriétaire passionnée avec 15 ans d'expérience. Tous mes animaux sont suivis par un vétérinaire certifié."
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden" aria-describedby="animal-details-description">
        <div id="animal-details-description" className="sr-only">
          Détails complets de {animal.name}, un {animal.type.toLowerCase()} de race {animal.breed}
        </div>
        <ScrollArea className="h-full">
          {/* Image Carousel */}
          <div className="relative">
            <img
              src={images[currentImageIndex]}
              alt={animal.name}
              className="w-full h-80 object-cover"
            />
            
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-card/90 backdrop-blur-sm"
                  onClick={handlePrevImage}
                >
                  ←
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-card/90 backdrop-blur-sm"
                  onClick={handleNextImage}
                >
                  →
                </Button>
              </>
            )}
            
            {/* Image Indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
            
            {/* Close Button */}
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Animal Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">{animal.name}</h2>
                  <p className="text-xl text-muted-foreground">{animal.breed}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">{animal.type}</Badge>
                  <Badge 
                    variant={animal.purpose === "Reproduction" ? "destructive" : "default"}
                  >
                    {animal.purpose}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{animal.age}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{animal.location}</span>
                </div>
              </div>
              
              <p className="text-foreground leading-relaxed">
                {animal.description}
              </p>
            </div>
            
            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Caractéristiques</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Vacciné et stérilisé</li>
                  <li>• Sociable avec autres animaux</li>
                  <li>• Dressé aux ordres de base</li>
                  <li>• Puce électronique</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Préférences</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Recherche partenaire même race</li>
                  <li>• Âge idéal: 2-5 ans</li>
                  <li>• Disponible weekends</li>
                  <li>• Rencontres dans parcs</li>
                </ul>
              </div>
            </div>
            
            {/* Owner Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Propriétaire</h3>
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={owner.avatar} alt={owner.name} />
                  <AvatarFallback>{owner.name[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{owner.name}</h4>
                    <Shield className="w-4 h-4 text-secondary" />
                    <Badge variant="secondary" className="text-xs">
                      Vérifié depuis {owner.verifiedSince}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{owner.rating}</span>
                    </div>
                    <span>Répond en {owner.responseTime}</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{owner.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {owner.description}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                variant="outline"
                className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => {
                  onPass(animal.id);
                  onClose();
                }}
              >
                <X className="w-5 h-5 mr-2" />
                Passer
              </Button>
              <Button
                size="lg"
                className="flex-1 bg-[var(--gradient-secondary)] hover:opacity-90"
                onClick={() => {
                  onLike(animal.id);
                  onClose();
                }}
              >
                <Heart className="w-5 h-5 mr-2" />
                J'aime
              </Button>
            </div>
            
            {/* Contact Button for Matches */}
            {onContact && (
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => onContact(animal)}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contacter le propriétaire
              </Button>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};