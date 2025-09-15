import { useState } from "react";
import { Save, X, Camera } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { ImageUpload } from "@/components/ImageUpload";
import { useToast } from "@/hooks/use-toast";
import { Animal } from "@/types/user";

interface CreateAnimalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (animal: Animal) => void;
  editingAnimal?: Animal | null;
}

export const CreateAnimalForm = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  editingAnimal 
}: CreateAnimalFormProps) => {
  const [formData, setFormData] = useState({
    name: editingAnimal?.name || "",
    breed: editingAnimal?.breed || "",
    age: editingAnimal?.age || "",
    type: editingAnimal?.type || "Chien",
    purpose: editingAnimal?.purpose || "Adoption",
    description: editingAnimal?.description || "",
    location: editingAnimal?.location || "",
    price: editingAnimal?.price || 0,
    vaccinated: editingAnimal?.vaccinated || false,
    sterilized: editingAnimal?.sterilized || false,
    microchipped: editingAnimal?.microchipped || false,
    healthCertificate: editingAnimal?.healthCertificate || false,
  });

  const [images, setImages] = useState<string[]>(editingAnimal?.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast({
        title: "Photos requises",
        description: "Ajoutez au moins une photo de votre animal",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const animalData: Animal = {
        id: editingAnimal?.id || Date.now().toString(),
        ...formData,
        images,
        ownerId: 'current_user_id',
        ownerName: 'Current User',
        status: 'available',
        createdAt: editingAnimal?.createdAt || new Date(),
        updatedAt: new Date(),
        isVerified: false,
        viewCount: editingAnimal?.viewCount || 0,
        favoriteCount: editingAnimal?.favoriteCount || 0,
      };

      onSuccess(animalData);
      onClose();
      
      toast({
        title: editingAnimal ? "Animal modifié" : "Animal ajouté",
        description: editingAnimal 
          ? "Les informations ont été mises à jour avec succès"
          : "Votre annonce a été créée et sera vérifiée sous 24h",
      });

      // Reset form
      if (!editingAnimal) {
        setFormData({
          name: "",
          breed: "",
          age: "",
          type: "Chien",
          purpose: "Adoption", 
          description: "",
          location: "",
          price: 0,
          vaccinated: false,
          sterilized: false,
          microchipped: false,
          healthCertificate: false,
        });
        setImages([]);
      }

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'animal. Réessayez plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {editingAnimal ? "Modifier l'animal" : "Ajouter un nouvel animal"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photos */}
          <Card className="p-6">
            <Label className="text-lg font-semibold mb-4 block">
              Photos de l'animal *
            </Label>
            <ImageUpload
              currentImages={images}
              onImagesChange={setImages}
              maxImages={8}
            />
          </Card>

          {/* Basic Info */}
          <Card className="p-6">
            <Label className="text-lg font-semibold mb-4 block">
              Informations générales
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'animal *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Buddy"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="breed">Race *</Label>
                <Input
                  id="breed"
                  value={formData.breed}
                  onChange={(e) => handleInputChange("breed", e.target.value)}
                  placeholder="Golden Retriever"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Âge *</Label>
                <Input
                  id="age"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="2 ans"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type d'animal *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => handleInputChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chien">Chien</SelectItem>
                    <SelectItem value="Chat">Chat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Objectif *</Label>
                <Select
                  value={formData.purpose}
                  onValueChange={(value: any) => handleInputChange("purpose", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Adoption">Adoption</SelectItem>
                    <SelectItem value="Reproduction">Reproduction</SelectItem>
                    <SelectItem value="Socialisation">Socialisation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Localisation *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Paris, 75011"
                  required
                />
              </div>
            </div>

            {formData.purpose === "Adoption" && (
              <div className="space-y-2 mt-4">
                <Label htmlFor="price">Prix (€) - Optionnel</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", parseInt(e.target.value) || 0)}
                  placeholder="0 pour gratuit"
                />
                <p className="text-sm text-muted-foreground">
                  Laissez 0 pour une adoption gratuite
                </p>
              </div>
            )}
          </Card>

          {/* Description */}
          <Card className="p-6">
            <Label className="text-lg font-semibold mb-4 block">
              Description détaillée *
            </Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Décrivez le caractère, les habitudes, l'histoire de votre animal..."
              rows={6}
              required
            />
          </Card>

          {/* Health Info */}
          <Card className="p-6">
            <Label className="text-lg font-semibold mb-4 block">
              Informations santé
            </Label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="vaccinated">Vacciné</Label>
                  <p className="text-sm text-muted-foreground">
                    L'animal est-il à jour dans ses vaccinations ?
                  </p>
                </div>
                <Switch
                  id="vaccinated"
                  checked={formData.vaccinated}
                  onCheckedChange={(checked) => handleInputChange("vaccinated", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sterilized">Stérilisé/Castré</Label>
                  <p className="text-sm text-muted-foreground">
                    L'animal est-il stérilisé ou castré ?
                  </p>
                </div>
                <Switch
                  id="sterilized"
                  checked={formData.sterilized}
                  onCheckedChange={(checked) => handleInputChange("sterilized", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="microchipped">Pucé</Label>
                  <p className="text-sm text-muted-foreground">
                    L'animal possède-t-il une puce électronique ?
                  </p>
                </div>
                <Switch
                  id="microchipped"
                  checked={formData.microchipped}
                  onCheckedChange={(checked) => handleInputChange("microchipped", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="health-certificate">Certificat vétérinaire</Label>
                  <p className="text-sm text-muted-foreground">
                    Certificat de bonne santé disponible ?
                  </p>
                </div>
                <Switch
                  id="health-certificate"
                  checked={formData.healthCertificate}
                  onCheckedChange={(checked) => handleInputChange("healthCertificate", checked)}
                />
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[var(--gradient-primary)]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 animate-spin border-2 border-current border-t-transparent rounded-full mr-2" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editingAnimal ? "Modifier" : "Créer l'annonce"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};