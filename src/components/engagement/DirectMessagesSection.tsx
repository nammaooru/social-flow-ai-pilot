import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, Search, Filter, MoreHorizontal, Send, Bot, Sparkles,
  Paperclip, Reply as ReplyIcon, Forward, Smile,
  X as XIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// Types for attachments
type AttachmentType = 'image' | 'video' | 'document' | 'emoji';

interface Attachment {
  type: AttachmentType;
  name: string;
  url?: string;
  preview?: string;
  content?: string;
}

// Define the Message interface to include attachments
interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isAI?: boolean;
  attachments?: Attachment[];
}

// Mock data for direct messages
const contacts = [
  {
    id: '1',
    name: 'Lisa Brown',
    avatar: 'https://i.pravatar.cc/150?img=6',
    platform: 'Instagram',
    status: 'online',
    lastMessage: 'Thank you for your quick response!',
    unread: false,
    time: '5m'
  },
  {
    id: '2',
    name: 'John Adams',
    avatar: 'https://i.pravatar.cc/150?img=7',
    platform: 'Facebook',
    status: 'offline',
    lastMessage: 'I have a question about your return policy...',
    unread: true,
    time: '1h'
  },
  {
    id: '3',
    name: 'Sophia Lee',
    avatar: 'https://i.pravatar.cc/150?img=8',
    platform: 'Twitter',
    status: 'online',
    lastMessage: 'Can you send me a link to your size guide?',
    unread: true,
    time: '3h'
  },
  {
    id: '4',
    name: 'Marco Rodriguez',
    avatar: 'https://i.pravatar.cc/150?img=9',
    platform: 'Instagram',
    status: 'offline',
    lastMessage: 'The package arrived today. Love it!',
    unread: false,
    time: '1d'
  },
  {
    id: '5',
    name: 'Rebecca Kim',
    avatar: 'https://i.pravatar.cc/150?img=10',
    platform: 'LinkedIn',
    status: 'offline',
    lastMessage: 'Interested in discussing a partnership',
    unread: false,
    time: '3d'
  }
];

// Sample conversation
const conversation: Message[] = [
  {
    id: '1',
    sender: 'user',
    text: 'Hi there! Do you have the summer collection in stock?',
    time: '11:42 AM'
  },
  {
    id: '2',
    sender: 'me',
    text: 'Hello! Yes, our summer collection is now available both online and in stores.',
    time: '11:45 AM',
    isAI: true
  },
  {
    id: '3',
    sender: 'user',
    text: 'Great! Do you have the blue sundress in size medium?',
    time: '11:47 AM'
  },
  {
    id: '4',
    sender: 'me',
    text: 'Let me check our inventory for you. Yes, the blue sundress is available in medium! Would you like me to hold one for you?',
    time: '11:50 AM'
  },
  {
    id: '5',
    sender: 'user',
    text: 'That would be perfect. Can I pick it up tomorrow?',
    time: '11:52 AM'
  }
];

const platformColors = {
  Instagram: 'bg-pink-500',
  Facebook: 'bg-blue-600',
  Twitter: 'bg-blue-400',
  LinkedIn: 'bg-blue-800'
};

interface DirectMessagesSectionProps {
  showAiSuggestions?: boolean;
}

