
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  UserPlus,
  FileText,
  Send,
  Paperclip,
  X,
  Reply,
  Forward,
  Upload,
  Download,
  Edit,
  Trash2,
} from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  avatar: string;
  attachment?: {
    type: 'image' | 'file';
    name: string;
    url: string;
    preview?: string;
  };
}

interface Attachment {
  type: 'image' | 'file' | 'video' | 'voice' | 'emoji' | 'document';
  name: string;
  url?: string;
  preview?: string;
}

interface SharedFile {
  id: string;
  name: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
  type: string;
}

const TeamChat = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'John Doe',
      text: 'Hey team, anyone available for a quick sync this afternoon?',
      timestamp: '2:30 PM',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: '2',
      sender: 'Jane Smith',
      text: 'I can do 3 PM. Anything specific on the agenda?',
      timestamp: '2:35 PM',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
      id: '3',
      sender: 'John Doe',
      text: 'Just wanted to align on the upcoming marketing campaign.',
      timestamp: '2:40 PM',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: '4',
      sender: 'Alice Johnson',
      text: 'Sounds good, I\'m in!',
      timestamp: '2:45 PM',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    {
      id: '5',
      sender: 'Bob Williams',
      text: 'Count me in as well.',
      timestamp: '2:50 PM',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    {
      id: '6',
      sender: 'Jane Smith',
      text: 'I\'ve attached the campaign brief for everyone to review.',
      timestamp: '2:55 PM',
      avatar: 'https://i.pravatar.cc/150?img=2',
      attachment: {
        type: 'file',
        name: 'campaign_brief.pdf',
        url: '/files/campaign_brief.pdf',
      },
    },
    {
      id: '7',
      sender: 'John Doe',
      text: 'Thanks, Jane! I\'ll take a look.',
      timestamp: '3:00 PM',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: '8',
      sender: 'Alice Johnson',
      text: 'Great, looking forward to discussing it!',
      timestamp: '3:05 PM',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
  ]);

  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([
    {
      id: '1',
      name: 'Campaign Brief.pdf',
      size: '2.5 MB',
      uploadedBy: 'Jane Smith',
      uploadedAt: '2:55 PM',
      url: '/files/campaign_brief.pdf',
      type: 'pdf'
    },
    {
      id: '2',
      name: 'Marketing Plan.docx',
      size: '1.8 MB',
      uploadedBy: 'John Doe',
      uploadedAt: 'Yesterday',
      url: '/files/marketing_plan.docx',
      type: 'docx'
    },
    {
      id: '3',
      name: 'Logo.png',
      size: '500 KB',
      uploadedBy: 'Alice Johnson',
      uploadedAt: '1 week ago',
      url: '/images/logo.png',
      type: 'png'
    },
  ]);

  const [members, setMembers] = useState([
    {
      id: '1',
      name: 'John Doe',
      role: 'Team Lead',
      avatar: 'https://i.pravatar.cc/150?img=1',
      status: 'online',
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'Marketing Manager',
      avatar: 'https://i.pravatar.cc/150?img=2',
      status: 'offline',
    },
    {
      id: '3',
      name: 'Alice Johnson',
      role: 'Creative Director',
      avatar: 'https://i.pravatar.cc/150?img=3',
      status: 'online',
    },
    {
      id: '4',
      name: 'Bob Williams',
      role: 'Sales Representative',
      avatar: 'https://i.pravatar.cc/150?img=4',
      status: 'offline',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (newMessage.trim() === '' && attachments.length === 0) return;

    const message: Message = {
      id: String(messages.length + 1),
      sender: 'You',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: 'https://i.pravatar.cc/150?img=5',
      attachment: attachments.length > 0
        ? {
          type: attachments[0].type === 'image' ? 'image' : 'file',
          name: attachments[0].name,
          url: attachments[0].url || '',
          preview: attachments[0].preview,
        }
        : undefined,
    };

    setMessages([...messages, message]);
    setNewMessage('');
    setAttachments([]);
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully",
    });
  };

  const handleAttachment = (type: 'image' | 'file' | 'video' | 'voice' | 'emoji' | 'document') => {
    if (type === 'emoji') {
      toast({
        title: "Emoji selected",
        description: "Emoji selection feature activated",
      });
      return;
    }

    if (type === 'voice') {
      toast({
        title: "Voice recording",
        description: "Voice recording feature activated",
      });
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    
    // Set accept based on type
    switch (type) {
      case 'image':
        input.accept = 'image/*';
        break;
      case 'video':
        input.accept = 'video/*';
        break;
      case 'document':
      case 'file':
        input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt';
        break;
      default:
        input.accept = '*/*';
    }

    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const attachment: Attachment = {
            type: type,
            name: file.name,
            url: e.target.result,
            preview: type === 'image' ? e.target.result : undefined,
          };
          setAttachments([attachment]);
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const handleReplyMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setNewMessage(`Replying to: "${message.text.substring(0, 30)}${message.text.length > 30 ? '...' : ''}" \n\n`);
    }
    toast({
      title: "Reply mode activated",
      description: "You can now type your reply",
    });
  };

  const handleForwardMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      toast({
        title: "Forward message",
        description: `Message "${message.text.substring(0, 30)}..." ready to forward`,
      });
    }
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.gif,.mp4,.mp3,.sketch';
    input.multiple = true;

    input.onchange = (event: any) => {
      const files = Array.from(event.target.files) as File[];
      
      files.forEach((file) => {
        const newFile: SharedFile = {
          id: String(sharedFiles.length + Math.random()),
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          uploadedBy: 'You',
          uploadedAt: 'Just now',
          url: URL.createObjectURL(file),
          type: file.name.split('.').pop()?.toLowerCase() || 'file'
        };
        
        setSharedFiles(prev => [...prev, newFile]);
      });

      toast({
        title: "Files uploaded",
        description: `${files.length} file(s) uploaded successfully`,
      });
    };

    input.click();
  };

  const handleFileRename = (fileId: string) => {
    if (!newFileName.trim()) return;
    
    setSharedFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, name: newFileName }
        : file
    ));
    
    setEditingFile(null);
    setNewFileName('');
    
    toast({
      title: "File renamed",
      description: "File has been renamed successfully",
    });
  };

  const handleFileDownload = (file: SharedFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
    
    toast({
      title: "Download started",
      description: `Downloading ${file.name}`,
    });
  };

  const handleFileDelete = (fileId: string) => {
    const file = sharedFiles.find(f => f.id === fileId);
    setSharedFiles(prev => prev.filter(f => f.id !== fileId));
    
    toast({
      title: "File deleted",
      description: `${file?.name} has been deleted`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Team Chat</h3>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateGroup(true)} className="flex items-center gap-2">
            <Plus size={16} />
            New Group
          </Button>
          <Button onClick={() => setShowAddMember(true)} variant="outline" className="flex items-center gap-2">
            <UserPlus size={16} />
            Add Member
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Team Messages</span>
                <Badge variant="outline">{messages.length} messages</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex items-start gap-3 group">
                      <Avatar>
                        <AvatarImage src={message.avatar} alt={message.sender} />
                        <AvatarFallback>{message.sender.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{message.sender}</span>
                          <span className="text-muted-foreground">{message.timestamp}</span>
                        </div>
                        <div className="text-sm bg-muted p-2 rounded-lg relative">
                          {message.text}
                          {message.attachment && (
                            <div className="mt-2">
                              {message.attachment.type === 'image' && (
                                <img src={message.attachment.url} alt="attachment" className="max-w-xs rounded" />
                              )}
                              {message.attachment.type === 'file' && (
                                <div className="flex items-center gap-2 p-2 bg-background rounded border">
                                  <FileText size={16} />
                                  <span className="text-xs">{message.attachment.name}</span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => handleReplyMessage(message.id)}
                            >
                              <Reply size={12} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => handleForwardMessage(message.id)}
                            >
                              <Forward size={12} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((attachment, index) => (
                      <div key={index} className="relative">
                        {attachment.type === 'image' && attachment.preview && (
                          <div className="relative">
                            <img src={attachment.preview} alt={attachment.name} className="h-16 w-16 object-cover rounded-md" />
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="h-5 w-5 absolute -top-2 -right-2 p-0"
                              onClick={() => removeAttachment(index)}
                            >
                              <X size={12} />
                            </Button>
                          </div>
                        )}
                        {(attachment.type === 'file' || attachment.type === 'document') && (
                          <div className="relative bg-muted p-2 rounded-md flex items-center gap-2">
                            <FileText size={16} />
                            <span className="text-xs max-w-[80px] truncate">{attachment.name}</span>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="h-5 w-5 absolute -top-2 -right-2 p-0"
                              onClick={() => removeAttachment(index)}
                            >
                              <X size={12} />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
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
                        <span>😊</span>
                        <span>Emoji</span>
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Team Files</span>
                <Button onClick={handleFileUpload} className="flex items-center gap-2">
                  <Upload size={16} />
                  Upload Files
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {sharedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <div className="flex-1">
                        {editingFile === file.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={newFileName}
                              onChange={(e) => setNewFileName(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleFileRename(file.id)}
                              className="h-8"
                            />
                            <Button size="sm" onClick={() => handleFileRename(file.id)}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingFile(null)}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="font-medium">{file.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {file.size} • Uploaded by {file.uploadedBy} at {file.uploadedAt}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleFileDownload(file)}
                          className="h-8 w-8"
                        >
                          <Download size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            setEditingFile(file.id);
                            setNewFileName(file.name);
                          }}
                          className="h-8 w-8"
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleFileDelete(file.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.role}</div>
                      </div>
                      <Badge variant="outline">{member.status}</Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Enter the name for the new group and select members.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Group Name
              </Label>
              <Input id="name" defaultValue="New Group" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Group</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
            <DialogDescription>
              Search for a member to add to the team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="member-name" className="text-right">
                Member Name
              </Label>
              <Input id="member-name" placeholder="Search Member" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamChat;
