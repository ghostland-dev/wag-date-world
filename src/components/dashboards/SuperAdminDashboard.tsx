import { useState } from 'react';
import { Users, PawPrint, Shield, TrendingUp, AlertTriangle, Settings, Eye, Ban } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '@/components/StatsCard';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const SuperAdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data - en production, vient de l'API
  const stats = {
    totalUsers: 15247,
    totalAnimals: 3892,
    pendingVerifications: 23,
    todaySignups: 45,
    monthlyGrowth: 12.5,
    reportedContent: 8
  };

  const recentUsers = [
    { id: '1', name: 'Marie Dupont', email: 'marie@email.com', role: 'owner', createdAt: '2024-01-15', isVerified: true },
    { id: '2', name: 'Refuge SPA Lyon', email: 'contact@spa-lyon.fr', role: 'owner', createdAt: '2024-01-14', isVerified: false },
    { id: '3', name: 'Pierre Martin', email: 'pierre@email.com', role: 'adopter', createdAt: '2024-01-14', isVerified: true },
  ];

  const reportedContent = [
    { id: '1', type: 'animal', title: 'Chaton persan suspect', reporter: 'Julie L.', reason: 'Photos douteuses', status: 'pending' },
    { id: '2', type: 'user', title: 'Profil frauduleux', reporter: 'Marc D.', reason: 'Informations falsifiées', status: 'reviewing' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Administration</h1>
          <p className="text-muted-foreground">Gestion globale de la plateforme PetMatch</p>
        </div>
        <Button className="bg-[var(--gradient-primary)] gap-2">
          <Settings className="w-4 h-4" />
          Paramètres système
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Utilisateurs totaux"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          description={`+${stats.todaySignups} aujourd'hui`}
          trend="up"
        />
        <StatsCard
          title="Animaux publiés"
          value={stats.totalAnimals.toLocaleString()}
          icon={PawPrint}
          description="Toutes catégories"
        />
        <StatsCard
          title="Vérifications en attente"
          value={stats.pendingVerifications}
          icon={Shield}
          description="Nécessitent une action"
          trend="neutral"
        />
        <StatsCard
          title="Signalements"
          value={stats.reportedContent}
          icon={AlertTriangle}
          description="À traiter"
          trend="down"
        />
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="content">Contenus</TabsTrigger>
          <TabsTrigger value="reports">Signalements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Croissance mensuelle</h3>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">+{stats.monthlyGrowth}%</span>
                <span className="text-muted-foreground">vs mois précédent</span>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Vérifier les profils ({stats.pendingVerifications})
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Traiter les signalements ({stats.reportedContent})
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Utilisateurs récents</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Date d'inscription</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'owner' ? 'default' : 'secondary'}>
                        {user.role === 'owner' ? 'Propriétaire' : 'Adoptant'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={user.isVerified ? 'default' : 'destructive'}>
                        {user.isVerified ? 'Vérifié' : 'En attente'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Ban className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Gestion du contenu</h3>
            <p className="text-muted-foreground mb-4">
              Gérez les annonces d'animaux, vérifiez les contenus et modérez la plateforme.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex-col">
                <PawPrint className="w-6 h-6 mb-2" />
                <span>Annonces d'animaux</span>
                <span className="text-sm text-muted-foreground">{stats.totalAnimals}</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col">
                <Shield className="w-6 h-6 mb-2" />
                <span>À vérifier</span>
                <span className="text-sm text-muted-foreground">{stats.pendingVerifications}</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col">
                <AlertTriangle className="w-6 h-6 mb-2" />
                <span>Signalés</span>
                <span className="text-sm text-muted-foreground">{stats.reportedContent}</span>
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">Signalements en attente</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Contenu</TableHead>
                  <TableHead>Signalé par</TableHead>
                  <TableHead>Motif</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportedContent.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {report.type === 'animal' ? 'Animal' : 'Utilisateur'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{report.title}</TableCell>
                    <TableCell>{report.reporter}</TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>
                      <Badge variant={report.status === 'pending' ? 'destructive' : 'default'}>
                        {report.status === 'pending' ? 'En attente' : 'En cours'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Examiner</Button>
                        <Button variant="destructive" size="sm">Rejeter</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};