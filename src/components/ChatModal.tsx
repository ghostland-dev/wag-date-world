import { useState, useRef, useEffect } from "react";
import { Send, X, Smile, Paperclip, Phone, Video, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'system';
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

interface Conversation {
  id: string;
  animalName: string;
  ownerName: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation?: Conversation;
}

export const ChatModal = ({ isOpen, onClose, conversation }: ChatModalProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Mock messages pour la démo
  useEffect(() => {
    if (conversation) {
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: 'other',
          senderName: conversation.ownerName,
          content: `Bonjour ! Je suis intéressé(e) par une rencontre entre nos animaux. ${conversation.animalName} semble parfait pour mon chien !`,
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          type: 'text',
          status: 'read'
        },
        {
          id: '2',
          senderId: 'me',
          senderName: 'Vous',
          content: 'Salut ! C\'est super, moi aussi je pense qu\'ils s\'entendraient bien. Où habitez-vous ?',
          timestamp: new Date(Date.now() - 1000 * 60 * 25),
          type: 'text',
          status: 'read'
        },
        {
          id: '3',
          senderId: 'other',
          senderName: conversation.ownerName,
          content: 'Je suis à Paris 15ème. Et vous ? On pourrait se retrouver dans un parc !',
          timestamp: new Date(Date.now() - 1000 * 60 * 20),
          type: 'text',
          status: 'read'
        },
        {
          id: '4',
          senderId: 'me',
          senderName: 'Vous',
          content: 'Parfait ! Je suis dans le 14ème. Le parc André Citroën vous va ?',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          type: 'text',
          status: 'delivered'
        },
        {
          id: '5',
          senderId: 'other',
          senderName: conversation.ownerName,
          content: 'Excellent choix ! Samedi après-midi vers 15h ça vous convient ?',
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          type: 'text',
          status: 'sent'
        }
      ];
      setMessages(mockMessages);
    }
  }, [conversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !conversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'Vous',
      content: message,
      timestamp: new Date(),
      type: 'text',
      status: 'sending'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");

    // Simuler l'envoi
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'sent' as const }
            : msg
        )
      );
    }, 500);

    // Simuler la réponse automatique
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const autoReply: Message = {
          id: (Date.now() + 1).toString(),
          senderId: 'other',
          senderName: conversation.ownerName,
          content: "C'est noté ! J'ai hâte de voir nos animaux jouer ensemble 🐕",
          timestamp: new Date(),
          type: 'text',
          status: 'sent'
        };
        setMessages(prev => [...prev, autoReply]);
      }, 2000);
    }, 3000);

    toast({
      title: "Message envoyé",
      description: "Votre message a été délivré",
    });
  };

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    if (diffInMinutes < 1440) return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending':
        return '⏳';
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      default:
        return '';
    }
  };

  if (!conversation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto p-0 gap-0 h-[600px] flex flex-col">
        {/* Header */}
        <DialogHeader className="border-b p-4 flex-shrink-0">
          <DialogTitle className="sr-only">Conversation avec {conversation.ownerName} au sujet de {conversation.animalName}</DialogTitle>
          <DialogDescription className="sr-only">Messagerie PetMatch</DialogDescription>
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={conversation.avatar} />
              <AvatarFallback>{conversation.animalName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{conversation.animalName}</h3>
                {conversation.isOnline && (
                  <Badge variant="secondary" className="text-xs">En ligne</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">avec {conversation.ownerName}</p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Video className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.senderId !== 'me' && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback>{conversation.animalName[0]}</AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[70%] ${msg.senderId === 'me' ? 'order-1' : ''}`}>
                  <div
                    className={`p-3 rounded-2xl ${
                      msg.senderId === 'me'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                  <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                    msg.senderId === 'me' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span>{formatMessageTime(msg.timestamp)}</span>
                    {msg.senderId === 'me' && (
                      <span className={msg.status === 'read' ? 'text-primary' : ''}>
                        {getStatusIcon(msg.status)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={conversation.avatar} />
                  <AvatarFallback>{conversation.animalName[0]}</AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t p-4 flex-shrink-0">
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Paperclip className="w-4 h-4" />
            </Button>
            <div className="flex-1 flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tapez votre message..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Smile className="w-4 h-4" />
              </Button>
            </div>
            <Button 
              onClick={sendMessage}
              disabled={!message.trim()}
              size="icon"
              className="h-9 w-9"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};