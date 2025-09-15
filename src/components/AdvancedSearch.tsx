import { useState } from "react";
import { Search, SlidersHorizontal, MapPin, Calendar, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export interface SearchFilters {
  query: string;
  animalType: "all" | "dog" | "cat";
  breed: string;
  ageRange: [number, number];
  distance: number;
  purpose: "all" | "reproduction" | "socialisation";
  verified: boolean;
  hasPhotos: boolean;
  location: string;
}

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
}

const dogBreeds = [
  "Labrador", "Golden Retriever", "Berger Allemand", "Bulldog Français", 
  "Poodle", "Rottweiler", "Yorkshire Terrier", "Beagle", "Husky Sibérien", "Boxer"
];

const catBreeds = [
  "Persan", "Maine Coon", "British Shorthair", "Siamois", "Ragdoll", 
  "Bengali", "Abyssin", "Chartreux", "Européen", "Sphynx"
];

export const AdvancedSearch = ({ onFiltersChange, className }: AdvancedSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    animalType: "all",
    breed: "",
    ageRange: [1, 15],
    distance: 50,
    purpose: "all",
    verified: false,
    hasPhotos: true,
    location: "",
  });

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const resetFilters = () => {
    const defaultFilters: SearchFilters = {
      query: "",
      animalType: "all",
      breed: "",
      ageRange: [1, 15],
      distance: 50,
      purpose: "all",
      verified: false,
      hasPhotos: true,
      location: "",
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.query) count++;
    if (filters.animalType !== "all") count++;
    if (filters.breed) count++;
    if (filters.ageRange[0] !== 1 || filters.ageRange[1] !== 15) count++;
    if (filters.distance !== 50) count++;
    if (filters.purpose !== "all") count++;
    if (filters.verified) count++;
    if (!filters.hasPhotos) count++;
    if (filters.location) count++;
    return count;
  };

  const getBreeds = () => {
    if (filters.animalType === "dog") return dogBreeds;
    if (filters.animalType === "cat") return catBreeds;
    return [...dogBreeds, ...catBreeds];
  };

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="relative gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Recherche avancée
            {getActiveFiltersCount() > 0 && (
              <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Recherche avancée</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Search Query */}
            <div className="space-y-2">
              <Label htmlFor="search-query">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-query"
                  placeholder="Nom, race, description..."
                  className="pl-10"
                  value={filters.query}
                  onChange={(e) => updateFilters({ query: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Animal Type */}
              <div className="space-y-2">
                <Label>Type d'animal</Label>
                <Select
                  value={filters.animalType}
                  onValueChange={(value: any) => updateFilters({ animalType: value, breed: "" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les animaux</SelectItem>
                    <SelectItem value="dog">Chiens</SelectItem>
                    <SelectItem value="cat">Chats</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Breed */}
              <div className="space-y-2">
                <Label>Race</Label>
                <Select
                  value={filters.breed}
                  onValueChange={(value) => updateFilters({ breed: value })}
                  disabled={filters.animalType === "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une race" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les races</SelectItem>
                    {getBreeds().map((breed) => (
                      <SelectItem key={breed} value={breed}>
                        {breed}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Purpose */}
              <div className="space-y-2">
                <Label>Objectif</Label>
                <Select
                  value={filters.purpose}
                  onValueChange={(value: any) => updateFilters({ purpose: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="reproduction">Reproduction</SelectItem>
                    <SelectItem value="socialisation">Socialisation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Localisation</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Ville, région..."
                    className="pl-10"
                    value={filters.location}
                    onChange={(e) => updateFilters({ location: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Age Range */}
            <div className="space-y-3">
              <Label>
                Âge: {filters.ageRange[0]} - {filters.ageRange[1]} ans
              </Label>
              <Slider
                value={filters.ageRange}
                onValueChange={(value) => updateFilters({ ageRange: value as [number, number] })}
                max={20}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Distance */}
            <div className="space-y-3">
              <Label>
                Distance maximale: {filters.distance} km
              </Label>
              <Slider
                value={[filters.distance]}
                onValueChange={([value]) => updateFilters({ distance: value })}
                max={200}
                min={5}
                step={5}
                className="w-full"
              />
            </div>

            {/* Switches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="verified">Profils vérifiés uniquement</Label>
                  <p className="text-sm text-muted-foreground">
                    Afficher seulement les profils vérifiés par nos équipes
                  </p>
                </div>
                <Switch
                  id="verified"
                  checked={filters.verified}
                  onCheckedChange={(checked) => updateFilters({ verified: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="has-photos">Avec photos uniquement</Label>
                  <p className="text-sm text-muted-foreground">
                    Afficher seulement les profils avec des photos
                  </p>
                </div>
                <Switch
                  id="has-photos"
                  checked={filters.hasPhotos}
                  onCheckedChange={(checked) => updateFilters({ hasPhotos: checked })}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button onClick={resetFilters} variant="outline" className="flex-1">
                Réinitialiser
              </Button>
              <Button 
                onClick={() => setIsOpen(false)} 
                className="flex-1 bg-[var(--gradient-primary)]"
              >
                Appliquer ({getActiveFiltersCount()} filtre{getActiveFiltersCount() > 1 ? 's' : ''})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};