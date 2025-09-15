import { useState, useRef } from 'react';
import { Camera, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  currentImages?: string[];
  className?: string;
}

export const ImageUpload = ({ 
  onImagesChange, 
  maxImages = 5, 
  currentImages = [],
  className = "" 
}: ImageUploadProps) => {
  const [images, setImages] = useState<string[]>(currentImages);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast({
        title: "Trop d'images",
        description: `Vous pouvez uploader maximum ${maxImages} images`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const newImages: string[] = [];

      for (const file of files) {
        // Validation du fichier
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Format non supporté",
            description: `${file.name} n'est pas une image valide`,
            variant: "destructive",
          });
          continue;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
          toast({
            title: "Fichier trop volumineux",
            description: `${file.name} dépasse la limite de 5MB`,
            variant: "destructive",
          });
          continue;
        }

        // Conversion en base64 pour le stockage local
        // En production, utiliser un service cloud comme AWS S3, Cloudinary, etc.
        const base64 = await fileToBase64(file);
        newImages.push(base64);
      }

      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onImagesChange(updatedImages);

      toast({
        title: "Images ajoutées",
        description: `${newImages.length} image(s) ajoutée(s) avec succès`,
      });

    } catch (error) {
      console.error('Erreur upload:', error);
      toast({
        title: "Erreur d'upload",
        description: "Impossible d'uploader les images",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
    
    toast({
      title: "Image supprimée",
      description: "L'image a été retirée de votre sélection",
    });
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Button */}
      <Button
        variant="outline"
        onClick={triggerFileSelect}
        disabled={isUploading || images.length >= maxImages}
        className="w-full h-32 border-2 border-dashed hover:border-primary transition-colors"
      >
        <div className="flex flex-col items-center gap-2">
          {isUploading ? (
            <>
              <div className="w-8 h-8 animate-spin border-2 border-primary border-t-transparent rounded-full" />
              <span>Upload en cours...</span>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium">Cliquez pour ajouter des photos</p>
                <p className="text-sm text-muted-foreground">
                  {images.length}/{maxImages} photos • Max 5MB par photo
                </p>
              </div>
            </>
          )}
        </div>
      </Button>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeImage(index)}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2">
                  <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    Photo principale
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-muted-foreground space-y-1">
        <p>• Formats acceptés: JPG, PNG, WebP</p>
        <p>• Taille maximum: 5MB par image</p>
        <p>• La première image sera utilisée comme photo principale</p>
      </div>
    </div>
  );
};