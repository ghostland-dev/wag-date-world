import { useState } from 'react';
import { Heart, Search, MessageCircle, Calendar, PawPrint, Filter, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '@/components/StatsCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export const AdopterDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data - en production, vient de l'API
  const stats = {
    favorites: 23,
    applications: 5,
    matches: 12,
    visits: 3,
    savedSearches: 4,
    messagesCount: 8
  };

  const myApplications = [
    {
      id: '1',
      animalName: 'Bella',
      animalBreed: 'Labrador',
      ownerName: 'Marie Dupont',
      status: 'pending',
      appliedAt: '2024-01-15',
      visitScheduled: '2024-01-20',
      animalImage: '/api/placeholder/60/60'
    },
    {
      id: '2',
      animalName: 'Minou',
      animalBreed: 'Persan',
      ownerName: 'Refuge SPA',
      status: 'approved',
      appliedAt: '2024-01-12',
      visitScheduled: '2024-01-18',
      animalImage: '/api/placeholder/60/60'
    },
  ];

  const favoriteAnimals = [
    {
      id: '1',
      name: 'Luna',
      breed: 'Border Collie',
      location: 'Paris, 75011',
      age: '2 ans',
      status: 'available',
      addedAt: '2024-01-14',
      image: '/api/placeholder/60/60'
    },
    {
      id: '2',
      name: 'Oscar',
      breed: 'Maine Coon',
      location: 'Lyon, 69003',
      age: '3 ans',
      status: 'reserved',
      addedAt: '2024-01-13',
      image: '/api/placeholder/60/60'
    },
  ];

  const recentMessages = [
    {
      id: '1',
      from: 'Marie Dupont',
      animalName: 'Bella',
      lastMessage: 'Merci pour votre candidature, nous pouvons organiser une visite...',
      unread: true,
      timestamp: '2024-01-15T14:30:00'
    },
    {
      id: '2',
      from: 'Refuge SPA Lyon',
      animalName: 'Minou',
      lastMessage: 'Parfait ! Rendez-vous samedi à 14h.',
      unread: false,
      timestamp: '2024-01-14T16:45:00'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="destructive">En attente</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="outline">Rejeté</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Finalisé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAnimalStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
      case 'reserved':
        return <Badge className="bg-orange-100 text-orange-800">Réservé</Badge>;
      case 'adopted':
        return <Badge variant="outline">Adopté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mon espace adoptant</h1>
          <p className="text-muted-foreground">Trouvez votre compagnon idéal</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Recherche avancée
          </Button>
          <Button className="bg-[var(--gradient-primary)] gap-2">
            <Search className="w-4 h-4" />
            Découvrir
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Favoris"
          value={stats.favorites}
          icon={Heart}
          description="Animaux sauvegardés"
        />
        <StatsCard
          title="Candidatures"
          value={stats.applications}
          icon={MessageCircle}
          description="En cours"
          trend="up"
        />
        <StatsCard
          title="Visites prévues"
          value={stats.visits}
          icon={Calendar}
          description="À venir"
        />
        <StatsCard
          title="Messages"
          value={stats.messagesCount}
          icon={MessageCircle}
          description="Conversations actives"
        />
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="applications">Mes candidatures</TabsTrigger>
          <TabsTrigger value="favorites">Favoris</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Prochains rendez-vous</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Visite pour Bella</p>
                    <p className="text-sm text-muted-foreground">
                      Samedi 20 janvier à 14h - Marie Dupont
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Visite pour Minou</p>
                    <p className="text-sm text-muted-foreground">
                      Jeudi 18 janvier à 10h - Refuge SPA
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recommandations</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    🏠 Préparez votre logement
                  </p>
                  <p className="text-sm text-blue-600">
                    Sécurisez l'espace et préparez l'arrivée de votre futur compagnon
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    📋 Questionnaire d'adoption
                  </p>
                  <p className="text-sm text-green-600">
                    Complétez votre profil pour faciliter les candidatures
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Mes candidatures d'adoption</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Animal</TableHead>
                  <TableHead>Propriétaire</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date candidature</TableHead>
                  <TableHead>Visite prévue</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img 
                          src={application.animalImage} 
                          alt={application.animalName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{application.animalName}</p>
                          <p className="text-sm text-muted-foreground">
                            {application.animalBreed}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{application.ownerName}</TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell>
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {application.visitScheduled ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(application.visitScheduled).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Non programmée</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          <Card>
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Mes animaux favoris</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Animal</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Âge</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Ajouté le</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {favoriteAnimals.map((animal) => (
                  <TableRow key={animal.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img 
                          src={animal.image} 
                          alt={animal.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{animal.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {animal.breed}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {animal.location}
                      </div>
                    </TableCell>
                    <TableCell>{animal.age}</TableCell>
                    <TableCell>{getAnimalStatusBadge(animal.status)}</TableCell>
                    <TableCell>
                      {new Date(animal.addedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {animal.status === 'available' && (
                          <Button variant="outline" size="sm" className="text-primary">
                            Candidater
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Messages récents</h3>
            </div>
            <div className="divide-y">
              {recentMessages.map((message) => (
                <div key={message.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{message.from.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{message.from}</p>
                          <Badge variant="outline" className="text-xs">
                            {message.animalName}
                          </Badge>
                          {message.unread && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 truncate">
                        {message.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};