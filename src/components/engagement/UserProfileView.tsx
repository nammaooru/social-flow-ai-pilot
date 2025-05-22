
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, AtSign, Calendar, MapPin, Activity, MessageSquare, BarChart2, Send } from 'lucide-react';

interface UserProfileViewProps {
  open: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    username?: string;
    avatar: string;
    platform: string;
    bio?: string;
    location?: string;
    joinedDate?: string;
    followers?: number;
    following?: number;
    engagementRate?: string;
    recentPosts?: Array<{
      id: string;
      content: string;
      date: string;
      likes: number;
      comments: number;
    }>;
    recentComments?: Array<{
      id: string;
      content: string;
      date: string;
      post: string;
    }>;
  } | null;
}

const UserProfileView: React.FC<UserProfileViewProps> = ({ open, onClose, user }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>View detailed information about this user</DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center mt-2">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold mt-2">{user.name}</h2>
          {user.username && (
            <div className="flex items-center text-muted-foreground mt-1">
              <AtSign className="h-3 w-3 mr-1" />
              <span>{user.username}</span>
            </div>
          )}
          <div className="flex items-center mt-1">
            <Badge variant="outline" className="mr-2">{user.platform}</Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          <div className="p-2 bg-muted rounded-md">
            <div className="text-xl font-bold">{user.followers || 0}</div>
            <div className="text-xs text-muted-foreground">Followers</div>
          </div>
          <div className="p-2 bg-muted rounded-md">
            <div className="text-xl font-bold">{user.following || 0}</div>
            <div className="text-xs text-muted-foreground">Following</div>
          </div>
          <div className="p-2 bg-muted rounded-md">
            <div className="text-xl font-bold">{user.engagementRate || '0%'}</div>
            <div className="text-xs text-muted-foreground">Engagement</div>
          </div>
        </div>
        
        <Tabs defaultValue="info" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {user.bio && (
                    <div>
                      <h3 className="font-medium mb-1">Bio</h3>
                      <p className="text-sm text-muted-foreground">{user.bio}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2">
                    {user.location && (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    
                    {user.joinedDate && (
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Joined {user.joinedDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="posts">
            {user.recentPosts && user.recentPosts.length > 0 ? (
              <div className="space-y-3">
                {user.recentPosts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-3">
                      <p className="text-sm">{post.content}</p>
                      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                        <span>{post.date}</span>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            <span>{post.comments}</span>
                          </div>
                          <div className="flex items-center">
                            <Activity className="h-3 w-3 mr-1" />
                            <span>{post.likes}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Activity className="h-6 w-6 mx-auto mb-2" />
                <p>No recent posts found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="comments">
            {user.recentComments && user.recentComments.length > 0 ? (
              <div className="space-y-3">
                {user.recentComments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="p-3">
                      <div className="text-xs text-muted-foreground mb-1">
                        On post: {comment.post}
                      </div>
                      <p className="text-sm">{comment.content}</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        {comment.date}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <MessageSquare className="h-6 w-6 mx-auto mb-2" />
                <p>No recent comments found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileView;
