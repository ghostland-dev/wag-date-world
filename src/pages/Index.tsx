import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { EnhancedMatchSection } from "@/components/EnhancedMatchSection";
import { MatchesPage } from "@/components/pages/MatchesPage";
import { ProfilePage } from "@/components/pages/ProfilePage";
import { SettingsPage } from "@/components/pages/SettingsPage";
import { FavoritesPage } from "@/components/FavoritesManager";
import { MessagesPage } from "@/components/MessagesPage";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { CookieConsent } from "@/components/CookieConsent";
import { SEOHead } from "@/components/SEOHead";
import { OnboardingModal } from "@/components/OnboardingModal";
import { OfflineIndicator } from "@/components/OfflineManager";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { SuperAdminDashboard } from "@/components/dashboards/SuperAdminDashboard";
import { OwnerDashboard } from "@/components/dashboards/OwnerDashboard";
import { AdopterDashboard } from "@/components/dashboards/AdopterDashboard";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";
import { AIRecommendations } from "@/components/AIRecommendations";
import { AdvancedStats } from "@/components/AdvancedStats";
import { useUser } from "@/contexts/UserContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAnalytics } from "@/hooks/useAnalytics";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("discover");
  const [matches, setMatches] = useLocalStorage<string[]>('petmatch_matches', []);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage('petmatch_onboarding', false);
  const { user, isAuthenticated, login, isLoading } = useUser();
  const { track, page, identify } = useAnalytics();

  useEffect(() => {
    page(currentPage);
  }, [currentPage, page]);

  useEffect(() => {
    if (user) {
      identify(user.id, { name: user.name, email: user.email });
    }
  }, [user, identify]);

  const handleLike = (id: string) => {
    setMatches(prev => {
      const newMatches = [...prev, id];
      track('animal_liked', { animalId: id });
      if (!prev.includes(id)) {
        track('match_created', { animalId: id });
      }
      return newMatches;
    });
  };

  const handleAuthSuccess = (userData: any) => {
    login(userData);
    track('auth_signin', { userId: userData.id });
  };

  const getPageSEO = () => {
    switch (currentPage) {
      case "matches":
        return {
          title: "Mes Matches - PetMatch",
          description: `Vous avez ${matches.length} matches ! Chattez avec les propriétaires d'animaux compatibles.`
        };
      case "favorites":
        return {
          title: "Mes Favoris - PetMatch",
          description: "Votre liste de souhaits d'animaux de compagnie."
        };
      case "messages":
        return {
          title: "Messages - PetMatch", 
          description: "Vos conversations avec les propriétaires d'animaux."
        };
      case "ai-recommendations":
        return {
          title: "Recommandations IA - PetMatch",
          description: "Suggestions personnalisées par intelligence artificielle."
        };
      case "stats":
        return {
          title: "Statistiques - PetMatch",
          description: "Analyses détaillées de votre activité sur PetMatch."
        };
      case "profile":
        return {
          title: "Mon Profil - PetMatch",
          description: "Gérez votre profil et les informations de vos animaux de compagnie."
        };
      case "settings":
        return {
          title: "Paramètres - PetMatch",
          description: "Configurez vos préférences de recherche et de confidentialité."
        };
      default:
        return {
          title: "PetMatch - Rencontres pour animaux de compagnie",
          description: "Trouvez le partenaire idéal pour votre animal : reproduction responsable et socialisation."
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" text="Chargement de PetMatch..." />
      </div>
    );
  }

  const renderCurrentPage = () => {
    if (!isAuthenticated && currentPage !== "discover") {
      return (
        <>
          <Hero />
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Connectez-vous pour accéder à cette fonctionnalité
            </h2>
            <p className="text-muted-foreground mb-6">
              Créez un compte gratuit pour découvrir des compagnons pour votre animal
            </p>
          </div>
        </>
      );
    }

    // Dashboards basés sur le rôle
    if (user?.role === 'super_admin' && currentPage === 'admin') {
      return (
        <RoleBasedRoute allowedRoles={['super_admin']}>
          <SuperAdminDashboard />
        </RoleBasedRoute>
      );
    }

    if (user?.role === 'owner' && currentPage === 'dashboard') {
      return (
        <RoleBasedRoute allowedRoles={['owner']}>
          <OwnerDashboard />
        </RoleBasedRoute>
      );
    }

    if (user?.role === 'adopter' && currentPage === 'dashboard') {
      return (
        <RoleBasedRoute allowedRoles={['adopter']}>
          <AdopterDashboard />
        </RoleBasedRoute>
      );
    }

    switch (currentPage) {
      case "discover":
        return (
          <>
            <Hero />
            <EnhancedMatchSection onMatch={handleLike} />
          </>
        );
      case "matches":
        return <MatchesPage matches={matches} />;
      case "favorites":
        return <FavoritesPage />;
      case "messages":
        return <MessagesPage />;
      case "ai-recommendations":
        return <AIRecommendations />;
      case "stats":
        return <AdvancedStats />;
      case "profile":
        return <ProfilePage />;
      case "settings":
        return <SettingsPage />;
      default:
        return (
          <>
            <Hero />
            <EnhancedMatchSection onMatch={handleLike} />
          </>
        );
    }
  };

  return (
    <>
      <SEOHead {...getPageSEO()} />
      <div className="min-h-screen bg-background">
        <Navigation 
          currentPage={currentPage} 
          onPageChange={setCurrentPage}
          matchCount={matches.length}
          onAuthClick={() => setShowAuthModal(true)}
        />
        <main className="animate-fade-in pb-20 md:pb-0">
          {renderCurrentPage()}
        </main>
        <div className="hidden md:block">
          <Footer />
        </div>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          matchCount={matches.length}
        />
        
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />
        
        <OnboardingModal
          isOpen={!hasSeenOnboarding && !isLoading}
          onComplete={() => setHasSeenOnboarding(true)}
        />
        
        <CookieConsent />
        <OfflineIndicator />
        <PWAInstallPrompt />
      </div>
    </>
  );
};

export default Index;
