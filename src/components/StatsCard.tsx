import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend = "neutral",
  className = "" 
}: StatsCardProps) => {
  const trendColors = {
    up: "text-secondary",
    down: "text-destructive", 
    neutral: "text-muted-foreground"
  };

  return (
    <Card className={`p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-soft)] transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <p className="text-3xl font-bold text-foreground">
            {value}
          </p>
          {description && (
            <p className={`text-sm ${trendColors[trend]}`}>
              {description}
            </p>
          )}
        </div>
        <div className="p-3 bg-[var(--gradient-primary)] rounded-full">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
};