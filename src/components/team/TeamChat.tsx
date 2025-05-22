import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Send,
  Paperclip,
  Image,
  FileVideo,
  FileAudio,
  FileText,
  Smile,
  Star,
  MoreHorizontal,
  Search,
  Bookmark,
  User as UserIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Attachment interface
interface Attachment {
  type: 'image' | 'video' | 'document' | 'audio';
  name: string;
  size: string;
  url?: string;
}

// Message interface
interface Message {
  id: string;
  sender: string;
  avatar?: string;
  text: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
  attachments?: Attachment[];
}

// Chat interface
interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isGroup: boolean;
  members?: { id: string; name: string; avatarUrl: string; status: string }[];
  messages: Message[];
}

// Mock chat data
const initialChats: Chat[] = [
  {
    id: '1',
    name: 'Marketing Team',
    lastMessage: 'Alex: Can someone review the latest draft?',
    timestamp: '10:45 AM',
    unread: 3,
    isGroup: true,
    members: [
      { id: '1', name: 'Alex Johnson', avatarUrl: 'https://i.pravatar.cc/150?img=1', status: 'online' },
      { id: '2', name: 'Sam Smith', avatarUrl: 'https://i.pravatar.cc/150?img=2', status: 'online' },
      { id: '5', name: 'Casey Davis', avatarUrl: 'https://i.pravatar.cc/150?img=5', status: 'offline' },
    ],
    messages: [
      {
        id: '1',
        sender: 'Alex Johnson',
        avatar: 'https://i.pravatar.cc/150?img=1',
        text: 'Hey team, I just uploaded the new campaign draft. Can someone review it?',
        time: '10:30 AM',
        status: 'read'
      },
      {
        id: '2',
        sender: 'Sam Smith',
        avatar: 'https://i.pravatar.cc/150?img=2',
        text: "I'll take a look at it in about an hour.",
        time: '10:34 AM',
        status: 'read'
      },
      {
        id: '3',
        sender: 'Casey Davis',
        avatar: 'https://i.pravatar.cc/150?img=5',
        text: 'I can review it right now!',
        time: '10:40 AM',
        status: 'read'
      },
      {
        id: '4',
        sender: 'Alex Johnson',
        avatar: 'https://i.pravatar.cc/150?img=1',
        text: 'Thanks Casey! I attached the document here.',
        time: '10:45 AM',
        status: 'sent',
        attachments: [
          { type: 'document', name: 'Marketing_Campaign_Draft.docx', size: '2.3 MB' }
        ]
      },
    ]
  },
  {
    id: '2',
    name: 'Design Team',
    lastMessage: 'Sam: The new logo concepts are ready!',
    timestamp: '9:23 AM',
    unread: 0,
    isGroup: true,
    members: [
      { id: '2', name: 'Sam Smith', avatarUrl: 'https://i.pravatar.cc/150?img=2', status: 'online' },
      { id: '3', name: 'Taylor Wong', avatarUrl: 'https://i.pravatar.cc/150?img=3', status: 'away' },
    ],
    messages: [
      {
        id: '1',
        sender: 'Sam Smith',
        avatar: 'https://i.pravatar.cc/150?img=2',
        text: 'The new logo concepts are ready! Take a look:',
        time: '9:20 AM',
        status: 'read',
        attachments: [
          { type: 'image', name: 'Logo_Concept_1.png', size: '1.1 MB' },
          { type: 'image', name: 'Logo_Concept_2.png', size: '0.9 MB' },
        ]
      },
      {
        id: '2',
        sender: 'Taylor Wong',
        avatar: 'https://i.pravatar.cc/150?img=3',
        text: 'These look great! I prefer the second concept, but with the colors from the first one.',
        time: '9:23 AM',
        status: 'read'
      },
    ]
  },
  {
    id: '3',
    name: 'Development Team',
    lastMessage: 'Taylor: The API is now ready for testing',
    timestamp: 'Yesterday',
    unread: 0,
    isGroup: true,
    members: [
      { id: '3', name: 'Taylor Wong', avatarUrl: 'https://i.pravatar.cc/150?img=3', status: 'away' },
      { id: '4', name: 'Jordan Lee', avatarUrl: 'https://i.pravatar.cc/150?img=4', status: 'online' },
    ],
    messages: [
      {
        id: '1',
        sender: 'Taylor Wong',
        avatar: 'https://i.pravatar.cc/150?img=3',
        text: "The API is now ready for testing. Here's the documentation:",
        time: 'Yesterday, 4:30 PM',
        status: 'read',
        attachments: [
          { type: 'document', name: 'API_Documentation.pdf', size: '3.7 MB' }
        ]
      },
      {
        id: '2',
        sender: 'Jordan Lee',
        avatar: 'https://i.pravatar.cc/150?img=4',
        text: "Great work! I'll start integrating it tomorrow morning.",
        time: 'Yesterday, 4:45 PM',
        status: 'read'
      },
    ]
  },
  {
    id: '4',
    name: 'Sam Smith',
    lastMessage: 'Can you send me the design files?',
    timestamp: 'Monday',
    unread: 0,
    isGroup: false,
    messages: [
      {
        id: '1',
        sender: 'Sam Smith',
        avatar: 'https://i.pravatar.cc/150?img=2',
        text: 'Hi! Do you have a moment to discuss the homepage redesign?',
        time: 'Monday, 2:30 PM',
        status: 'read'
      },
      {
        id: '2',
        sender: 'You',
        text: "Sure! I'm free for the next hour.",
        time: 'Monday, 2:35 PM',
        status: 'read'
      },
      {
        id: '3',
        sender: 'Sam Smith',
        avatar: 'https://i.pravatar.cc/150?img=2',
        text: 'Perfect! Can you send me the design files so we can go through them together?',
        time: 'Monday, 2:40 PM',
        status: 'read'
      },
    ]
  },
  {
    id: '5',
    name: 'Alex Johnson',
    lastMessage: "Let's meet at 3 PM to discuss the strategy",
    timestamp: 'Tuesday',
    unread: 0,
    isGroup: false,
    messages: [
      {
        id: '1',
        sender: 'Alex Johnson',
        avatar: 'https://i.pravatar.cc/150?img=1',
        text: 'We need to finalize the marketing strategy for Q3.',
        time: 'Tuesday, 10:15 AM',
        status: 'read'
      },
      {
        id: '2',
        sender: 'You',
        text: "I agree. I have some ideas I'd like to share.",
        time: 'Tuesday, 10:30 AM',
        status: 'read'
      },
      {
        id: '3',
        sender: 'Alex Johnson',
        avatar: 'https://i.pravatar.cc/150?img=1',
        text: "Let's meet at 3 PM to discuss the strategy in detail.",
        time: 'Tuesday, 10:45 AM',
        status: 'read'
      },
    ]
  }
];

