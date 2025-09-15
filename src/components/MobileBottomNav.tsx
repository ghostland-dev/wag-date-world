import { Heart, Search, MessageCircle, User, Settings, Star, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  matchCount?: number;
  className?: string;
}

export const MobileBottomNav = ({ 
  currentPage, 
  onPageChange, 
  matchCount = 0, 
  className 
}: MobileBottomNavProps) => {
  const navItems = [
    {
      id: "discover",
      label: "Découvrir",
      icon: Search,
      badge: null,
    },
    {
      id: "matches",
      label: "Matches",
      icon: Heart,
      badge: matchCount > 0 ? matchCount : null,
    },
    {
      id: "favorites",
      label: "Favoris", 
      icon: Star,
      badge: null, 
    },
    {
      id: "messages",
      label: "Messages", 
      icon: MessageCircle,
      badge: null, 
    },
    {
      id: "ai-recommendations",
      label: "IA",
      icon: Sparkles,
      badge: null,
    },
  ];

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border",
      "md:hidden", // Hide on desktop
      className
    )}>
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "flex-1 flex flex-col items-center gap-1 h-auto py-2 px-2",
                "text-xs font-medium",
                isActive 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => onPageChange(item.id)}
            >
              <div className="relative">
                <Icon className={cn(
                  "w-5 h-5",
                  isActive && "text-primary"
                )} />
                {item.badge && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className={cn(
                "text-xs leading-none",
                isActive && "text-primary font-semibold"
              )}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};