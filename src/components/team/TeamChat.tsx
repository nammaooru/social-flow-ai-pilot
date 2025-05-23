
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
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
  User as UserIcon,
  Phone,
  Video,
  PenTool,
  MicOff,
  Users,
  X,
  ChevronRight,
  Pin,
  Forward,
  Reply,
  Trash2,
  Edit
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  isPinned?: boolean;
  reactions?: {emoji: string, count: number}[];
}

// Chat interface
interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isGroup: boolean;
  members?: { id: string; name: string; avatarUrl: string; status: string; role?: string }[];
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
      { id: '1', name: 'Alex Johnson', avatarUrl: 'https://i.pravatar.cc/150?img=1', status: 'online', role: 'Marketing Director' },
      { id: '2', name: 'Sam Smith', avatarUrl: 'https://i.pravatar.cc/150?img=2', status: 'online', role: 'Content Strategist' },
      { id: '5', name: 'Casey Davis', avatarUrl: 'https://i.pravatar.cc/150?img=5', status: 'offline', role: 'Lead Designer' },
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
        ],
        isPinned: true,
        reactions: [
          { emoji: '👍', count: 2 },
          { emoji: '❤️', count: 1 }
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

// Emoji picker data
const emojiOptions = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '👏', '🙏', '🔥'];