const TeamChat = () => {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeChat, setActiveChat] = useState<Chat | null>(initialChats[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() && attachments.length === 0) return;
    
    if (activeChat) {
      const newMessageObj: Message = {
        id: `${Date.now()}`,
        sender: 'You',
        text: newMessage,
        time: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        status: 'sent',
        attachments: attachments.length > 0 ? [...attachments] : undefined
      };
      
      const updatedChat = {
        ...activeChat,
        lastMessage: `You: ${newMessage || 'Sent an attachment'}`,
        timestamp: 'Just now',
        messages: [...activeChat.messages, newMessageObj]
      };
      
      setChats(chats.map(chat => 
        chat.id === activeChat.id ? updatedChat : chat
      ));
      
      setActiveChat(updatedChat);
      setNewMessage('');
      setAttachments([]);
    }
  };

  // Handle file selection
  const handleFileSelect = (type: 'image' | 'video' | 'document' | 'audio') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 
        type === 'image' ? 'image/*' :
        type === 'video' ? 'video/*' :
        type === 'audio' ? 'audio/*' :
        '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt';
      
      fileInputRef.current.click();
    }
  };

  // Handle file input change
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      const fileType = file.type.split('/')[0] as 'image' | 'video' | 'audio';
      const fileSize = (file.size / (1024 * 1024)).toFixed(1);
      
      const newAttachment: Attachment = {
        type: fileType === 'image' || fileType === 'video' || fileType === 'audio' 
          ? fileType 
          : 'document',
        name: file.name,
        size: `${fileSize} MB`,
        url: URL.createObjectURL(file)
      };
      
      setAttachments([...attachments, newAttachment]);
    }
  };

  // Remove an attachment
  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Render attachment preview
  const renderAttachmentPreview = (attachment: Attachment) => {
    if (attachment.type === 'image' && attachment.url) {
      return (
        <div className="relative">
          <img src={attachment.url} alt={attachment.name} className="w-20 h-20 object-cover rounded" />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-0 right-0 h-5 w-5 bg-black bg-opacity-50 text-white rounded-full" 
            onClick={() => removeAttachment(attachments.indexOf(attachment))}
          >
            ✕
          </Button>
        </div>
      );
    } else {
      const FileIcon = 
        attachment.type === 'video' ? FileVideo :
        attachment.type === 'audio' ? FileAudio :
        FileText;
      
      return (
        <div className="flex items-center gap-2 p-2 border rounded">
          <FileIcon className="h-4 w-4" />
          <span className="text-xs truncate max-w-[100px]">{attachment.name}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-5 w-5" 
            onClick={() => removeAttachment(attachments.indexOf(attachment))}
          >
            ✕
          </Button>
        </div>
      );
    }
  };

  // Render a message bubble
  const renderMessage = (message: Message, isLastMessage: boolean) => {
    const isOwnMessage = message.sender === 'You';
    
    return (
      <div 
        key={message.id} 
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        {!isOwnMessage && (
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={message.avatar} />
            <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        
        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
          <div className="flex items-center mb-1">
            {!isOwnMessage && <span className="text-sm font-medium mr-2">{message.sender}</span>}
            <span className="text-xs text-muted-foreground">{message.time}</span>
          </div>
          
          <div className={`max-w-[70%] rounded-lg p-3 ${
            isOwnMessage 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground'
          }`}>
            {message.text}
            
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded bg-background">
                    {attachment.type === 'image' ? (
                      <Image className="h-4 w-4" />
                    ) : attachment.type === 'video' ? (
                      <FileVideo className="h-4 w-4" />
                    ) : attachment.type === 'audio' ? (
                      <FileAudio className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                    <span className="text-xs">{attachment.name}</span>
                    <span className="text-xs text-muted-foreground">{attachment.size}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {isOwnMessage && isLastMessage && (
            <span className="text-xs text-muted-foreground mt-1">
              {message.status === 'read' ? 'Read' : message.status === 'delivered' ? 'Delivered' : 'Sent'}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="h-[calc(100vh-250px)] flex flex-col overflow-hidden">
      <CardContent className="p-0 flex h-full">
        {/* Chat List */}
        <div className="w-full md:w-1/4 border-r h-full flex flex-col">
          <div className="p-3 border-b">
            <div className="relative mb-3">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search chats..." 
                className="pl-8" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            {filteredChats.map((chat) => (
              <div 
                key={chat.id}
                className={`flex items-center p-3 hover:bg-muted cursor-pointer ${
                  activeChat?.id === chat.id ? 'bg-muted' : ''
                }`}
                onClick={() => setActiveChat(chat)}
              >
                <div className="relative mr-3">
                  {chat.isGroup ? (
                    <div className="flex -space-x-2">
                      {chat.members?.slice(0, 3).map((member) => (
                        <Avatar key={member.id} className="h-10 w-10 border-2 border-background">
                          <AvatarImage src={member.avatarUrl} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  ) : (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`https://i.pravatar.cc/150?img=${chat.id}`} />
                      <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">{chat.name}</span>
                    <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground truncate w-32">
                      {chat.lastMessage}
                    </span>
                    {chat.unread > 0 && (
                      <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat Window */}
        {activeChat ? (
          <div className="hidden md:flex md:w-3/4 flex-col h-full">
            {/* Chat Header */}
            <div className="p-3 border-b flex justify-between items-center">
              <div className="flex items-center">
                {activeChat.isGroup ? (
                  <div className="flex -space-x-2 mr-3">
                    {activeChat.members?.slice(0, 3).map((member) => (
                      <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                ) : (
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${activeChat.id}`} />
                    <AvatarFallback>{activeChat.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <div className="font-medium">{activeChat.name}</div>
                  {activeChat.isGroup && (
                    <div className="text-xs text-muted-foreground">
                      {activeChat.members?.length} members
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Search className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Search in conversation</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Saved messages</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <UserIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View profile</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Mute notifications</DropdownMenuItem>
                    <DropdownMenuItem>Pin conversation</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Clear chat</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-auto p-4">
              {activeChat.messages.map((message, index) => 
                renderMessage(message, index === activeChat.messages.length - 1)
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Attachment Preview */}
            {attachments.length > 0 && (
              <div className="p-2 border-t flex gap-2">
                {attachments.map((attachment, index) => (
                  <div key={index}>
                    {renderAttachmentPreview(attachment)}
                  </div>
                ))}
              </div>
            )}
            
            {/* Message Input */}
            <div className="p-3 border-t">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Textarea
                    placeholder="Type a message..."
                    className="min-h-[50px] max-h-[120px] resize-none"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                  />
                </div>
                
                <div className="flex items-center gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleFileSelect('image')}>
                        <Image className="mr-2 h-4 w-4" />
                        <span>Image</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFileSelect('video')}>
                        <FileVideo className="mr-2 h-4 w-4" />
                        <span>Video</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFileSelect('document')}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Document</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFileSelect('audio')}>
                        <FileAudio className="mr-2 h-4 w-4" />
                        <span>Audio</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button variant="ghost" size="icon">
                    <Smile className="h-4 w-4" />
                  </Button>
                  
                  <Button onClick={handleSendMessage} className="rounded-full p-2">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex md:w-3/4 items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a chat from the list to start messaging</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamChat;
