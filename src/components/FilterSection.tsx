import { useState } from "react";
import { Filter, MapPin, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface FilterSectionProps {
  onFiltersChange: (filters: FilterState) => void;
  className?: string;
}

export interface FilterState {
  animalType: "all" | "dog" | "cat";
  purpose: "all" | "reproduction" | "socialisation";
  distance: number;
  ageRange: [number, number];
}

export const FilterSection = ({ onFiltersChange, className }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    animalType: "all",
    purpose: "all",
    distance: 50,
    ageRange: [1, 10],
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      animalType: "all",
      purpose: "all",
      distance: 50,
      ageRange: [1, 10],
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.animalType !== "all") count++;
    if (filters.purpose !== "all") count++;
    if (filters.distance !== 50) count++;
    if (filters.ageRange[0] !== 1 || filters.ageRange[1] !== 10) count++;
    return count;
  };

  return (
    <div className={className}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="relative gap-2"
      >
        <Filter className="w-4 h-4" />
        Filtres
        {getActiveFiltersCount() > 0 && (
          <Badge variant="destructive" className="h-5 w-5 p-0 text-xs">
            {getActiveFiltersCount()}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute top-full mt-2 p-6 w-80 z-50 shadow-[var(--shadow-card)]">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Filtres</h3>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Réinitialiser
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Type d'animal
                </Label>
                <Select
                  value={filters.animalType}
                  onValueChange={(value: any) => updateFilters({ animalType: value })}
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

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Objectif
                </Label>
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

              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Distance: {filters.distance} km
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
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};