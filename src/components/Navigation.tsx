import { Heart, User, Settings, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  matchCount: number;
}

export const Navigation = ({ currentPage, onPageChange, matchCount }: NavigationProps) => {
  const navItems = [
    { id: "discover", label: "Découvrir", icon: Heart },
    { id: "matches", label: "Matches", icon: MessageCircle, badge: matchCount },
    { id: "profile", label: "Profil", icon: User },
    { id: "settings", label: "Paramètres", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[var(--gradient-primary)] rounded-full">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent">
              PetMatch
            </h1>
          </div>
          
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`relative ${isActive ? "bg-[var(--gradient-primary)]" : "hover:bg-accent"}`}
                  onClick={() => onPageChange(item.id)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};