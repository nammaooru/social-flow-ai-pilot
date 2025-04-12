
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, Search, Filter, MoreHorizontal, Send, Bot, Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
const conversation = [
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

const DirectMessagesSection = () => {
  const [selectedContact, setSelectedContact] = useState(contacts[0].id);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('Yes, you can pick it up tomorrow at any of our store locations. Do you have a preferred location?');

  const filteredContacts = contacts.filter(contact => {
    if (filter !== 'all' && contact.platform.toLowerCase() !== filter) {
      return false;
    }
    
    if (searchQuery && !contact.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const currentContact = contacts.find(c => c.id === selectedContact);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    // In a real implementation, this would send the message to the API
    console.log(`Sending message to ${selectedContact}: ${messageText}`);
    setMessageText('');
  };

  const useAiSuggestion = () => {
    setMessageText(aiSuggestion);
  };

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
                    <div className={`h-2 w-2 rounded-full mr-2 ${platformColors[currentContact.platform]}`}></div>
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
                {conversation.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.sender === 'me' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <div className="text-sm mb-1">{message.text}</div>
                      <div className="flex items-center justify-end text-xs opacity-70">
                        {message.time}
                        {message.isAI && (
                          <Bot className="ml-1 h-3 w-3" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {aiSuggestion && (
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
            
            <div className="flex gap-2 mt-2">
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
    </div>
  );
};

export default DirectMessagesSection;
