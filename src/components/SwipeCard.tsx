import { useState, useRef, useEffect } from "react";
import { Heart, X, MapPin, Calendar, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Animal } from "@/data/animals";

interface SwipeCardProps {
  animal: Animal;
  onLike: (id: string) => void;
  onPass: (id: string) => void;
  onInfoClick: (animal: Animal) => void;
}

export const SwipeCard = ({ animal, onLike, onPass, onInfoClick }: SwipeCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragRotation, setDragRotation] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX.current;
    const rotation = deltaX * 0.1; // Subtle rotation effect
    
    setDragX(deltaX);
    setDragRotation(rotation);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    const threshold = window.innerWidth * 0.25; // 25% of screen width
    
    if (Math.abs(dragX) > threshold) {
      if (dragX > 0) {
        onLike(animal.id);
      } else {
        onPass(animal.id);
      }
    }
    
    setDragX(0);
    setDragRotation(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX.current;
    const rotation = deltaX * 0.1;
    
    setDragX(deltaX);
    setDragRotation(rotation);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    
    const threshold = window.innerWidth * 0.25;
    
    if (Math.abs(dragX) > threshold) {
      if (dragX > 0) {
        onLike(animal.id);
      } else {
        onPass(animal.id);
      }
    }
    
    setDragX(0);
    setDragRotation(0);
  };

  useEffect(() => {
    const handleMouseMoveGlobal = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - startX.current;
        const rotation = deltaX * 0.1;
        setDragX(deltaX);
        setDragRotation(rotation);
      }
    };

    const handleMouseUpGlobal = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMoveGlobal);
      document.addEventListener('mouseup', handleMouseUpGlobal);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMoveGlobal);
      document.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, [isDragging]);

  const cardStyle = {
    transform: `translateX(${dragX}px) rotate(${dragRotation}deg)`,
    transition: isDragging ? 'none' : 'all 0.3s ease-out',
  };

  const overlayOpacity = Math.min(Math.abs(dragX) / (window.innerWidth * 0.25), 0.8);

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <Card 
        ref={cardRef}
        className="overflow-hidden shadow-[var(--shadow-card)] cursor-grab active:cursor-grabbing select-none touch-none"
        style={cardStyle}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {/* Swipe Overlays */}
        {dragX !== 0 && (
          <>
            {/* Like Overlay */}
            {dragX > 0 && (
              <div 
                className="absolute inset-0 bg-secondary/20 z-10 flex items-center justify-center"
                style={{ opacity: overlayOpacity }}
              >
                <div className="bg-secondary p-4 rounded-full">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
            
            {/* Pass Overlay */}
            {dragX < 0 && (
              <div 
                className="absolute inset-0 bg-destructive/20 z-10 flex items-center justify-center"
                style={{ opacity: overlayOpacity }}
              >
                <div className="bg-destructive p-4 rounded-full">
                  <X className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
          </>
        )}
        
        <div className="relative">
          <img
            src={animal.image}
            alt={animal.name}
            className="w-full h-80 object-cover"
            draggable={false}
          />
          
          {/* Info Button */}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              onInfoClick(animal);
            }}
          >
            <Info className="w-4 h-4" />
          </Button>
          
          {/* Type Badge */}
          <Badge 
            variant="secondary" 
            className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm"
          >
            {animal.type}
          </Badge>
          
          {/* Purpose Badge */}
          <Badge 
            variant={animal.purpose === "Reproduction" ? "destructive" : "default"}
            className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm"
          >
            {animal.purpose}
          </Badge>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-foreground">{animal.name}</h3>
            <p className="text-lg text-muted-foreground">{animal.breed}</p>
          </div>
          
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{animal.age}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{animal.location}</span>
            </div>
          </div>
          
          <p className="text-foreground leading-relaxed line-clamp-3">
            {animal.description}
          </p>
          
          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              size="lg"
              variant="outline"
              className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => onPass(animal.id)}
            >
              <X className="w-5 h-5 mr-2" />
              Passer
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-[var(--gradient-secondary)] hover:opacity-90"
              onClick={() => onLike(animal.id)}
            >
              <Heart className="w-5 h-5 mr-2" />
              J'aime
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Swipe Instructions */}
      <div className="text-center mt-4 text-sm text-muted-foreground">
        Glissez à droite pour aimer, à gauche pour passer
      </div>
    </div>
  );
};