import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, Smile, Users, FileText, Plus, Image, Video, File, Mic, Upload, Edit, Trash2, Download, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Mock data for chat messages
const initialMessages = [
  {
    id: 1,
    sender: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    message: 'Good morning team! I hope everyone had a great weekend. Let\'s discuss our priorities for this week.',
    time: '09:15 AM',
    reactions: [{ emoji: '👍', count: 2 }],
    groupId: 'team_general'
  },
  {
    id: 2,
    sender: 'Sam Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    message: 'I\'ve just finished the design mockups for the new landing page. I\'ll share them in our afternoon meeting.',
    time: '09:22 AM',
    reactions: [],
    groupId: 'team_general'
  },
  {
    id: 3,
    sender: 'Taylor Wong',
    avatar: 'https://i.pravatar.cc/150?img=3',
    message: 'I\'ve been working on the user authentication system. Should be ready for code review by end of day.',
    time: '09:30 AM',
    reactions: [{ emoji: '🚀', count: 3 }],
    groupId: 'team_general'
  },
  {
    id: 4,
    sender: 'Jordan Lee',
    avatar: 'https://i.pravatar.cc/150?img=4',
    message: 'Has anyone seen the latest analytics report? We should discuss the findings in our meeting today.',
    time: '09:45 AM',
    reactions: [],
    groupId: 'team_general'
  },
  {
    id: 5,
    sender: 'Alex Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    message: 'I\'ll pull up the analytics during our meeting. @Taylor, would you be able to give a quick update on the authentication system progress?',
    time: '10:05 AM',
    reactions: [{ emoji: '👀', count: 1 }],
    groupId: 'team_general'
  },
  {
    id: 6,
    sender: 'Sam Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    message: 'Hey everyone, could you check out the new design mockups?',
    time: '11:30 AM',
    reactions: [],
    attachment: {
      type: 'image',
      url: 'https://i.pravatar.cc/300?img=60',
      name: 'design_mockup.png'
    },
    groupId: 'design_team'
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

// Mock shared files - now as initial data
const initialSharedFiles = [
  { id: 1, name: 'Q2 Marketing Strategy.pdf', size: '2.4 MB', sharedBy: 'Alex Johnson', date: '2 days ago', type: 'file' },
  { id: 2, name: 'Website Mockups.sketch', size: '8.1 MB', sharedBy: 'Sam Smith', date: 'Yesterday', type: 'file' },
  { id: 3, name: 'Analytics Report April.xlsx', size: '1.7 MB', sharedBy: 'Jordan Lee', date: '3 hours ago', type: 'file' },
  { id: 4, name: 'Team Meeting Notes.docx', size: '512 KB', sharedBy: 'Taylor Wong', date: '1 hour ago', type: 'file' },
  { id: 5, name: 'UI Preview.png', size: '3.8 MB', sharedBy: 'Sam Smith', date: '30 minutes ago', type: 'image' },
  { id: 6, name: 'Product Demo.mp4', size: '24.6 MB', sharedBy: 'Taylor Wong', date: '1 hour ago', type: 'video' },
  { id: 7, name: 'Meeting Recording.mp3', size: '4.2 MB', sharedBy: 'Alex Johnson', date: '2 hours ago', type: 'voice' },
];

// Mock groups
const initialGroups = [
  { id: 'team_general', name: 'General', members: [1, 2, 3, 4, 5] },
  { id: 'design_team', name: 'Design Team', members: [1, 2, 4] },
  { id: 'dev_team', name: 'Development Team', members: [1, 3, 5] },
];

const TeamChat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [groups, setGroups] = useState(initialGroups);
  const [selectedGroup, setSelectedGroup] = useState('team_general');
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);
  const [isPersonalMessageOpen, setIsPersonalMessageOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [attachmentType, setAttachmentType] = useState<string | null>(null);
  const [personalMessageTo, setPersonalMessageTo] = useState<number | null>(null);
  const [personalMessageText, setPersonalMessageText] = useState('');
  const [personalMessageFile, setPersonalMessageFile] = useState<File | null>(null);
  const [sharedFiles, setSharedFiles] = useState(initialSharedFiles);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isEditFileDialogOpen, setIsEditFileDialogOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<any>(null);
  const [editFileName, setEditFileName] = useState('');
  const { toast } = useToast();
  
  const filteredMessages = messages.filter(msg => msg.groupId === selectedGroup);
  
  const activeGroup = groups.find(group => group.id === selectedGroup) || groups[0];
  const activeGroupMembers = teamMembers.filter(member => 
    activeGroup.members.includes(member.id)
  );

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const personalFileInputRef = React.useRef<HTMLInputElement>(null);
  const uploadFileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleCreateGroup = () => {
    if (newGroupName.trim() === '' || selectedMembers.length === 0) return;
    
    const newGroup = {
      id: `group_${Date.now()}`,
      name: newGroupName,
      members: selectedMembers
    };
    
    setGroups([...groups, newGroup]);
    setNewGroupName('');
    setSelectedMembers([]);
    setIsCreateGroupOpen(false);
    
    // Switch to the new group
    setSelectedGroup(newGroup.id);
  };
  
  const handleAddMembers = () => {
    if (selectedMembers.length === 0) return;
    
    const updatedGroups = groups.map(group => {
      if (group.id === selectedGroup) {
        // Filter out already existing members
        const newMembers = selectedMembers.filter(id => !group.members.includes(id));
        return {
          ...group,
          members: [...group.members, ...newMembers]
        };
      }
      return group;
    });
    
    setGroups(updatedGroups);
    setSelectedMembers([]);
    setIsAddMembersOpen(false);
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' && !selectedFile) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newMsg: any = {
      id: messages.length + 1,
      sender: 'You',
      avatar: 'https://i.pravatar.cc/150?img=1',
      message: newMessage,
      time: now,
      reactions: [],
      groupId: selectedGroup
    };
    
    if (selectedFile) {
      // In a real app, you would upload the file to a server and get a URL
      const fileURL = URL.createObjectURL(selectedFile);
      newMsg.attachment = {
        type: attachmentType || 'file',
        url: fileURL,
        name: selectedFile.name
      };
      
      // Also add to sharedFiles list
      const fileType = 
        selectedFile.type.startsWith('image') ? 'image' :
        selectedFile.type.startsWith('video') ? 'video' :
        selectedFile.type.startsWith('audio') ? 'voice' : 'file';
        
      const fileSize = (selectedFile.size / (1024 * 1024)).toFixed(1);
      
      setSharedFiles([...sharedFiles, {
        id: sharedFiles.length + 1,
        name: selectedFile.name,
        size: `${fileSize} MB`,
        sharedBy: 'You',
        date: 'Just now',
        type: fileType
      }]);
    }

    setMessages([...messages, newMsg]);
    setNewMessage('');
    setSelectedFile(null);
    setAttachmentType(null);
  };
  
  const handleSendPersonalMessage = () => {
    if ((personalMessageText.trim() === '' && !personalMessageFile) || !personalMessageTo) return;
    
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const recipient = teamMembers.find(member => member.id === personalMessageTo);
    
    if (!recipient) return;
    
    // Create a unique ID for direct messages between these two users
    const directMsgGroupId = `dm_you_${personalMessageTo}`;
    
    // Check if this direct message group already exists
    const dmGroupExists = groups.some(group => group.id === directMsgGroupId);
    
    if (!dmGroupExists) {
      // Create a new direct message group
      setGroups([...groups, {
        id: directMsgGroupId,
        name: `Chat with ${recipient.name}`,
        members: [1, personalMessageTo] // Assuming current user is id 1
      }]);
    }
    
    const newMsg: any = {
      id: messages.length + 1,
      sender: 'You',
      avatar: 'https://i.pravatar.cc/150?img=1',
      message: personalMessageText,
      time: now,
      reactions: [],
      groupId: directMsgGroupId
    };
    
    if (personalMessageFile) {
      // Handle file attachment for personal message
      const fileURL = URL.createObjectURL(personalMessageFile);
      const fileType = 
        personalMessageFile.type.startsWith('image') ? 'image' :
        personalMessageFile.type.startsWith('video') ? 'video' :
        personalMessageFile.type.startsWith('audio') ? 'voice' : 'file';
        
      newMsg.attachment = {
        type: fileType,
        url: fileURL,
        name: personalMessageFile.name
      };
    }
    
    setMessages([...messages, newMsg]);
    setPersonalMessageText('');
    setPersonalMessageFile(null);
    setPersonalMessageTo(null);
    setIsPersonalMessageOpen(false);
    
    // Switch to this direct message
    setSelectedGroup(directMsgGroupId);
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
  
  const handleMemberSelect = (memberId: number) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };
  
  const handleFileSelect = (type: string) => {
    setAttachmentType(type);
    if (fileInputRef.current) {
      const acceptTypes = 
        type === 'image' ? 'image/*' :
        type === 'video' ? 'video/*' :
        type === 'voice' ? 'audio/*' : 
        '*/*';
      
      fileInputRef.current.accept = acceptTypes;
      fileInputRef.current.click();
    }
  };
  
  const handlePersonalFileSelect = (type: string) => {
    if (personalFileInputRef.current) {
      const acceptTypes = 
        type === 'image' ? 'image/*' :
        type === 'video' ? 'video/*' :
        type === 'voice' ? 'audio/*' : 
        '*/*';
      
      personalFileInputRef.current.accept = acceptTypes;
      personalFileInputRef.current.click();
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach((file) => {
      const fileType = 
        file.type.startsWith('image') ? 'image' :
        file.type.startsWith('video') ? 'video' :
        file.type.startsWith('audio') ? 'voice' : 'file';
        
      const fileSize = (file.size / (1024 * 1024)).toFixed(1);
      
      const newFile = {
        id: sharedFiles.length + Math.random(),
        name: file.name,
        size: `${fileSize} MB`,
        sharedBy: 'You',
        date: 'Just now',
        type: fileType,
        file: file // Store the actual file object for potential future use
      };
      
      setSharedFiles(prev => [...prev, newFile]);
    });
    
    setIsUploadDialogOpen(false);
    toast({
      title: "Files uploaded successfully",
      description: `${files.length} file(s) have been uploaded to the team chat.`,
    });
  };
  
  const handleDeleteFile = (fileId: number) => {
    setSharedFiles(prev => prev.filter(file => file.id !== fileId));
    toast({
      title: "File deleted",
      description: "The file has been removed from the team chat.",
    });
  };
  
  const handleEditFile = (file: any) => {
    setEditingFile(file);
    setEditFileName(file.name);
    setIsEditFileDialogOpen(true);
  };
  
  const handleSaveFileEdit = () => {
    if (!editingFile || !editFileName.trim()) return;
    
    setSharedFiles(prev => prev.map(file => 
      file.id === editingFile.id 
        ? { ...file, name: editFileName.trim() }
        : file
    ));
    
    setIsEditFileDialogOpen(false);
    setEditingFile(null);
    setEditFileName('');
    
    toast({
      title: "File renamed",
      description: "The file name has been updated successfully.",
    });
  };
  
  const handleDownloadFile = (file: any) => {
    // In a real application, this would download the actual file
    toast({
      title: "Download started",
      description: `Downloading ${file.name}...`,
    });
  };
  
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <Image size={24} className="text-blue-500" />;
      case 'video':
        return <Video size={24} className="text-purple-500" />;
      case 'voice':
        return <Mic size={24} className="text-green-500" />;
      default:
        return <FileText size={24} className="text-blue-500" />;
    }
  };

  const renderAttachmentPreview = (attachment: any) => {
    if (!attachment) return null;
    
    switch (attachment.type) {
      case 'image':
        return (
          <div className="mt-2 rounded-md overflow-hidden">
            <img src={attachment.url} alt={attachment.name} className="max-h-48 object-cover" />
          </div>
        );
      case 'video':
        return (
          <div className="mt-2 rounded-md overflow-hidden">
            <video controls className="max-h-48 w-full">
              <source src={attachment.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'voice':
        return (
          <div className="mt-2">
            <audio controls className="w-full">
              <source src={attachment.url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      default:
        return (
          <div className="mt-2 flex items-center p-2 rounded-md bg-muted/50">
            <File size={16} className="mr-2" />
            <span className="text-sm truncate">{attachment.name}</span>
          </div>
        );
    }
  };

  return (
    <Card className="flex flex-col h-[700px]">
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
            <div className="border-b p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select chat" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">
                  {activeGroupMembers.length} members
                </span>
              </div>
              <div className="flex gap-2">
                <Dialog open={isAddMembersOpen} onOpenChange={setIsAddMembersOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <Users size={14} className="mr-1" /> Add Members
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Members to {activeGroup?.name}</DialogTitle>
                      <DialogDescription>
                        Select team members to add to this chat group.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 max-h-[300px] overflow-y-auto">
                      {teamMembers
                        .filter(m => !activeGroup.members.includes(m.id))
                        .map(member => (
                          <div key={member.id} className="flex items-center space-x-2 py-2">
                            <Checkbox 
                              id={`member-${member.id}`} 
                              checked={selectedMembers.includes(member.id)}
                              onCheckedChange={() => handleMemberSelect(member.id)} 
                            />
                            <Label htmlFor={`member-${member.id}`} className="flex items-center gap-2 cursor-pointer">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>{member.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{member.name}</p>
                                <p className="text-xs text-muted-foreground">{member.role}</p>
                              </div>
                            </Label>
                          </div>
                        ))}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddMembersOpen(false)}>Cancel</Button>
                      <Button 
                        onClick={handleAddMembers}
                        disabled={selectedMembers.length === 0}
                      >
                        Add Selected Members
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8">
                      <Plus size={14} className="mr-1" /> New Chat
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Group Chat</DialogTitle>
                      <DialogDescription>
                        Start a new conversation with your team members.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="mb-4">
                        <Label htmlFor="group-name">Group Name</Label>
                        <Input 
                          id="group-name" 
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          placeholder="Enter group name"
                        />
                      </div>
                      <div className="mb-2">
                        <Label>Select Members</Label>
                      </div>
                      <div className="max-h-[200px] overflow-y-auto">
                        {teamMembers.map(member => (
                          <div key={member.id} className="flex items-center space-x-2 py-2">
                            <Checkbox 
                              id={`new-member-${member.id}`} 
                              checked={selectedMembers.includes(member.id)}
                              onCheckedChange={() => handleMemberSelect(member.id)} 
                            />
                            <Label htmlFor={`new-member-${member.id}`} className="flex items-center gap-2 cursor-pointer">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>{member.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{member.name}</p>
                                <p className="text-xs text-muted-foreground">{member.role}</p>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateGroupOpen(false)}>Cancel</Button>
                      <Button 
                        onClick={handleCreateGroup}
                        disabled={newGroupName.trim() === '' || selectedMembers.length === 0}
                      >
                        Create Group
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {filteredMessages.map((msg) => (
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
                        {msg.attachment && renderAttachmentPreview(msg.attachment)}
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
                
                {selectedFile && (
                  <div className="flex gap-3 items-center bg-muted/50 p-3 rounded-md">
                    <div className="flex-1">
                      <div className="font-medium text-sm">Attachment: {selectedFile.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />
            
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="shrink-0"
                      >
                        <Paperclip size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleFileSelect('image')}>
                        <Image size={16} className="mr-2" /> Image
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFileSelect('video')}>
                        <Video size={16} className="mr-2" /> Video
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFileSelect('voice')}>
                        <Mic size={16} className="mr-2" /> Voice
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleFileSelect('file')}>
                        <File size={16} className="mr-2" /> Document
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
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
                  
                  <Dialog open={isPersonalMessageOpen} onOpenChange={setIsPersonalMessageOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="ghost" size="icon" className="shrink-0">
                        <Users size={18} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Personal Message</DialogTitle>
                        <DialogDescription>
                          Send a direct message to a team member
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <div>
                          <Label htmlFor="recipient">Select Recipient</Label>
                          <Select onValueChange={(value) => setPersonalMessageTo(Number(value))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select team member" />
                            </SelectTrigger>
                            <SelectContent>
                              {teamMembers.map(member => (
                                <SelectItem key={member.id} value={member.id.toString()}>
                                  {member.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="personal-message">Message</Label>
                          <Input 
                            id="personal-message"
                            value={personalMessageText} 
                            onChange={(e) => setPersonalMessageText(e.target.value)}
                            placeholder="Type your message..."
                          />
                        </div>
                        
                        <input
                          type="file"
                          ref={personalFileInputRef}
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setPersonalMessageFile(e.target.files[0]);
                            }
                          }}
                        />
                        
                        <div className="flex gap-2 flex-wrap">
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePersonalFileSelect('image')}
                          >
                            <Image size={14} className="mr-2" /> Image
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePersonalFileSelect('video')}
                          >
                            <Video size={14} className="mr-2" /> Video
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePersonalFileSelect('voice')}
                          >
                            <Mic size={14} className="mr-2" /> Voice
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePersonalFileSelect('file')}
                          >
                            <File size={14} className="mr-2" /> Document
                          </Button>
                        </div>
                        
                        {personalMessageFile && (
                          <div className="bg-muted/50 p-2 rounded flex justify-between items-center">
                            <div className="text-sm truncate">
                              {personalMessageFile.name} ({(personalMessageFile.size / 1024).toFixed(1)} KB)
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setPersonalMessageFile(null)}
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {
                          setIsPersonalMessageOpen(false);
                          setPersonalMessageText('');
                          setPersonalMessageFile(null);
                          setPersonalMessageTo(null);
                        }}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSendPersonalMessage}
                          disabled={(!personalMessageText.trim() && !personalMessageFile) || !personalMessageTo}
                        >
                          Send Message
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Button type="submit" className="shrink-0">
                    <Send size={16} className="mr-2" /> Send
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="files" className="h-full m-0">
            <div className="border-b p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Shared Files</h3>
                <Badge variant="outline">{sharedFiles.length}</Badge>
              </div>
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Upload size={14} className="mr-2" /> Upload Files
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Files</DialogTitle>
                    <DialogDescription>
                      Upload documents, images, videos, and other files to share with your team.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <input
                      type="file"
                      ref={uploadFileInputRef}
                      className="hidden"
                      multiple
                      accept=".pdf,.sketch,.xlsx,.xls,.docx,.doc,.png,.mp4,.mp3,.jpg,.jpeg,.gif,.bmp,.tiff,.svg,.webp,.mov,.avi,.mkv,.wav,.m4a,.ogg"
                      onChange={handleFileUpload}
                    />
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Upload size={48} className="mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Supports PDF, Sketch, Excel, Word, Images, Videos, Audio files
                      </p>
                      <Button onClick={() => uploadFileInputRef.current?.click()}>
                        Choose Files
                      </Button>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {sharedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {file.size} • Shared by {file.sharedBy} • {file.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadFile(file)}
                        >
                          <Download size={16} />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditFile(file)}>
                              <Edit size={16} className="mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadFile(file)}>
                              <Download size={16} className="mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteFile(file.id)}
                              className="text-red-600"
                            >
                              <Trash2 size={16} className="mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                  {sharedFiles.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <FileText size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No files shared yet</p>
                      <p className="text-sm">Upload files to share with your team</p>
                    </div>
                  )}
                </div>
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
                    <div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Message</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Message to {member.name}</DialogTitle>
                          </DialogHeader>
                          <div className="py-4 space-y-4">
                            <div>
                              <Label htmlFor={`msg-${member.id}`}>Message</Label>
                              <Input 
                                id={`msg-${member.id}`}
                                placeholder="Type your message..."
                              />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                              >
                                <Image size={14} className="mr-2" /> Image
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                              >
                                <Video size={14} className="mr-2" /> Video
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                              >
                                <Mic size={14} className="mr-2" /> Voice
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                              >
                                <File size={14} className="mr-2" /> Document
                              </Button>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button>Send Message</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        {/* Edit File Dialog */}
        <Dialog open={isEditFileDialogOpen} onOpenChange={setIsEditFileDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename File</DialogTitle>
              <DialogDescription>
                Enter a new name for the file.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="file-name">File Name</Label>
              <Input 
                id="file-name"
                value={editFileName}
                onChange={(e) => setEditFileName(e.target.value)}
                placeholder="Enter file name"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditFileDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveFileEdit}
                disabled={!editFileName.trim()}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TeamChat;
