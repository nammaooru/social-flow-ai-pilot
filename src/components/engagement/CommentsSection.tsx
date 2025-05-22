
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Filter, Search, MessageCircle, ThumbsUp, Reply, MoreHorizontal, 
  Calendar, ArrowUpDown, CheckCircle, Clock, AlertCircle, Eye, Flag, Trash
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// Mock data for comments
const comments = [
  {
    id: '1',
    author: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    platform: 'Instagram',
    post: 'Summer Collection Launch',
    comment: 'Love the new designs! When will they be available in stores?',
    time: '10 minutes ago',
    sentiment: 'positive',
    replied: false,
    liked: false
  },
  {
    id: '2',
    author: 'Mike Thompson',
    avatar: 'https://i.pravatar.cc/150?img=2',
    platform: 'Facebook',
    post: 'Customer Appreciation Post',
    comment: 'Had a bad experience with your customer service yesterday. Still waiting for a resolution.',
    time: '45 minutes ago',
    sentiment: 'negative',
    replied: true,
    liked: false
  },
  {
    id: '3',
    author: 'Emma Davis',
    avatar: 'https://i.pravatar.cc/150?img=3',
    platform: 'Twitter',
    post: 'Product Tutorial Video',
    comment: 'This was so helpful! Could you do a tutorial on the other features as well?',
    time: '2 hours ago',
    sentiment: 'positive',
    replied: false,
    liked: true
  },
  {
    id: '4',
    author: 'James Wilson',
    avatar: 'https://i.pravatar.cc/150?img=4',
    platform: 'LinkedIn',
    post: 'Company Update',
    comment: "Interesting to see your company's growth. Would love to discuss potential collaboration.",
    time: '1 day ago',
    sentiment: 'neutral',
    replied: true,
    liked: true
  },
  {
    id: '5',
    author: 'Olivia Martinez',
    avatar: 'https://i.pravatar.cc/150?img=5',
    platform: 'Instagram',
    post: 'Behind the Scenes',
    comment: 'Such a great team! The energy really shows in your products.',
    time: '3 days ago',
    sentiment: 'positive',
    replied: false,
    liked: false
  }
];

const platformColors = {
  Instagram: 'bg-pink-500',
  Facebook: 'bg-blue-600',
  Twitter: 'bg-blue-400',
  LinkedIn: 'bg-blue-800'
};

const sentimentColors = {
  positive: 'bg-green-500',
  neutral: 'bg-gray-500',
  negative: 'bg-red-500'
};

const CommentsSection = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComment, setSelectedComment] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [commentsData, setCommentsData] = useState(comments);
  const { toast } = useToast();

  const filteredComments = commentsData.filter(comment => {
    if (filter !== 'all' && comment.platform.toLowerCase() !== filter) {
      return false;
    }
    
    if (searchQuery && !comment.comment.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleReply = (id: string) => {
    if (selectedComment !== id) {
      setSelectedComment(id);
      const suggestedReply = commentsData.find(c => c.id === id)?.sentiment === 'positive' 
        ? "Thank you for your positive feedback! We appreciate your support."
        : "Thank you for reaching out. We'd like to address your concerns.";
      setReplyText(suggestedReply);
    } else {
      setSelectedComment(null);
      setReplyText('');
    }
  };

  const sendReply = () => {
    if (!replyText.trim()) return;
    
    setCommentsData(comments => 
      comments.map(c => 
        c.id === selectedComment 
          ? {...c, replied: true} 
          : c
      )
    );
    
    toast({
      title: "Reply sent",
      description: "Your reply has been sent successfully",
    });
    
    setSelectedComment(null);
    setReplyText('');
  };
  
  const handleLike = (id: string) => {
    setCommentsData(comments => 
      comments.map(c => 
        c.id === id 
          ? {...c, liked: !c.liked} 
          : c
      )
    );
    
    const comment = commentsData.find(c => c.id === id);
    const action = comment && !comment.liked ? 'liked' : 'unliked';
    
    toast({
      title: `Comment ${action}`,
      description: `You have ${action} the comment`,
    });
  };
  
  const handleViewProfile = (id: string) => {
    toast({
      title: "View profile",
      description: "Viewing user profile functionality triggered",
    });
  };
  
  const handleFlag = (id: string) => {
    toast({
      title: "Flag comment",
      description: "Comment flagged for review",
    });
  };
  
  const handleDelete = (id: string) => {
    setCommentsData(comments => comments.filter(c => c.id !== id));
    
    toast({
      title: "Comment deleted",
      description: "The comment has been deleted successfully",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <CardTitle>Recent Comments</CardTitle>
          <div className="flex flex-wrap gap-2">
            <div className="relative flex items-center">
              <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search comments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full md:w-auto max-w-[200px]"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[140px]">
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
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredComments.length > 0 ? (
            filteredComments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={comment.avatar} alt={comment.author} />
                      <AvatarFallback>{comment.author.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{comment.author}</div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <div className={`h-2 w-2 rounded-full mr-2 ${platformColors[comment.platform]}`}></div>
                        <span>{comment.platform}</span>
                        <span className="mx-2">•</span>
                        <span>{comment.time}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={comment.sentiment === 'positive' ? 'default' : comment.sentiment === 'negative' ? 'destructive' : 'secondary'}>
                    {comment.sentiment}
                  </Badge>
                </div>
                
                <div className="ml-10">
                  <div className="text-sm text-muted-foreground">On post: {comment.post}</div>
                  <div className="my-2">{comment.comment}</div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex space-x-2">
                      <Button 
                        variant={comment.liked ? "default" : "ghost"} 
                        size="sm" 
                        className="h-8"
                        onClick={() => handleLike(comment.id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {comment.liked ? 'Liked' : 'Like'}
                      </Button>
                      <Button 
                        variant={selectedComment === comment.id ? "default" : "ghost"} 
                        size="sm" 
                        className="h-8"
                        onClick={() => handleReply(comment.id)}
                      >
                        <Reply className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                    </div>
                    
                    <div className="flex items-center">
                      {comment.replied && (
                        <Badge variant="outline" className="mr-2 text-green-500 bg-green-50">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Replied
                        </Badge>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewProfile(comment.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleFlag(comment.id)}>
                            <Flag className="h-4 w-4 mr-2" />
                            Flag Comment
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive" 
                            onClick={() => handleDelete(comment.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  {selectedComment === comment.id && (
                    <div className="mt-3 flex gap-2">
                      <Input 
                        placeholder="Type your reply..." 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={sendReply}>Send</Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <h3 className="font-medium">No comments found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search term</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentsSection;
