import { useState, useEffect } from "react";
import { CloudOff, Cloud, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface OfflineAction {
  id: string;
  type: 'like' | 'pass' | 'message' | 'favorite';
  data: any;
  timestamp: Date;
  synced: boolean;
}

interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSync: Date | null;
  pendingActions: number;
}

export const useOfflineSync = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    isSyncing: false,
    lastSync: null,
    pendingActions: 0
  });
  
  const [offlineActions, setOfflineActions] = useLocalStorage<OfflineAction[]>('petmatch_offline_actions', []);
  const { toast } = useToast();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      toast({
        title: "🌐 Connexion rétablie",
        description: "Synchronisation des données en cours...",
      });
      syncPendingActions();
    };

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
      toast({
        title: "📵 Mode hors ligne",
        description: "Vos actions seront synchronisées à la reconnexion",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update pending actions count
  useEffect(() => {
    const pending = offlineActions.filter(action => !action.synced).length;
    setSyncStatus(prev => ({ ...prev, pendingActions: pending }));
  }, [offlineActions]);

  const addOfflineAction = (type: OfflineAction['type'], data: any) => {
    const newAction: OfflineAction = {
      id: Math.random().toString(36).substring(7),
      type,
      data,
      timestamp: new Date(),
      synced: false
    };

    setOfflineActions(prev => [...prev, newAction]);

    if (!syncStatus.isOnline) {
      toast({
        title: "📱 Action sauvegardée",
        description: "Elle sera synchronisée dès votre reconnexion",
      });
    }
  };

  const syncPendingActions = async () => {
    if (syncStatus.isSyncing) return;

    const pendingActions = offlineActions.filter(action => !action.synced);
    if (pendingActions.length === 0) return;

    setSyncStatus(prev => ({ ...prev, isSyncing: true }));

    try {
      // Simulate sync process
      for (let i = 0; i < pendingActions.length; i++) {
        const action = pendingActions[i];
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mark action as synced
        setOfflineActions(prev => 
          prev.map(a => 
            a.id === action.id ? { ...a, synced: true } : a
          )
        );
      }

      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSync: new Date(),
        pendingActions: 0
      }));

      toast({
        title: "✅ Synchronisation réussie",
        description: `${pendingActions.length} action(s) synchronisée(s)`,
      });

    } catch (error) {
      setSyncStatus(prev => ({ ...prev, isSyncing: false }));
      toast({
        title: "❌ Erreur de synchronisation",
        description: "Retry automatique dans quelques instants...",
        variant: "destructive",
      });
      
      // Retry after 5 seconds
      setTimeout(() => syncPendingActions(), 5000);
    }
  };

  const clearSyncedActions = () => {
    const recentActions = offlineActions.filter(action => 
      !action.synced || 
      Date.now() - action.timestamp.getTime() < 24 * 60 * 60 * 1000 // Keep last 24h
    );
    setOfflineActions(recentActions);
  };

  return {
    syncStatus,
    offlineActions,
    addOfflineAction,
    syncPendingActions,
    clearSyncedActions
  };
};

export const OfflineSync = () => {
  const { syncStatus, offlineActions, syncPendingActions, clearSyncedActions } = useOfflineSync();

  const getStatusIcon = () => {
    if (!syncStatus.isOnline) return <CloudOff className="w-5 h-5 text-destructive" />;
    if (syncStatus.isSyncing) return <RefreshCw className="w-5 h-5 text-primary animate-spin" />;
    if (syncStatus.pendingActions > 0) return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getStatusText = () => {
    if (!syncStatus.isOnline) return "Hors ligne";
    if (syncStatus.isSyncing) return "Synchronisation...";
    if (syncStatus.pendingActions > 0) return `${syncStatus.pendingActions} en attente`;
    return "Synchronisé";
  };

  const getStatusColor = () => {
    if (!syncStatus.isOnline) return "destructive";
    if (syncStatus.isSyncing) return "default";
    if (syncStatus.pendingActions > 0) return "secondary";
    return "default";
  };

  const formatLastSync = () => {
    if (!syncStatus.lastSync) return "Jamais";
    
    const now = new Date();
    const diff = now.getTime() - syncStatus.lastSync.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes}min`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <h3 className="font-medium text-foreground">État de synchronisation</h3>
              <p className="text-sm text-muted-foreground">
                Dernière sync: {formatLastSync()}
              </p>
            </div>
          </div>
          
          <Badge variant={getStatusColor() as any} className="flex items-center gap-1">
            {getStatusText()}
          </Badge>
        </div>

        {/* Sync Progress */}
        {syncStatus.isSyncing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Synchronisation en cours...</span>
              <span>{Math.floor(Math.random() * 100)}%</span>
            </div>
            <Progress value={Math.floor(Math.random() * 100)} className="h-2" />
          </div>
        )}

        {/* Pending Actions */}
        {syncStatus.pendingActions > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  {syncStatus.pendingActions} action(s) en attente de synchronisation
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  Ces actions seront synchronisées automatiquement à la reconnexion
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {syncStatus.isOnline && syncStatus.pendingActions > 0 && (
            <Button 
              onClick={syncPendingActions}
              disabled={syncStatus.isSyncing}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
              Synchroniser maintenant
            </Button>
          )}
          
          {offlineActions.filter(a => a.synced).length > 0 && (
            <Button 
              onClick={clearSyncedActions}
              size="sm"
              variant="ghost"
              className="text-muted-foreground"
            >
              Nettoyer l'historique
            </Button>
          )}
        </div>

        {/* Recent Actions */}
        {offlineActions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Actions récentes</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {offlineActions.slice(-5).reverse().map((action) => (
                <div key={action.id} className="flex items-center justify-between text-xs p-2 bg-muted/50 rounded">
                  <span className="capitalize">
                    {action.type === 'like' ? '❤️ Like' : 
                     action.type === 'pass' ? '👎 Pass' :
                     action.type === 'message' ? '💬 Message' : '⭐ Favori'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {new Date(action.timestamp).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {action.synced ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <div className="w-3 h-3 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};