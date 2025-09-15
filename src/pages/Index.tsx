import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { MatchSection } from "@/components/MatchSection";
import { MatchesPage } from "@/components/pages/MatchesPage";
import { ProfilePage } from "@/components/pages/ProfilePage";
import { SettingsPage } from "@/components/pages/SettingsPage";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("discover");
  const [matches, setMatches] = useState<string[]>([]);

  const handleLike = (id: string) => {
    setMatches(prev => [...prev, id]);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "discover":
        return (
          <>
            <Hero />
            <MatchSection onMatch={handleLike} />
          </>
        );
      case "matches":
        return <MatchesPage matches={matches} />;
      case "profile":
        return <ProfilePage />;
      case "settings":
        return <SettingsPage />;
      default:
        return (
          <>
            <Hero />
            <MatchSection onMatch={handleLike} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        matchCount={matches.length}
      />
      <main className="animate-fade-in">
        {renderCurrentPage()}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
