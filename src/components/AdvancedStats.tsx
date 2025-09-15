import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, Heart, Calendar, Award, Target, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAnalytics } from "@/hooks/useAnalytics";

interface UserStats {
  totalLikes: number;
  totalMatches: number;
  totalMessages: number;
  profileViews: number;
  successRate: number;
  averageResponseTime: number;
  streakDays: number;
  achievements: string[];
}

interface WeeklyData {
  day: string;
  likes: number;
  matches: number;
  messages: number;
}

export const AdvancedStats = () => {
  const [stats, setStats] = useLocalStorage<UserStats>('petmatch_user_stats', {
    totalLikes: 0,
    totalMatches: 0,
    totalMessages: 0,
    profileViews: 0,
    successRate: 0,
    averageResponseTime: 0,
    streakDays: 0,
    achievements: []
  });

  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const { track } = useAnalytics();

  // Generate mock weekly data
  useEffect(() => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const mockData = days.map(day => ({
      day,
      likes: Math.floor(Math.random() * 20) + 5,
      matches: Math.floor(Math.random() * 8) + 1,
      messages: Math.floor(Math.random() * 15) + 3
    }));
    setWeeklyData(mockData);
  }, []);

  // Mock stats generation
  useEffect(() => {
    const mockStats: UserStats = {
      totalLikes: 147,
      totalMatches: 23,
      totalMessages: 89,
      profileViews: 312,
      successRate: Math.round((23 / 147) * 100), // matches/likes ratio
      averageResponseTime: 2.5, // hours
      streakDays: 12,
      achievements: [
        '🎯 Premier Match',
        '💬 Conversationnel',
        '⭐ Populaire',
        '🔥 Série de 10',
        '💝 Charmeur',
        '🏆 Top Matcher'
      ]
    };
    
    if (stats.totalLikes === 0) {
      setStats(mockStats);
    }
  }, [stats, setStats]);

  const getProgressColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    if (percentage >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend, 
    color = "primary" 
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: any;
    trend?: number;
    color?: string;
  }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}/10`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
      </div>
      {trend !== undefined && (
        <div className="mt-4 flex items-center">
          <TrendingUp className={`w-4 h-4 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          <span className={`text-sm ml-1 ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend >= 0 ? '+' : ''}{trend}% vs semaine dernière
          </span>
        </div>
      )}
    </Card>
  );

  const AchievementBadge = ({ achievement }: { achievement: string }) => (
    <Badge 
      variant="secondary" 
      className="px-3 py-2 text-sm bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200"
    >
      {achievement}
    </Badge>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Statistiques Avancées</h2>
          <p className="text-muted-foreground">Analyse détaillée de votre activité</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={selectedPeriod === 'week' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedPeriod('week')}
          >
            7 jours
          </Button>
          <Button 
            variant={selectedPeriod === 'month' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedPeriod('month')}
          >
            30 jours
          </Button>
          <Button 
            variant={selectedPeriod === 'year' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedPeriod('year')}
          >
            1 an
          </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Likes"
          value={stats.totalLikes}
          subtitle="Animaux likés"
          icon={Heart}
          trend={12}
          color="red-500"
        />
        <StatCard
          title="Matches"
          value={stats.totalMatches}
          subtitle="Matches créés"
          icon={Users}
          trend={8}
          color="green-500"
        />
        <StatCard
          title="Messages"
          value={stats.totalMessages}
          subtitle="Messages envoyés"
          icon={BarChart3}
          trend={-2}
          color="blue-500"
        />
        <StatCard
          title="Taux de succès"
          value={`${stats.successRate}%`}
          subtitle="Likes → Matches"
          icon={Target}
          trend={5}
          color="purple-500"
        />
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="achievements">Succès</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Activity Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Activité cette semaine
              </h3>
              <div className="space-y-4">
                {weeklyData.map((day, index) => (
                  <div key={day.day} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{day.day}</span>
                      <span className="text-muted-foreground">
                        {day.likes} likes • {day.matches} matches
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Progress 
                        value={(day.likes / 25) * 100} 
                        className="h-2 flex-1"
                      />
                      <Progress 
                        value={(day.matches / 10) * 100} 
                        className="h-2 flex-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Statistiques rapides
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Vues du profil</span>
                  <span className="font-semibold">{stats.profileViews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Temps de réponse moyen</span>
                  <span className="font-semibold">{stats.averageResponseTime}h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Série de jours actifs</span>
                  <Badge variant="default" className="bg-orange-500">
                    {stats.streakDays} jours 🔥
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Popularité</span>
                  <div className="flex items-center gap-2">
                    <Progress value={75} className="w-20 h-2" />
                    <span className="text-sm font-semibold">75%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Activité détaillée</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">23</p>
                <p className="text-sm text-blue-700">Jours actifs ce mois</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Heart className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">5.2</p>
                <p className="text-sm text-green-700">Likes par jour</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">1.8</p>
                <p className="text-sm text-purple-700">Matches par jour</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Indicateurs de performance</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Taux de conversion (Like → Match)</span>
                  <span className="text-sm text-muted-foreground">{stats.successRate}%</span>
                </div>
                <Progress value={stats.successRate} className="h-3" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Attractivité du profil</span>
                  <span className="text-sm text-muted-foreground">78%</span>
                </div>
                <Progress value={78} className="h-3" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Engagement conversationnel</span>
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
                <Progress value={85} className="h-3" />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Succès débloqués ({stats.achievements.length}/12)
            </h3>
            <div className="flex flex-wrap gap-3">
              {stats.achievements.map((achievement, index) => (
                <AchievementBadge key={index} achievement={achievement} />
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Prochains objectifs</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>🎯 Atteignez 50 matches pour débloquer "Master Matcher"</li>
                <li>💬 Envoyez 150 messages pour débloquer "Social Butterfly"</li>
                <li>⚡ Maintenez une série de 30 jours pour "Consistency King"</li>
              </ul>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};