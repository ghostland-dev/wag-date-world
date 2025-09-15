import { useState, useEffect, useRef } from "react";
import { Send, Heart, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Animal } from "@/data/animals";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system';
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  animal: Animal;
  currentUserId: string;
}

export const ChatModal = ({ isOpen, onClose, animal, currentUserId }: ChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'system',
      content: `Vous avez matché avec ${animal.name} ! Dites bonjour 👋`,
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: 'system'
    },
    {
      id: '2',
      senderId: animal.id,
      content: `Salut ! ${animal.name} a l'air très intéressé(e) par une rencontre avec votre animal ! 🐾`,
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulate response after 2-3 seconds
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        "C'est parfait ! Quand pourriez-vous organiser une rencontre ?",
        "Merci pour votre message ! Mon animal serait ravi de rencontrer le vôtre.",
        "Excellente idée ! Nous habitons dans le même secteur, ça sera pratique.",
        "Super ! Avez-vous un parc préféré pour les premières rencontres ?",
        "Formidable ! Mon vétérinaire pourrait nous donner des conseils si besoin."
      ];
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: animal.id,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 2000 + Math.random() * 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 pb-2 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={animal.image} alt={animal.name} />
              <AvatarFallback>{animal.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-lg font-semibold">
                {animal.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Chat avec le propriétaire de {animal.name}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {animal.breed}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {animal.location}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === currentUserId
                    ? 'justify-end'
                    : message.type === 'system'
                    ? 'justify-center'
                    : 'justify-start'
                }`}
              >
                {message.type === 'system' ? (
                  <div className="bg-muted px-3 py-2 rounded-lg text-sm text-muted-foreground text-center max-w-xs">
                    {message.content}
                  </div>
                ) : (
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.senderId === currentUserId
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-2 rounded-lg max-w-xs">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-1"
            />
            <Button 
              type="submit" 
              size="icon"
              className="bg-[var(--gradient-primary)]"
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};