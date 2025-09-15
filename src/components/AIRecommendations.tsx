import { useState, useEffect } from "react";
import { Sparkles, TrendingUp, Heart, Award, Users, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { animals, Animal } from "@/data/animals";
import { useToast } from "@/hooks/use-toast";

interface RecommendationScore {
  compatibility: number;
  distance: number;
  activity: number;
  personality: number;
  overall: number;
}

interface AIRecommendation {
  animal: Animal;
  score: RecommendationScore;
  reasons: string[];
  matchType: 'perfect' | 'great' | 'good';
}

interface AIRecommendationsProps {
  userPreferences?: {
    animalType: string;
    purpose: string;
    distance: number;
  };
  onAnimalClick?: (animal: Animal) => void;
  className?: string;
}

export const AIRecommendations = ({ 
  userPreferences,
  onAnimalClick,
  className 
}: AIRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateAIScores = (animal: Animal): RecommendationScore => {
    // Simulate AI scoring based on various factors
    const compatibility = Math.random() * 30 + 70; // 70-100%
    const distance = Math.random() * 20 + 80; // 80-100%
    const activity = Math.random() * 25 + 75; // 75-100%
    const personality = Math.random() * 30 + 70; // 70-100%
    
    const overall = (compatibility * 0.4 + distance * 0.2 + activity * 0.2 + personality * 0.2);
    
    return {
      compatibility: Math.round(compatibility),
      distance: Math.round(distance),
      activity: Math.round(activity),
      personality: Math.round(personality),
      overall: Math.round(overall)
    };
  };

  const generateReasons = (animal: Animal, score: RecommendationScore): string[] => {
    const reasons = [];
    
    if (score.compatibility > 90) {
      reasons.push("Compatibilité parfaite de tempérament");
    } else if (score.compatibility > 80) {
      reasons.push("Très bonne compatibilité comportementale");
    }
    
    if (score.distance > 90) {
      reasons.push("Très proche géographiquement");
    }
    
    if (score.activity > 85) {
      reasons.push("Niveau d'activité similaire");
    }
    
    if (animal.purpose === "Reproduction") {
      reasons.push("Idéal pour la reproduction");
    } else {
      reasons.push("Parfait pour la socialisation");
    }
    
    reasons.push(`Race ${animal.breed} très recherchée`);
    
    return reasons.slice(0, 3); // Limit to 3 reasons
  };

  const getMatchType = (score: number): 'perfect' | 'great' | 'good' => {
    if (score >= 95) return 'perfect';
    if (score >= 85) return 'great';
    return 'good';
  };

  const generateRecommendations = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiRecommendations: AIRecommendation[] = animals
      .slice(0, 6) // Get top 6 recommendations
      .map(animal => {
        const score = generateAIScores(animal);
        const reasons = generateReasons(animal, score);
        const matchType = getMatchType(score.overall);
        
        return {
          animal,
          score,
          reasons,
          matchType
        };
      })
      .sort((a, b) => b.score.overall - a.score.overall); // Sort by overall score

    setRecommendations(aiRecommendations);
    setIsGenerating(false);
    
    toast({
      title: "🤖 IA Recommendations Ready",
      description: `${aiRecommendations.length} profils analysés avec l'IA`,
    });
  };

  useEffect(() => {
    generateRecommendations();
  }, [userPreferences]);

  const getMatchTypeColor = (type: 'perfect' | 'great' | 'good') => {
    switch (type) {
      case 'perfect': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'great': return 'bg-gradient-to-r from-blue-500 to-green-500';
      case 'good': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    }
  };

  const getMatchTypeText = (type: 'perfect' | 'great' | 'good') => {
    switch (type) {
      case 'perfect': return 'Match Parfait';
      case 'great': return 'Excellent Match';
      case 'good': return 'Bon Match';
    }
  };

  if (isGenerating) {
    return (
      <Card className={`p-8 text-center ${className}`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-pulse">
            <Sparkles className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">IA en cours d'analyse...</h3>
          <p className="text-muted-foreground">
            Analyse des compatibilités et génération des recommandations personnalisées
          </p>
          <Progress value={75} className="w-48" />
        </div>
      </Card>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Recommandations IA</h2>
            <p className="text-muted-foreground">Sélections personnalisées par intelligence artificielle</p>
          </div>
        </div>
        <Button 
          onClick={generateRecommendations} 
          variant="outline" 
          className="gap-2"
          disabled={isGenerating}
        >
          <TrendingUp className="w-4 h-4" />
          Actualiser
        </Button>
      </div>

      <div className="grid gap-6">
        {recommendations.map((rec, index) => (
          <Card 
            key={rec.animal.id} 
            className={`p-6 transition-all duration-300 hover:shadow-lg cursor-pointer relative overflow-hidden ${
              rec.matchType === 'perfect' ? 'border-purple-200 bg-gradient-to-r from-purple-50/50 to-pink-50/50' :
              rec.matchType === 'great' ? 'border-blue-200 bg-gradient-to-r from-blue-50/50 to-green-50/50' :
              'border-orange-200 bg-gradient-to-r from-yellow-50/50 to-orange-50/50'
            }`}
            onClick={() => onAnimalClick?.(rec.animal)}
          >
            {/* Rank Badge */}
            <div className="absolute top-4 left-4">
              <Badge className={`${getMatchTypeColor(rec.matchType)} text-white font-bold px-3 py-1`}>
                #{index + 1} {getMatchTypeText(rec.matchType)}
              </Badge>
            </div>

            {/* Overall Score */}
            <div className="absolute top-4 right-4 text-right">
              <div className="text-2xl font-bold text-foreground">{rec.score.overall}%</div>
              <div className="text-sm text-muted-foreground">Compatibilité</div>
            </div>

            <div className="flex gap-6 mt-8">
              {/* Animal Image */}
              <Avatar className="w-24 h-24">
                <AvatarImage src={rec.animal.image} alt={rec.animal.name} />
                <AvatarFallback>{rec.animal.name[0]}</AvatarFallback>
              </Avatar>

              {/* Animal Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{rec.animal.name}</h3>
                  <p className="text-muted-foreground">{rec.animal.breed} • {rec.animal.age} • {rec.animal.location}</p>
                </div>

                {/* AI Reasons */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Pourquoi ce match ?
                  </h4>
                  <ul className="space-y-1">
                    {rec.reasons.map((reason, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Compatibilité</span>
                      <span className="text-xs font-medium">{rec.score.compatibility}%</span>
                    </div>
                    <Progress value={rec.score.compatibility} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Distance</span>
                      <span className="text-xs font-medium">{rec.score.distance}%</span>
                    </div>
                    <Progress value={rec.score.distance} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Activité</span>
                      <span className="text-xs font-medium">{rec.score.activity}%</span>
                    </div>
                    <Progress value={rec.score.activity} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Personnalité</span>
                      <span className="text-xs font-medium">{rec.score.personality}%</span>
                    </div>
                    <Progress value={rec.score.personality} className="h-2" />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1">
                <Heart className="w-4 h-4 mr-2" />
                Voir le profil
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90">
                <Star className="w-4 h-4 mr-2" />
                Match instantané
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};