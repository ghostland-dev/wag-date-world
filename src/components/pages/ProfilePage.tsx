import { Edit, MapPin, Mail, Phone, Camera } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import dog1 from "@/assets/dog1.jpg";

export const ProfilePage = () => {
  const userProfile = {
    name: "Marie Dupont",
    email: "marie.dupont@email.com",
    phone: "06 12 34 56 78",
    location: "Paris, 75011",
    avatar: dog1, // Placeholder
    pets: [
      {
        name: "Buddy",
        breed: "Golden Retriever",
        age: "3 ans",
        type: "Chien",
        image: dog1,
        purpose: "Reproduction",
        verified: true,
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* User Profile Card */}
      <Card className="p-8 shadow-[var(--shadow-card)]">
        <div className="flex items-start gap-6">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
              <AvatarFallback className="text-2xl bg-[var(--gradient-primary)] text-white">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8">
              <Camera className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-foreground">{userProfile.name}</h2>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{userProfile.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{userProfile.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{userProfile.location}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Pets Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-foreground">Mes Animaux</h3>
          <Button className="bg-[var(--gradient-primary)]">
            Ajouter un animal
          </Button>
        </div>
        
        <div className="grid gap-6">
          {userProfile.pets.map((pet, index) => (
            <Card key={index} className="p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-start gap-6">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h4 className="text-xl font-bold text-foreground">{pet.name}</h4>
                    {pet.verified && (
                      <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                        ✓ Vérifié
                      </Badge>
                    )}
                    <Badge variant="outline">{pet.type}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{pet.breed}</span>
                    <span>•</span>
                    <span>{pet.age}</span>
                    <span>•</span>
                    <span>{pet.purpose}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Modifier
                    </Button>
                    <Button variant="outline" size="sm">
                      Gérer photos
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};