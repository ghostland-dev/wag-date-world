import { useState, useRef, useCallback } from "react";
import { Upload, X, Camera, Plus, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

interface EnhancedImageUploadProps {
  maxImages?: number;
  onImagesChange?: (files: File[]) => void;
  acceptedTypes?: string[];
  className?: string;
}

export const EnhancedImageUpload = ({
  maxImages = 6,
  onImagesChange,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
  className
}: EnhancedImageUploadProps) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const createImageFile = useCallback((file: File): ImageFile => ({
    file,
    preview: URL.createObjectURL(file),
    id: Math.random().toString(36).substring(7),
  }), []);

  const validateFile = useCallback((file: File): boolean => {
    if (!acceptedTypes.includes(file.type)) {
      toast({
        title: "Format non supporté",
        description: "Veuillez sélectionner une image (JPEG, PNG, WebP)",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximum est de 10MB",
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [acceptedTypes, toast]);

  const handleFiles = useCallback((files: FileList) => {
    const validFiles: File[] = [];
    
    Array.from(files).forEach(file => {
      if (validateFile(file) && images.length + validFiles.length < maxImages) {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      const newImages = validFiles.map(createImageFile);
      setImages(prev => {
        const updated = [...prev, ...newImages];
        onImagesChange?.(updated.map(img => img.file));
        return updated;
      });
      
      toast({
        title: "Images ajoutées",
        description: `${validFiles.length} image${validFiles.length > 1 ? 's' : ''} ajoutée${validFiles.length > 1 ? 's' : ''}`,
      });
    }

    if (images.length + validFiles.length >= maxImages) {
      toast({
        title: "Limite atteinte",
        description: `Maximum ${maxImages} images autorisées`,
        variant: "destructive",
      });
    }
  }, [images.length, maxImages, validateFile, createImageFile, onImagesChange, toast]);

  const removeImage = useCallback((id: string) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      const updated = prev.filter(img => img.id !== id);
      onImagesChange?.(updated.map(img => img.file));
      return updated;
    });
  }, [onImagesChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [handleFiles]);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Clean up object URLs when component unmounts
  useState(() => {
    return () => {
      images.forEach(image => {
        URL.revokeObjectURL(image.preview);
      });
    };
  });

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Area */}
      <Card
        className={cn(
          "p-6 border-2 border-dashed transition-all duration-200",
          "hover:border-primary/50 cursor-pointer",
          isDragging && "border-primary bg-primary/5",
          images.length >= maxImages && "opacity-50 pointer-events-none"
        )}
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={cn(
            "w-16 h-16 rounded-full bg-muted flex items-center justify-center",
            isDragging && "bg-primary/20"
          )}>
            {isDragging ? (
              <Upload className="w-8 h-8 text-primary" />
            ) : (
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              {isDragging ? "Déposez vos images ici" : "Ajoutez des photos"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Glissez-déposez ou cliquez pour sélectionner ({images.length}/{maxImages})
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPEG, PNG, WebP - Max 10MB par image
            </p>
          </div>
        </div>
      </Card>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <Card className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={image.preview}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 0 && (
                    <div className="absolute top-2 left-2">
                      <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        Photo principale
                      </div>
                    </div>
                  )}
                </div>
              </Card>
              
              {/* Remove Button */}
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(image.id);
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
          
          {/* Add More Button */}
          {images.length < maxImages && (
            <Card 
              className="aspect-square flex items-center justify-center border-2 border-dashed cursor-pointer hover:border-primary/50 transition-colors"
              onClick={openFileDialog}
            >
              <div className="text-center">
                <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Ajouter</p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Camera Button for Mobile */}
      <div className="md:hidden">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            // For mobile, this would trigger camera capture
            // For now, it opens file dialog
            openFileDialog();
          }}
        >
          <Camera className="w-4 h-4 mr-2" />
          Prendre une photo
        </Button>
      </div>
    </div>
  );
};