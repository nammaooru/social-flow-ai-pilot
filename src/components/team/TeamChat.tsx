
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, Smile, Users, FileText } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock data for chat messages
const initialMessages = [
  {
    id: 1,
    sender: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    message: 'Good morning team! I hope everyone had a great weekend. Let\'s discuss our priorities for this week.',
    time: '09:15 AM',
    reactions: [{ emoji: '👍', count: 2 }]
  },
  {
    id: 2,
    sender: 'Sam Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    message: 'I\'ve just finished the design mockups for the new landing page. I\'ll share them in our afternoon meeting.',
    time: '09:22 AM',
    reactions: []
  },
  {
    id: 3,
    sender: 'Taylor Wong',
    avatar: 'https://i.pravatar.cc/150?img=3',
    message: 'I\'ve been working on the user authentication system. Should be ready for code review by end of day.',
    time: '09:30 AM',
    reactions: [{ emoji: '🚀', count: 3 }]
  },
  {
    id: 4,
    sender: 'Jordan Lee',
    avatar: 'https://i.pravatar.cc/150?img=4',
    message: 'Has anyone seen the latest analytics report? We should discuss the findings in our meeting today.',
    time: '09:45 AM',
    reactions: []
  },
  {
    id: 5,
    sender: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    message: 'I\'ll pull up the analytics during our meeting. @Taylor, would you be able to give a quick update on the authentication system progress?',
    time: '10:05 AM',
    reactions: [{ emoji: '👀', count: 1 }]
  }
];

// Mock team members
const teamMembers = [
  { id: 1, name: 'Alex Johnson', role: 'Marketing Director', avatar: 'https://i.pravatar.cc/150?img=1', status: 'online' },
  { id: 2, name: 'Sam Smith', role: 'Lead Designer', avatar: 'https://i.pravatar.cc/150?img=2', status: 'online' },
  { id: 3, name: 'Taylor Wong', role: 'Full Stack Developer', avatar: 'https://i.pravatar.cc/150?img=3', status: 'away' },
  { id: 4, name: 'Jordan Lee', role: 'Content Strategist', avatar: 'https://i.pravatar.cc/150?img=4', status: 'online' },
  { id: 5, name: 'Casey Davis', role: 'SEO Specialist', avatar: 'https://i.pravatar.cc/150?img=5', status: 'offline' },
];

// Mock shared files
const sharedFiles = [
  { id: 1, name: 'Q2 Marketing Strategy.pdf', size: '2.4 MB', sharedBy: 'Alex Johnson', date: '2 days ago' },
  { id: 2, name: 'Website Mockups.sketch', size: '8.1 MB', sharedBy: 'Sam Smith', date: 'Yesterday' },
  { id: 3, name: 'Analytics Report April.xlsx', size: '1.7 MB', sharedBy: 'Jordan Lee', date: '3 hours ago' },
  { id: 4, name: 'Team Meeting Notes.docx', size: '512 KB', sharedBy: 'Taylor Wong', date: '1 hour ago' },
];

const TeamChat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: messages.length + 1,
      sender: 'You',
      avatar: 'https://i.pravatar.cc/150?img=1',
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: []
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const addReaction = (messageId: number, emoji: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions.map(r => 
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            )
          };
        } else {
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, count: 1 }]
          };
        }
      }
      return msg;
    }));
  };

  return (
    <Card className="flex flex-col h-[800px]">
      <CardContent className="flex flex-col h-full p-0">
        <Tabs defaultValue="chat" className="h-full flex flex-col" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b p-2">
            <TabsList>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <Send size={16} />
                <span>Chat</span>
              </TabsTrigger>
              <TabsTrigger value="files" className="flex items-center gap-2">
                <FileText size={16} />
                <span>Files</span>
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center gap-2">
                <Users size={16} />
                <span>Members</span>
                <Badge variant="outline" className="ml-1 h-5 w-5 rounded-full bg-green-100 p-0 text-center text-xs">
                  {teamMembers.filter(m => m.status === "online").length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="flex-1 flex flex-col h-full m-0 overflow-hidden">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex gap-3">
                    <Avatar>
                      <AvatarImage src={msg.avatar} alt={msg.sender} />
                      <AvatarFallback>{msg.sender[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{msg.sender}</span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <div className="bg-muted rounded-md p-3 mt-1">
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      {msg.reactions.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {msg.reactions.map((reaction, idx) => (
                            <Badge key={idx} variant="outline" className="flex items-center gap-1 px-2 py-0.5 text-xs bg-muted/50">
                              <span>{reaction.emoji}</span>
                              <span>{reaction.count}</span>
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-1 mt-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => addReaction(msg.id, '👍')}
                        >
                          👍
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => addReaction(msg.id, '❤️')}
                        >
                          ❤️
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                          onClick={() => addReaction(msg.id, '🚀')}
                        >
                          🚀
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  className="shrink-0"
                >
                  <Paperclip size={18} />
                </Button>
                <Input 
                  value={newMessage} 
                  onChange={(e) => setNewMessage(e.target.value)} 
                  placeholder="Type your message..." 
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  className="shrink-0"
                >
                  <Smile size={18} />
                </Button>
                <Button type="submit" className="shrink-0">
                  <Send size={16} className="mr-2" /> Send
                </Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="files" className="h-full m-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {sharedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <FileText size={24} className="text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.size} • Shared by {file.sharedBy} • {file.date}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Download</Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="members" className="h-full m-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <span 
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                            member.status === 'online' ? 'bg-green-500' : 
                            member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-300'
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={
                        member.status === 'online' ? 'bg-green-100' : 
                        member.status === 'away' ? 'bg-yellow-100' : 'bg-gray-100'
                      }
                    >
                      {member.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TeamChat;
