import { ReactNode } from 'react';
import { UserRole } from '@/types/user';
import { useUser } from '@/contexts/UserContext';
import { Card } from '@/components/ui/card';
import { ShieldX } from 'lucide-react';

interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const RoleBasedRoute = ({ 
  allowedRoles, 
  children, 
  fallback 
}: RoleBasedRouteProps) => {
  const { user, isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center">
          <ShieldX className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Accès restreint</h3>
          <p className="text-muted-foreground">
            Veuillez vous connecter pour accéder à cette page
          </p>
        </Card>
      </div>
    );
  }

  if (!allowedRoles.includes(user?.role as UserRole)) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center">
          <ShieldX className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <h3 className="text-lg font-semibold mb-2">Accès non autorisé</h3>
          <p className="text-muted-foreground">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page
          </p>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};