import { useState } from "react";
import { AlertTriangle, Flag, MessageSquare, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Animal } from "@/data/animals";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  animal: Animal;
}

const reportReasons = [
  {
    id: "fake_profile",
    label: "Profil suspect ou faux",
    description: "Ce profil semble être faux ou trompeur"
  },
  {
    id: "inappropriate_content",
    label: "Contenu inapproprié",
    description: "Photos ou descriptions inappropriées"
  },
  {
    id: "spam",
    label: "Spam ou publicité",
    description: "Contenu promotionnel non autorisé"
  },
  {
    id: "harassment",
    label: "Harcèlement",
    description: "Comportement inapproprié dans les messages"
  },
  {
    id: "animal_welfare",
    label: "Bien-être animal",
    description: "Préoccupations concernant le traitement de l'animal"
  },
  {
    id: "other",
    label: "Autre",
    description: "Autre motif (précisez dans les détails)"
  }
];

export const ReportModal = ({ isOpen, onClose, animal }: ReportModalProps) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedReason) {
      toast({
        title: "Motif requis",
        description: "Veuillez sélectionner un motif de signalement",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simuler l'envoi du signalement
      // En production, envoyer à l'API de modération
      await new Promise(resolve => setTimeout(resolve, 2000));

      const reportData = {
        animalId: animal.id,
        animalName: animal.name,
        reason: selectedReason,
        details: details.trim(),
        timestamp: new Date().toISOString(),
        reporterId: 'current_user_id' // En production, utiliser l'ID de l'utilisateur connecté
      };

      // Stocker le signalement localement pour la démo
      const existingReports = JSON.parse(localStorage.getItem('petmatch_reports') || '[]');
      existingReports.push(reportData);
      localStorage.setItem('petmatch_reports', JSON.stringify(existingReports));

      toast({
        title: "Signalement envoyé",
        description: "Merci pour votre vigilance. Notre équipe va examiner ce signalement.",
      });

      onClose();
      setSelectedReason("");
      setDetails("");

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le signalement. Réessayez plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Signaler ce profil
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <img
                src={animal.image}
                alt={animal.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-medium">{animal.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {animal.breed} • {animal.location}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">
              Motif du signalement *
            </Label>
            <RadioGroup 
              value={selectedReason} 
              onValueChange={setSelectedReason}
              className="space-y-3"
            >
              {reportReasons.map((reason) => (
                <div key={reason.id} className="flex items-start space-x-3">
                  <RadioGroupItem 
                    value={reason.id} 
                    id={reason.id}
                    className="mt-1"
                  />
                  <div className="grid gap-1 leading-none">
                    <Label
                      htmlFor={reason.id}
                      className="font-medium cursor-pointer"
                    >
                      {reason.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">
              Détails supplémentaires (optionnel)
            </Label>
            <Textarea
              id="details"
              placeholder="Décrivez la situation ou ajoutez des informations pertinentes..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
            />
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex gap-2">
              <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-orange-800 dark:text-orange-200">
                  Signalement anonyme
                </p>
                <p className="text-orange-700 dark:text-orange-300">
                  Votre identité ne sera pas révélée. Les signalements abusifs peuvent entraîner des sanctions.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
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
              variant="destructive"
              className="flex-1"
              disabled={isSubmitting || !selectedReason}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 animate-spin border-2 border-current border-t-transparent rounded-full mr-2" />
                  Envoi...
                </>
              ) : (
                <>
                  <Flag className="w-4 h-4 mr-2" />
                  Signaler
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};