const DirectMessagesSection = ({ showAiSuggestions = true }: DirectMessagesSectionProps) => {
  const [selectedContact, setSelectedContact] = useState(contacts[0].id);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('Yes, you can pick it up tomorrow at any of our store locations. Do you have a preferred location?');
  const [messages, setMessages] = useState<Message[]>(conversation);
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [attachmentToPreview, setAttachmentToPreview] = useState<Attachment | null>(null);

  // Filter contacts based on platform and search query
  const filteredContacts = contacts.filter(contact => {
    if (filter !== 'all' && contact.platform.toLowerCase() !== filter) {
      return false;
    }
    
    if (searchQuery && !contact.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Get the current contact based on the selected contact ID
  const currentContact = contacts.find(c => c.id === selectedContact);

  const handleSendMessage = () => {
    if (!messageText.trim() && attachments.length === 0) return;
    
    // Create a new message
    const newMessage: Message = {
      id: (messages.length + 1).toString(),
      sender: 'me',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };
    
    // Add message to conversation
    setMessages([...messages, newMessage]);
    
    // Clear the input and attachments
    setMessageText('');
    setAttachments([]);
    
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully",
    });
  };

  const useAiSuggestion = () => {
    setMessageText(aiSuggestion);
  };
  
  const handleForwardMessage = (messageId: string) => {
    toast({
      title: "Forward message",
      description: "Message forwarding functionality triggered",
    });
  };
  
  const handleReplyMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setMessageText(`Replying to: "${message.text.substring(0, 20)}${message.text.length > 20 ? '...' : ''}" \n\n`);
    }
  };
  
  const handleAttachment = (type: AttachmentType) => {
    if (type === 'emoji') {
      setShowEmojiPicker(!showEmojiPicker);
      return;
    }
    
    if (type === 'voice') {
      toast({
        title: "Voice recording",
        description: "Voice recording feature activated",
      });
      return;
    }
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    
    switch (type) {
      case 'image':
        fileInput.accept = 'image/*';
        break;
      case 'video':
        fileInput.accept = 'video/*';
        break;
      case 'document':
        fileInput.accept = '.pdf,.doc,.docx,.txt';
        break;
    }
    
    fileInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
          if (event.target?.result) {
            const newAttachment: Attachment = {
              type,
              name: file.name,
              url: URL.createObjectURL(file),
              preview: type === 'image' ? event.target.result as string : undefined
            };
            
            setAttachments([...attachments, newAttachment]);
            
            toast({
              title: "Attachment added",
              description: `${type} has been attached successfully`,
            });
          }
        };
        
        if (type === 'image') {
          reader.readAsDataURL(file);
        } else {
          reader.readAsArrayBuffer(file);
        }
      }
    };
    fileInput.click();
  };

  const handleAddEmoji = (emoji: string) => {
    const newAttachment: Attachment = {
      type: 'emoji',
      name: 'Emoji',
      content: emoji
    };
    setAttachments([...attachments, newAttachment]);
    setShowEmojiPicker(false);
    
    toast({
      title: "Emoji added",
      description: "Emoji has been added to your message",
    });
  };
  
  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
    
    toast({
      title: "Attachment removed",
      description: "Attachment has been removed from your message",
    });
  };

  const emojis = ['😊', '👍', '❤️', '🎉', '😂', '🔥', '👏', '🙏', '😍', '🤩', '😎', '🤔', '👋', '✨', '💯', '🚀'];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card className="md:col-span-1">
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-2">
            <CardTitle>Conversations</CardTitle>
            <div className="relative flex items-center">
              <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-2">
              <ScrollArea className="h-[60vh]">
                <div className="space-y-2">
                  {filteredContacts.map((contact) => (
                    <div 
                      key={contact.id} 
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent ${selectedContact === contact.id ? 'bg-accent' : ''}`}
                      onClick={() => setSelectedContact(contact.id)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={contact.avatar} alt={contact.name} />
                          <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div 
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <p className="font-medium truncate">{contact.name}</p>
                          <span className="text-xs text-muted-foreground">{contact.time}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <div className={`h-2 w-2 rounded-full mr-2 ${platformColors[contact.platform]}`}></div>
                          <span className="text-xs">{contact.platform}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                      </div>
                      {contact.unread && (
                        <Badge className="ml-auto flex-shrink-0">New</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="unread" className="mt-2">
              <ScrollArea className="h-[60vh]">
                <div className="space-y-2">
                  {filteredContacts.filter(c => c.unread).map((contact) => (
                    <div 
                      key={contact.id} 
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-accent ${selectedContact === contact.id ? 'bg-accent' : ''}`}
                      onClick={() => setSelectedContact(contact.id)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={contact.avatar} alt={contact.name} />
                          <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div 
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <p className="font-medium truncate">{contact.name}</p>
                          <span className="text-xs text-muted-foreground">{contact.time}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <div className={`h-2 w-2 rounded-full mr-2 ${platformColors[contact.platform]}`}></div>
                          <span className="text-xs">{contact.platform}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                      </div>
                      {contact.unread && (
                        <Badge className="ml-auto flex-shrink-0">New</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="pb-3">
          {currentContact && (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={currentContact.avatar} alt={currentContact.name} />
                  <AvatarFallback>{currentContact.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{currentContact.name}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className={`h-2 w-2 rounded-full mr-2 ${platformColors[currentContact.platform as keyof typeof platformColors]}`}></div>
                    <span>{currentContact.platform}</span>
                    <span className="mx-2">•</span>
                    <span className={`flex items-center ${currentContact.status === 'online' ? 'text-green-500' : 'text-gray-400'}`}>
                      <div className={`h-2 w-2 rounded-full mr-1 ${currentContact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      {currentContact.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col h-[60vh]">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg relative ${
                        message.sender === 'me' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {message.text && <div className="text-sm mb-1">{message.text}</div>}
                      
                      {message.attachments && message.attachments.map((attachment, index) => (
                        <div key={index} className="mt-2">
                          {attachment.type === 'image' && attachment.preview && (
                            <img 
                              src={attachment.preview} 
                              alt={attachment.name} 
                              className="max-h-40 rounded-md cursor-pointer"
                              onClick={() => setAttachmentToPreview(attachment)}
                            />
                          )}
                          
                          {attachment.type === 'emoji' && attachment.content && (
                            <span className="text-2xl">{attachment.content}</span>
                          )}
                          
                          {(attachment.type === 'video' || attachment.type === 'document') && (
                            <div className="flex items-center bg-background/10 p-2 rounded-md">
                              {attachment.type === 'video' ? 
                                <span className="h-4 w-4 mr-2">🎥</span> : 
                                <span className="h-4 w-4 mr-2">📄</span>
                              }
                              <span className="text-xs truncate">{attachment.name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      <div className="flex items-center justify-end text-xs opacity-70">
                        {message.time}
                        {message.isAI && (
                          <Bot className="ml-1 h-3 w-3" />
                        )}
                      </div>

                      {/* Message actions - enhanced for all messages */}
                      <div className="absolute opacity-0 group-hover:opacity-100 right-0 bottom-0 transform translate-y-full flex gap-1 pt-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => handleReplyMessage(message.id)}
                        >
                          <ReplyIcon className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => {
                            setConfirmDialogOpen(true);
                            handleForwardMessage(message.id);
                          }}
                        >
                          <Forward className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* AI suggestion - only show if enabled */}
            {showAiSuggestions && aiSuggestion && (
              <div className="mb-2 flex items-center">
                <Card className="w-full bg-muted/50">
                  <CardContent className="p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">AI Suggestion:</span>
                    </div>
                    <div className="flex-1 mx-2 text-sm">{aiSuggestion}</div>
                    <Button variant="ghost" size="sm" onClick={useAiSuggestion}>
                      <Sparkles className="h-4 w-4 mr-1" />
                      Use
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Attachments preview */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {attachments.map((attachment, index) => (
                  <div key={index} className="relative">
                    {attachment.type === 'image' && attachment.preview && (
                      <div className="relative">
                        <img 
                          src={attachment.preview} 
                          alt={attachment.name} 
                          className="h-16 w-16 object-cover rounded-md" 
                        />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-5 w-5 absolute -top-2 -right-2 p-0"
                          onClick={() => removeAttachment(index)}
                        >
                          <XIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    
                    {attachment.type === 'emoji' && attachment.content && (
                      <div className="relative bg-muted p-2 rounded-md">
                        <span className="text-2xl">{attachment.content}</span>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-5 w-5 absolute -top-2 -right-2 p-0"
                          onClick={() => removeAttachment(index)}
                        >
                          <XIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    
                    {(attachment.type === 'video' || attachment.type === 'document') && (
                      <div className="relative bg-muted p-2 rounded-md flex items-center">
                        {attachment.type === 'video' ? 
                          <span className="mr-2">🎥</span> : 
                          <span className="mr-2">📄</span>
                        }
                        <span className="text-xs truncate max-w-[80px]">{attachment.name}</span>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-5 w-5 absolute -top-2 -right-2 p-0"
                          onClick={() => removeAttachment(index)}
                        >
                          <XIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-2 mt-2">
              <div className="flex gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="h-10 w-10">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2">
                    <div className="grid grid-cols-2 gap-1">
                      <Button variant="ghost" className="flex items-center justify-start gap-2 h-9" onClick={() => handleAttachment('image')}>
                        <span>🖼️</span>
                        <span>Image</span>
                      </Button>
                      <Button variant="ghost" className="flex items-center justify-start gap-2 h-9" onClick={() => handleAttachment('video')}>
                        <span>🎥</span>
                        <span>Video</span>
                      </Button>
                      <Button variant="ghost" className="flex items-center justify-start gap-2 h-9" onClick={() => handleAttachment('document')}>
                        <span>📄</span>
                        <span>Document</span>
                      </Button>
                      <Button variant="ghost" className="flex items-center justify-start gap-2 h-9" onClick={() => handleAttachment('voice')}>
                        <span>🎤</span>
                        <span>Voice</span>
                      </Button>
                      <Button variant="ghost" className="flex items-center justify-start gap-2 h-9" onClick={() => handleAttachment('emoji')}>
                        <Smile className="h-4 w-4" />
                        <span>Emoji</span>
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              {showEmojiPicker && (
                <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                  <PopoverContent side="top" className="w-[280px]">
                    <div className="grid grid-cols-8 gap-1 p-2">
                      {emojis.map((emoji, index) => (
                        <Button 
                          key={index} 
                          variant="ghost" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleAddEmoji(emoji)}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              
              <Input 
                placeholder="Type a message..." 
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Preview Dialog */}
      <AlertDialog open={!!attachmentToPreview} onOpenChange={(open) => !open && setAttachmentToPreview(null)}>
        <AlertDialogContent className="max-w-[80vw]">
          <AlertDialogHeader>
            <AlertDialogTitle>{attachmentToPreview?.name}</AlertDialogTitle>
          </AlertDialogHeader>
          {attachmentToPreview?.type === 'image' && attachmentToPreview?.preview && (
            <img 
              src={attachmentToPreview.preview} 
              alt={attachmentToPreview.name} 
              className="max-h-[60vh] max-w-full mx-auto rounded-md" 
            />
          )}
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Forward Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Forward Message</AlertDialogTitle>
            <AlertDialogDescription>
              Select a contact to forward this message to.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {contacts.map((contact) => (
                  <div 
                    key={contact.id} 
                    className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-accent"
                    onClick={() => {
                      toast({
                        title: "Message forwarded",
                        description: `Message forwarded to ${contact.name}`,
                      });
                      setConfirmDialogOpen(false);
                    }}
                  >
                    <Avatar>
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <div className={`h-2 w-2 rounded-full mr-2 ${platformColors[contact.platform as keyof typeof platformColors]}`}></div>
                        <span>{contact.platform}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DirectMessagesSection;