const TeamChat = () => {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeChat, setActiveChat] = useState<Chat | null>(initialChats[0]);
  const [activeChatTab, setActiveChatTab] = useState<'chat' | 'files' | 'members'>('chat');
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
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

  // Get all attachments from the active chat
  const getAllAttachments = () => {
    if (!activeChat) return [];
    
    return activeChat.messages
      .filter(message => message.attachments && message.attachments.length > 0)
      .flatMap(message => message.attachments || []);
  };
  
  // Get pinned messages
  const getPinnedMessages = () => {
    if (!activeChat) return [];
    
    return activeChat.messages.filter(message => message.isPinned);
  };

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
      setReplyingTo(null);
    }
  };

  // Handle message reactions
  const handleReaction = (messageId: string, emoji: string) => {
    if (!activeChat) return;
    
    const updatedMessages = activeChat.messages.map(message => {
      if (message.id === messageId) {
        const currentReactions = message.reactions || [];
        const existingReaction = currentReactions.find(r => r.emoji === emoji);
        
        let newReactions;
        if (existingReaction) {
          newReactions = currentReactions.map(r => 
            r.emoji === emoji ? { ...r, count: r.count + 1 } : r
          );
        } else {
          newReactions = [...currentReactions, { emoji, count: 1 }];
        }
        
        return { ...message, reactions: newReactions };
      }
      return message;
    });
    
    const updatedChat = { ...activeChat, messages: updatedMessages };
    setActiveChat(updatedChat);
    
    setChats(chats.map(chat => 
      chat.id === activeChat.id ? updatedChat : chat
    ));
    
    setShowEmojiPicker(false);
  };

  // Toggle pin status for a message
  const togglePinMessage = (messageId: string) => {
    if (!activeChat) return;
    
    const updatedMessages = activeChat.messages.map(message => {
      if (message.id === messageId) {
        return { ...message, isPinned: !message.isPinned };
      }
      return message;
    });
    
    const updatedChat = { ...activeChat, messages: updatedMessages };
    setActiveChat(updatedChat);
    
    setChats(chats.map(chat => 
      chat.id === activeChat.id ? updatedChat : chat
    ));
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
            <X size={12} />
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
            <X size={12} />
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
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4 group`}
      >
        {!isOwnMessage && (
          <Avatar className="h-8 w-8 mr-2 mt-1">
            <AvatarImage src={message.avatar} />
            <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        
        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[75%]`}>
          <div className="flex items-center mb-1">
            {!isOwnMessage && <span className="text-sm font-medium mr-2">{message.sender}</span>}
            <span className="text-xs text-muted-foreground">{message.time}</span>
            {message.isPinned && (
              <Pin size={12} className="ml-1 text-amber-500" />
            )}
          </div>
          
          <div className={`relative rounded-lg px-3 py-2 ${
            isOwnMessage 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-foreground'
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
            
            {message.reactions && message.reactions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {message.reactions.map((reaction, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-background">
                    {reaction.emoji} {reaction.count}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => setReplyingTo(message)}>
                      <Reply size={12} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reply</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                    <Smile size={12} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <div className="flex flex-wrap gap-2">
                    {emojiOptions.map(emoji => (
                      <button
                        key={emoji}
                        className="text-lg hover:bg-muted p-1 rounded"
                        onClick={() => handleReaction(message.id, emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => togglePinMessage(message.id)}>
                      <Pin size={12} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{message.isPinned ? 'Unpin' : 'Pin'}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                    <MoreHorizontal size={12} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem>
                    <Forward size={14} className="mr-2" />
                    Forward
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit size={14} className="mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 size={14} className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
          
          <ScrollArea className="flex-1">
            {filteredChats.map((chat) => (
              <div 
                key={chat.id}
                className={`flex items-center p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
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
                  {chat.members?.some(member => member.status === 'online') && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
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
          </ScrollArea>
        </div>
        
        {/* Chat Window */}
        {activeChat ? (
          <div className="hidden md:flex md:flex-1 flex-col h-full">
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
                      {activeChat.members?.filter(m => m.status === 'online').length} online • {activeChat.members?.length} members
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Call</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Video className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Video call</TooltipContent>
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
                    <DropdownMenuItem>View profile</DropdownMenuItem>
                    <DropdownMenuItem>Block user</DropdownMenuItem>
                    <DropdownMenuItem>Search in conversation</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Clear chat</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Chat Tabs */}
            <Tabs value={activeChatTab} onValueChange={(v) => setActiveChatTab(v as 'chat' | 'files' | 'members')}>
              <div className="px-3 border-b">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="files">Files</TabsTrigger>
                  <TabsTrigger value="members">Members</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden m-0">
                {getPinnedMessages().length > 0 && (
                  <div className="p-3 bg-muted/30 border-b">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium flex items-center">
                        <Pin size={12} className="mr-1 text-amber-500" /> Pinned Messages
                      </span>
                      <ChevronRight size={14} className="text-muted-foreground" />
                    </div>
                    <div className="text-sm truncate text-muted-foreground">
                      {getPinnedMessages()[0].text}
                    </div>
                  </div>
                )}
                
                <ScrollArea className="flex-1 p-4">
                  {activeChat.messages.map((message, index) => 
                    renderMessage(message, index === activeChat.messages.length - 1)
                  )}
                  <div ref={messagesEndRef} />
                </ScrollArea>
                
                {/* Reply to message */}
                {replyingTo && (
                  <div className="px-4 py-2 border-t flex justify-between items-center bg-muted/30">
                    <div className="flex items-center">
                      <Reply size={14} className="mr-2 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium">{replyingTo.sender}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{replyingTo.text}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setReplyingTo(null)}>
                      <X size={14} />
                    </Button>
                  </div>
                )}
                
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
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Smile className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                          <div className="flex flex-wrap gap-2">
                            {emojiOptions.map(emoji => (
                              <button
                                key={emoji}
                                className="text-lg hover:bg-muted p-1 rounded"
                                onClick={() => {
                                  setNewMessage(prev => prev + emoji);
                                }}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                      
                      <Button onClick={handleSendMessage} className="rounded-full p-2">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="files" className="p-4 m-0">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Shared Files</h3>
                  
                  {getAllAttachments().length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getAllAttachments().map((attachment, index) => (
                        <div key={index} className="flex items-center p-3 border rounded-lg">
                          {attachment.type === 'image' ? (
                            <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center mr-3">
                              <Image className="h-6 w-6 text-blue-500" />
                            </div>
                          ) : attachment.type === 'video' ? (
                            <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center mr-3">
                              <FileVideo className="h-6 w-6 text-red-500" />
                            </div>
                          ) : attachment.type === 'audio' ? (
                            <div className="w-12 h-12 bg-purple-100 rounded flex items-center justify-center mr-3">
                              <FileAudio className="h-6 w-6 text-purple-500" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center mr-3">
                              <FileText className="h-6 w-6 text-gray-500" />
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <div className="font-medium text-sm">{attachment.name}</div>
                            <div className="text-xs text-muted-foreground">{attachment.size}</div>
                          </div>
                          
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                      <p>No files shared yet</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="members" className="p-4 m-0">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-4">Members</h3>
                  
                  {activeChat.isGroup && activeChat.members ? (
                    <div className="space-y-3">
                      {activeChat.members.map((member) => (
                        <div key={member.id} className="flex items-center p-2 hover:bg-muted rounded-lg transition-colors">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={member.avatarUrl} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="font-medium">{member.name}</div>
                            <div className="flex items-center">
                              <span className={cn(
                                "w-2 h-2 rounded-full mr-1",
                                member.status === 'online' ? "bg-green-500" : 
                                member.status === 'away' ? "bg-yellow-500" : "bg-gray-300"
                              )} />
                              <span className="text-xs text-muted-foreground capitalize">{member.status}</span>
                              {member.role && (
                                <>
                                  <span className="mx-1 text-muted-foreground">•</span>
                                  <span className="text-xs text-muted-foreground">{member.role}</span>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="rounded-full">
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Message</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="rounded-full">
                                    <Phone className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Call</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View profile</DropdownMenuItem>
                                <DropdownMenuItem>Make admin</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  Remove from group
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-2 opacity-30" />
                      <p>No members to display</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="hidden md:flex md:flex-1 items-center justify-center">
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
