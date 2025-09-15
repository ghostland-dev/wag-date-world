import { useState } from "react";
import { MessageCircle, Search, MoreVertical, Phone, Video } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChatModal } from "@/components/ChatModal";
import { animals } from "@/data/animals";
import { useUser } from "@/contexts/UserContext";

interface Message {
  id: string;
  animalId: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
  unreadCount: number;
}

export const MessagesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const { user } = useUser();

  // Mock messages data
  const messages: Message[] = [
    {
      id: "1",
      animalId: "1",
      lastMessage: "Salut ! Luna semble parfaite pour une rencontre avec Max 🐕",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      unread: true,
      unreadCount: 2
    },
    {
      id: "2", 
      animalId: "2",
      lastMessage: "Merci pour votre intérêt ! Quand pourriez-vous organiser une rencontre ?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      unread: false,
      unreadCount: 0
    },
    {
      id: "3",
      animalId: "3", 
      lastMessage: "Super ! Mon vétérinaire peut nous donner des conseils si besoin.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      unread: false,
      unreadCount: 0
    }
  ];

  const filteredMessages = messages.filter(message => {
    const animal = animals.find(a => a.id === message.animalId);
    return animal?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           message.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}j`;
  };

  const selectedAnimal = selectedChat ? animals.find(a => a.id === selectedChat) : null;

  if (messages.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <div className="text-6xl">💬</div>
          <h2 className="text-3xl font-bold text-foreground">
            Aucune conversation
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Commencez par liker des profils pour créer des matches et démarrer des conversations
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-2">
            Messages
          </h2>
          <p className="text-muted-foreground text-lg">
            {messages.filter(m => m.unread).length} conversation{messages.filter(m => m.unread).length > 1 ? 's' : ''} non lue{messages.filter(m => m.unread).length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans les conversations..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.map((message) => {
            const animal = animals.find(a => a.id === message.animalId);
            if (!animal) return null;

            return (
              <Card 
                key={message.id} 
                className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-[var(--shadow-soft)] ${
                  message.unread ? 'bg-primary/5 border-primary/20' : ''
                }`}
                onClick={() => setSelectedChat(animal.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={animal.image} alt={animal.name} />
                      <AvatarFallback>{animal.name[0]}</AvatarFallback>
                    </Avatar>
                    {message.unread && (
                      <div className="absolute -top-1 -right-1">
                        <div className="w-4 h-4 bg-primary rounded-full"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-semibold text-foreground ${message.unread ? 'font-bold' : ''}`}>
                        {animal.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.unreadCount > 0 && (
                          <Badge variant="destructive" className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                            {message.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className={`text-sm leading-relaxed truncate pr-4 ${
                        message.unread ? 'text-foreground font-medium' : 'text-muted-foreground'
                      }`}>
                        {message.lastMessage}
                      </p>
                      
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Video className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Marquer comme lu</DropdownMenuItem>
                            <DropdownMenuItem>Signaler</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Bloquer</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {animal.breed}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {animal.location}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Chat Modal */}
      {selectedAnimal && user && (
        <ChatModal
          isOpen={!!selectedAnimal}
          onClose={() => setSelectedChat(null)}
          animal={selectedAnimal}
          currentUserId={user.id}
        />
      )}
    </>
  );
};