import { useState } from "react";
import { ArrowRight, ArrowLeft, Heart, Users, MapPin, Shield, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const onboardingSteps = [
  {
    title: "Bienvenue sur PetMatch ! 🐾",
    description: "L'application qui connecte les propriétaires d'animaux pour la reproduction et la socialisation.",
    icon: Heart,
    features: [
      "Trouvez des partenaires compatibles",
      "Rencontres sécurisées et vérifiées",
      "Chat intégré avec les matches"
    ]
  },
  {
    title: "Comment ça marche ?",
    description: "Un processus simple en 3 étapes pour connecter vos animaux.",
    icon: Users,
    features: [
      "1. Créez le profil de votre animal",
      "2. Découvrez des profils compatibles",
      "3. Organisez des rencontres en toute sécurité"
    ]
  },
  {
    title: "Sécurité et localisation",
    description: "Vos données sont protégées et les rencontres se font près de chez vous.",
    icon: Shield,
    features: [
      "Profils vérifiés par nos équipes",
      "Géolocalisation pour proximité",
      "Système de signalement intégré"
    ]
  },
  {
    title: "Prêt à commencer !",
    description: "Votre aventure PetMatch commence maintenant. Trouvons le compagnon idéal !",
    icon: Check,
    features: [
      "Créez votre premier profil d'animal",
      "Explorez les fonctionnalités",
      "Connectez-vous avec la communauté"
    ]
  }
];

export const OnboardingModal = ({ isOpen, onComplete }: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  const step = onboardingSteps[currentStep];
  const Icon = step.icon;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Guide de démarrage PetMatch</DialogTitle>
          <DialogDescription>
            Découvrez comment utiliser PetMatch pour connecter vos animaux de compagnie
          </DialogDescription>
        </DialogHeader>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-4 top-4 z-10 bg-background/80 backdrop-blur-sm"
          onClick={skipOnboarding}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        <div className="relative overflow-hidden">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 h-1 bg-muted">
            <div 
              className="h-full bg-[var(--gradient-primary)] transition-all duration-500"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            />
          </div>

          <div className="p-8 pt-12">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-[var(--gradient-primary)] rounded-full">
                  <Icon className="w-12 h-12 text-white" />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-bold text-foreground">
                  {step.title}
                </h2>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  {step.description}
                </p>
              </div>

              <Card className="p-6 text-left max-w-md mx-auto">
                <ul className="space-y-3">
                  {step.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <div className="flex items-center justify-between pt-6">
                <div className="flex space-x-2">
                  {onboardingSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    onClick={skipOnboarding}
                    className="text-muted-foreground"
                  >
                    Passer
                  </Button>

                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      size="icon"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  )}

                  <Button
                    onClick={nextStep}
                    className="bg-[var(--gradient-primary)] gap-2"
                  >
                    {currentStep === onboardingSteps.length - 1 ? 'Commencer' : 'Suivant'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};