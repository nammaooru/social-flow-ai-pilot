
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Clock, 
  Plus, 
  Settings, 
  AlertCircle, 
  MoreVertical,
  Copy,
  Trash,
  Pencil,
  Calendar
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import QueueSettingsModal from './QueueSettingsModal';
import { useToast } from '@/hooks/use-toast';

interface QueueItem {
  id: string;
  title: string;
  content_type: "image" | "video" | "carousel" | "text";
  platform: string;
  scheduled_date: Date;
  status: 'scheduled' | 'published' | 'failed';
  campaign?: string;
}

interface QueueSlot {
  id: string;
  name: string;
  time: string;
  items: QueueItem[];
}

interface QueueViewProps {
  queueSlots: QueueSlot[];
  isLoading: boolean;
  onSchedulePost: () => void;
  onEditPost?: (post: QueueItem) => void;
  onDeletePost?: (postId: string) => void;
  onClonePost?: (post: QueueItem) => void;
  onReschedulePost?: (post: QueueItem) => void;
}

const QueueView: React.FC<QueueViewProps> = ({ 
  queueSlots, 
  isLoading, 
  onSchedulePost,
  onEditPost,
  onDeletePost,
  onClonePost,
  onReschedulePost
}) => {
  const [slots, setSlots] = useState<QueueSlot[]>(queueSlots);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'image': return '📷';
      case 'video': return '🎬';
      case 'carousel': return '📱';
      case 'text': return '📝';
      default: return '📄';
    }
  };

  const handleSaveQueueSettings = (newSlots: QueueSlot[]) => {
    // In a real app, this would save to the database
    setSlots(newSlots);
    toast({
      title: "Queue settings updated",
      description: "Your queue time slots have been updated successfully."
    });
  };

  const handleEditPost = (post: QueueItem) => {
    if (onEditPost) {
      onEditPost(post);
    }
  };

  const handleReschedulePost = (post: QueueItem) => {
    if (onReschedulePost) {
      onReschedulePost(post);
    } else {
      toast({
        title: "Reschedule post",
        description: "This action would open the reschedule dialog in a real app."
      });
    }
  };

  const handleClonePost = (post: QueueItem) => {
    if (onClonePost) {
      onClonePost(post);
    } else {
      toast({
        title: "Clone post",
        description: "This action would create a copy of the post in a real app."
      });
    }
  };

  const handleDeletePost = (postId: string) => {
    if (onDeletePost) {
      onDeletePost(postId);
    } else {
      // Remove post from local state
      setSlots(slots.map(slot => ({
        ...slot,
        items: slot.items.filter(item => item.id !== postId)
      })));
      
      toast({
        title: "Post deleted",
        description: "The post has been removed from the queue."
      });
    }
  };

  const renderEmptySlot = (slotName: string) => (
    <div className="flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-md p-4">
      <p className="text-muted-foreground mb-2 text-sm">No content scheduled</p>
      <Button size="sm" variant="outline" onClick={onSchedulePost} className="gap-1">
        <Plus className="h-3 w-3" />
        Add Content
      </Button>
    </div>
  );

  const renderQueueItem = (item: QueueItem) => (
    <div key={item.id} className="border rounded-md p-3 mb-3 hover:bg-accent/10 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span>{getTypeIcon(item.content_type)}</span>
          <div>
            <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
            <p className="text-xs text-muted-foreground">{item.platform}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEditPost(item)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleReschedulePost(item)}>
              <Calendar className="h-4 w-4 mr-2" />
              Reschedule
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleClonePost(item)}>
              <Copy className="h-4 w-4 mr-2" />
              Clone
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleDeletePost(item.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex justify-between items-center">
        {item.campaign && (
          <span className="text-xs text-muted-foreground">{item.campaign}</span>
        )}
        <Badge variant="outline" className={cn("text-xs ml-auto", getStatusColor(item.status))}>
          {item.status}
        </Badge>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-16" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Content Queue
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsSettingsOpen(true)}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Queue Settings
          </Button>
          <Button 
            onClick={onSchedulePost}
            size="sm" 
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add to Queue
          </Button>
        </div>
      </div>

      {slots.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border rounded-lg">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No time slots configured</h3>
          <p className="text-muted-foreground text-center mb-4 max-w-md">
            Configure your preferred posting times to create a content queue.
          </p>
          <Button 
            onClick={() => setIsSettingsOpen(true)}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Configure Queue
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {slots.map((slot) => (
            <Card key={slot.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex justify-between items-center">
                  {slot.name}
                  <span className="text-sm font-normal text-muted-foreground">{slot.time}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[280px] pr-4">
                  {slot.items.length === 0 ? (
                    renderEmptySlot(slot.name)
                  ) : (
                    <div className="space-y-3">
                      {slot.items.map(renderQueueItem)}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full gap-1"
                        onClick={onSchedulePost}
                      >
                        <Plus className="h-3 w-3" />
                        Add More
                      </Button>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <QueueSettingsModal 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen}
        onSaveComplete={handleSaveQueueSettings}
        currentSlots={slots}
      />
    </>
  );
};

export default QueueView;
