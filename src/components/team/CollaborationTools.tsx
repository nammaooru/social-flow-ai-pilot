
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileText, Users, MessageSquare, Calendar, Video, Mail, Settings, Star, Copy, ExternalLink } from 'lucide-react';

const collaborationTools = [
  {
    id: '1',
    name: 'Google Workspace',
    description: 'Documents, sheets, and presentations for team collaboration.',
    icon: FileText,
    category: 'documentation',
    url: 'https://workspace.google.com',
    favorites: 38
  },
  {
    id: '2',
    name: 'Slack',
    description: 'Real-time messaging and file sharing for teams.',
    icon: MessageSquare,
    category: 'communication',
    url: 'https://slack.com',
    favorites: 42
  },
  {
    id: '3',
    name: 'Trello',
    description: 'Visual project management with cards and boards.',
    icon: Users,
    category: 'project',
    url: 'https://trello.com',
    favorites: 26
  },
  {
    id: '4',
    name: 'Zoom',
    description: 'Video conferencing and remote meetings.',
    icon: Video,
    category: 'communication',
    url: 'https://zoom.us',
    favorites: 35
  },
  {
    id: '5',
    name: 'Google Calendar',
    description: 'Schedule meetings and track team availability.',
    icon: Calendar,
    category: 'scheduling',
    url: 'https://calendar.google.com',
    favorites: 29
  },
  {
    id: '6',
    name: 'Notion',
    description: 'All-in-one workspace for notes, tasks, and knowledge base.',
    icon: FileText,
    category: 'documentation',
    url: 'https://notion.so',
    favorites: 44
  },
  {
    id: '7',
    name: 'Asana',
    description: 'Project and task management for teams.',
    icon: Users,
    category: 'project',
    url: 'https://asana.com',
    favorites: 31
  },
  {
    id: '8',
    name: 'Gmail',
    description: 'Email service by Google.',
    icon: Mail,
    category: 'communication',
    url: 'https://mail.google.com',
    favorites: 33
  },
];

const recentCollaborations = [
  {
    id: '1',
    title: 'Q3 Marketing Strategy',
    type: 'Google Doc',
    icon: FileText,
    updatedAt: '10 minutes ago',
    updatedBy: {
      name: 'Alex Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    url: '#'
  },
  {
    id: '2',
    title: 'Website Redesign Project',
    type: 'Trello Board',
    icon: Users,
    updatedAt: '2 hours ago',
    updatedBy: {
      name: 'Sam Smith',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    url: '#'
  },
  {
    id: '3',
    title: 'Marketing Team Meeting',
    type: 'Zoom',
    icon: Video,
    updatedAt: 'Today, 9:00 AM',
    updatedBy: {
      name: 'Jordan Lee',
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    url: '#'
  },
  {
    id: '4',
    title: 'Brand Guidelines',
    type: 'Notion',
    icon: FileText,
    updatedAt: 'Yesterday',
    updatedBy: {
      name: 'Taylor Wong',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    url: '#'
  },
];

const CollaborationTools = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [favoriteTools, setFavoriteTools] = useState<string[]>(['1', '2', '6']);

  const handleFavoriteToggle = (id: string) => {
    if (favoriteTools.includes(id)) {
      setFavoriteTools(favoriteTools.filter(toolId => toolId !== id));
    } else {
      setFavoriteTools([...favoriteTools, id]);
    }
  };

  const filteredTools = collaborationTools.filter(tool => {
    if (filter !== 'all' && tool.category !== filter) return false;
    if (searchQuery && !tool.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !tool.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-3/4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Collaboration Tools</h2>
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="Search tools..." 
                  className="w-[200px]" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline" size="sm" onClick={() => setFilter('all')}>All</Button>
                <Button 
                  variant={filter === 'communication' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('communication')}
                >
                  Communication
                </Button>
                <Button 
                  variant={filter === 'documentation' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('documentation')}
                >
                  Documentation
                </Button>
                <Button 
                  variant={filter === 'project' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('project')}
                >
                  Project
                </Button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <Card key={tool.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-primary/10">
                          <tool.icon className="h-4 w-4 text-primary" />
                        </div>
                        <CardTitle className="text-base">{tool.name}</CardTitle>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleFavoriteToggle(tool.id)}
                      >
                        <Star className={`h-4 w-4 ${favoriteTools.includes(tool.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      </Button>
                    </div>
                    <CardDescription className="mt-2">{tool.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <Badge variant="outline">
                      {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigator.clipboard.writeText(tool.url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="md:w-1/4">
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recent Collaborations</CardTitle>
                <CardDescription>Recently accessed documents and tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCollaborations.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{item.title}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <span>{item.type}</span>
                          <span>•</span>
                          <span>{item.updatedAt}</span>
                        </div>
                      </div>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={item.updatedBy.avatar} />
                        <AvatarFallback>{item.updatedBy.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">View All</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Tool Integrations</CardTitle>
                <CardDescription>Configure your collaboration tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-primary/10">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>Google Workspace</div>
                    </div>
                    <Badge variant="outline" className="bg-green-100">Connected</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-primary/10">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                      <div>Slack</div>
                    </div>
                    <Badge variant="outline" className="bg-green-100">Connected</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-primary/10">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>Asana</div>
                    </div>
                    <Badge variant="outline">Not Connected</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-primary/10">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>Notion</div>
                    </div>
                    <Badge variant="outline">Not Connected</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Integrations
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollaborationTools;
