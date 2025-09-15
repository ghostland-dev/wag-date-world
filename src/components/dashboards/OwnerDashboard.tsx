import { useState } from 'react';
import { PawPrint, Plus, Eye, MessageCircle, Heart, TrendingUp, Calendar, Edit } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '@/components/StatsCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const OwnerDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data - en production, vient de l'API
  const stats = {
    totalAnimals: 12,
    activeAds: 8,
    adoptionRequests: 15,
    totalViews: 2847,
    completedAdoptions: 23,
    monthlyViews: 456
  };

  const myAnimals = [
    {
      id: '1',
      name: 'Bella',
      breed: 'Labrador',
      type: 'Chien',
      status: 'available',
      views: 234,
      favorites: 12,
      requests: 3,
      createdAt: '2024-01-10',
      image: '/api/placeholder/100/100'
    },
    {
      id: '2', 
      name: 'Minou',
      breed: 'Persan',
      type: 'Chat',
      status: 'reserved',
      views: 189,
      favorites: 8,
      requests: 1,
      createdAt: '2024-01-08',
      image: '/api/placeholder/100/100'
    },
  ];

  const recentRequests = [
    {
      id: '1',
      animalName: 'Bella',
      adopterName: 'Sophie Martin',
      message: 'Bonjour, je suis très intéressée par Bella...',
      status: 'pending',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      animalName: 'Minou', 
      adopterName: 'Thomas Durand',
      message: 'Je recherche un chat calme pour ma famille...',
      status: 'approved',
      createdAt: '2024-01-14'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
      case 'reserved':
        return <Badge className="bg-orange-100 text-orange-800">Réservé</Badge>;
      case 'adopted':
        return <Badge className="bg-blue-100 text-blue-800">Adopté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="destructive">En attente</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="outline">Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mon espace propriétaire</h1>
          <p className="text-muted-foreground">Gérez vos annonces et demandes d'adoption</p>
        </div>
        <Button className="bg-[var(--gradient-primary)] gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle annonce
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Mes annonces"
          value={stats.totalAnimals}
          icon={PawPrint}
          description={`${stats.activeAds} actives`}
        />
        <StatsCard
          title="Demandes d'adoption"
          value={stats.adoptionRequests}
          icon={MessageCircle}
          description="À traiter"
          trend="up"
        />
        <StatsCard
          title="Vues totales"
          value={stats.totalViews.toLocaleString()}
          icon={Eye}
          description={`+${stats.monthlyViews} ce mois`}
          trend="up"
        />
        <StatsCard
          title="Adoptions réussies"
          value={stats.completedAdoptions}
          icon={Heart}
          description="Depuis le début"
        />
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="animals">Mes annonces</TabsTrigger>
          <TabsTrigger value="requests">Demandes</TabsTrigger>
          <TabsTrigger value="analytics">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Activité récente</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Nouvelle demande pour Bella</p>
                    <p className="text-sm text-muted-foreground">Il y a 2 heures</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Eye className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">45 nouvelles vues aujourd'hui</p>
                    <p className="text-sm text-muted-foreground">Toutes annonces</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Publier une nouvelle annonce
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Voir les demandes ({stats.adoptionRequests})
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Consulter les statistiques
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="animals" className="space-y-6">
          <Card>
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Mes annonces d'animaux</h3>
                <Button className="bg-[var(--gradient-primary)] gap-2">
                  <Plus className="w-4 h-4" />
                  Ajouter
                </Button>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Animal</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Vues</TableHead>
                  <TableHead>Favoris</TableHead>
                  <TableHead>Demandes</TableHead>
                  <TableHead>Date création</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myAnimals.map((animal) => (
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
                            {animal.breed} • {animal.type}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(animal.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        {animal.views}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-muted-foreground" />
                        {animal.favorites}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{animal.requests}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(animal.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <Card>
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Demandes d'adoption</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Animal</TableHead>
                  <TableHead>Demandeur</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.animalName}</TableCell>
                    <TableCell>{request.adopterName}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {request.message}
                    </TableCell>
                    <TableCell>{getRequestStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <>
                            <Button variant="outline" size="sm" className="text-green-600">
                              Approuver
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              Rejeter
                            </Button>
                          </>
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

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Performance mensuelle</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Vues totales</span>
                  <span className="font-semibold">{stats.monthlyViews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Nouvelles demandes</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Adoptions finalisées</span>
                  <span className="font-semibold">2</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Conseils pour améliorer</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    📸 Ajoutez plus de photos de qualité
                  </p>
                  <p className="text-sm text-blue-600">
                    Les annonces avec 5+ photos reçoivent 60% plus de vues
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    ✍️ Complétez les descriptions
                  </p>
                  <p className="text-sm text-green-600">
                    Détaillez le caractère et les habitudes de l'animal
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};