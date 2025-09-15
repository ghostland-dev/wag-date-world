import { useState, useEffect } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface GeolocationData {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  timestamp: number;
}

export const useGeolocation = () => {
  const [location, setLocation] = useLocalStorage<GeolocationData | null>('petmatch_location', null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setError('Géolocalisation non supportée par votre navigateur');
      toast({
        title: "Géolocalisation non supportée",
        description: "Votre navigateur ne supporte pas la géolocalisation",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    };

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocoding pour obtenir la ville (simulation)
      // En production, utiliser une API comme Google Maps ou OpenStreetMap
      let city = 'Ville inconnue';
      let region = 'Région inconnue';

      try {
        // Simulation d'une API de géocodage inverse
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`
        ).catch(() => null);

        if (response?.ok) {
          const data = await response.json();
          if (data.results?.[0]) {
            city = data.results[0].components.city || data.results[0].components.town || 'Ville inconnue';
            region = data.results[0].components.state || data.results[0].components.region || 'Région inconnue';
          }
        }
      } catch (geocodeError) {
        console.log('Geocoding failed, using coordinates only');
      }

      const locationData: GeolocationData = {
        latitude,
        longitude,
        city,
        region,
        timestamp: Date.now(),
      };

      setLocation(locationData);
      toast({
        title: "Position mise à jour",
        description: `Localisation: ${city}, ${region}`,
      });

    } catch (positionError) {
      let errorMessage = 'Erreur de géolocalisation';
      
      if (positionError instanceof GeolocationPositionError) {
        switch (positionError.code) {
          case positionError.PERMISSION_DENIED:
            errorMessage = 'Autorisation de géolocalisation refusée';
            break;
          case positionError.POSITION_UNAVAILABLE:
            errorMessage = 'Position non disponible';
            break;
          case positionError.TIMEOUT:
            errorMessage = 'Timeout de géolocalisation';
            break;
        }
      }

      setError(errorMessage);
      toast({
        title: "Erreur de localisation",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearLocation = () => {
    setLocation(null);
    setError(null);
    toast({
      title: "Position supprimée",
      description: "Votre position a été effacée",
    });
  };

  const isLocationStale = () => {
    if (!location) return true;
    const oneHour = 60 * 60 * 1000;
    return Date.now() - location.timestamp > oneHour;
  };

  return {
    location,
    isLoading,
    error,
    requestLocation,
    clearLocation,
    isLocationStale,
  };
};

export const GeolocationManager = () => {
  const { location, isLoading, error, requestLocation, clearLocation, isLocationStale } = useGeolocation();

  return (
    <div className="flex items-center gap-2">
      {location ? (
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">
            {location.city}, {location.region}
          </span>
          {isLocationStale() && (
            <Button
              variant="ghost"
              size="sm"
              onClick={requestLocation}
              disabled={isLoading}
              className="text-xs text-orange-600"
            >
              Actualiser
            </Button>
          )}
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={requestLocation}
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 animate-spin border-2 border-primary border-t-transparent rounded-full" />
              Localisation...
            </>
          ) : error ? (
            <>
              <AlertCircle className="w-4 h-4 text-destructive" />
              Réessayer
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" />
              Activer la localisation
            </>
          )}
        </Button>
      )}
    </div>
  );
};