import { Shield, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'not_verified';

interface VerificationBadgeProps {
  status: VerificationStatus;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const VerificationBadge = ({ 
  status, 
  className,
  size = 'md' 
}: VerificationBadgeProps) => {
  const getStatusConfig = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return {
          icon: <CheckCircle className={cn("text-white", size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />,
          text: "Vérifié",
          variant: "default" as const,
          bgColor: "bg-secondary",
          tooltip: "Profil vérifié par nos équipes"
        };
      case 'pending':
        return {
          icon: <Clock className={cn("text-white", size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />,
          text: "En attente",
          variant: "secondary" as const,
          bgColor: "bg-yellow-500",
          tooltip: "Vérification en cours"
        };
      case 'rejected':
        return {
          icon: <AlertCircle className={cn("text-white", size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />,
          text: "Non vérifié",
          variant: "destructive" as const,
          bgColor: "bg-destructive",
          tooltip: "Vérification échouée"
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig(status);
  
  if (!config) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge 
            variant={config.variant}
            className={cn(
              "flex items-center gap-1",
              config.bgColor,
              size === 'sm' && "text-xs px-1.5 py-0.5",
              size === 'lg' && "text-sm px-3 py-1",
              className
            )}
          >
            {config.icon}
            <span>{config.text}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface VerificationStatusCardProps {
  status: VerificationStatus;
  onRequestVerification?: () => void;
  className?: string;
}

export const VerificationStatusCard = ({
  status,
  onRequestVerification,
  className
}: VerificationStatusCardProps) => {
  const getCardContent = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return {
          icon: <Shield className="w-12 h-12 text-secondary" />,
          title: "Profil vérifié",
          description: "Votre profil a été vérifié avec succès. Les utilisateurs peuvent voir que vous êtes un propriétaire de confiance.",
          bgColor: "bg-secondary/10",
          borderColor: "border-secondary/20"
        };
      case 'pending':
        return {
          icon: <Clock className="w-12 h-12 text-yellow-500" />,
          title: "Vérification en cours",
          description: "Votre demande de vérification est en cours d'examen. Nous vous contacterons sous 48h.",
          bgColor: "bg-yellow-500/10",
          borderColor: "border-yellow-500/20"
        };
      case 'rejected':
        return {
          icon: <AlertCircle className="w-12 h-12 text-destructive" />,
          title: "Vérification échouée",
          description: "Votre demande de vérification a été refusée. Veuillez vérifier vos documents et réessayer.",
          bgColor: "bg-destructive/10",
          borderColor: "border-destructive/20",
          showButton: true
        };
      default:
        return {
          icon: <Shield className="w-12 h-12 text-muted-foreground" />,
          title: "Profil non vérifié",
          description: "Obtenez un badge de vérification pour augmenter la confiance des autres utilisateurs.",
          bgColor: "bg-muted/20",
          borderColor: "border-muted",
          showButton: true
        };
    }
  };

  const content = getCardContent(status);

  return (
    <Card className={cn(
      "p-6 transition-all duration-200",
      content.bgColor,
      content.borderColor,
      className
    )}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {content.icon}
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {content.title}
            </h3>
            <p className="text-muted-foreground">
              {content.description}
            </p>
          </div>
          
          {content.showButton && onRequestVerification && (
            <Button 
              onClick={onRequestVerification}
              variant={status === 'rejected' ? 'destructive' : 'default'}
              size="sm"
            >
              {status === 'rejected' ? 'Réessayer la vérification' : 'Demander la vérification'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};