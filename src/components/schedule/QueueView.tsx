
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Clock, GripVertical, Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface QueueItem {
  id: string;
  title: string;
  content_type: string;
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
}

const platformColors: Record<string, string> = {
  Instagram: 'bg-pink-500',
  Twitter: 'bg-blue-400',
  Facebook: 'bg-blue-600',
  LinkedIn: 'bg-blue-800',
  TikTok: 'bg-black',
  YouTube: 'bg-red-600',
  Pinterest: 'bg-red-500',
};

const QueueItem = ({ item }: { item: QueueItem }) => (
  <div className="flex items-center space-x-2 p-3 border rounded-md bg-card hover:bg-accent/50 transition-colors group mb-3">
    <div className="cursor-move opacity-30 group-hover:opacity-100">
      <GripVertical size={16} />
    </div>
    <div className={cn(
      "w-1.5 h-10 rounded-full flex-shrink-0",
      platformColors[item.platform] || "bg-gray-500"
    )} />
    <div className="flex-grow min-w-0">
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-medium text-sm truncate">{item.title}</h4>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {item.platform}
          </Badge>
          <span>{format(new Date(item.scheduled_date), 'MMM d')}</span>
        </div>
      </div>
    </div>
  </div>
);

const EmptyQueueSlot = ({ onSchedulePost }: { onSchedulePost: () => void }) => (
  <div className="h-24 border-2 border-dashed rounded-md flex items-center justify-center">
    <Button variant="ghost" onClick={onSchedulePost} className="text-muted-foreground">
      <Plus size={16} className="mr-2" />
      Add content
    </Button>
  </div>
);

const LoadingSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-2">
    {Array.from({ length: 4 }).map((_, i) => (
      <Card key={i}>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-24 mb-1" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full mb-2" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const QueueView: React.FC<QueueViewProps> = ({ queueSlots, isLoading, onSchedulePost }) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-medium flex items-center">
              <Clock size={18} className="mr-2" />
              Queue Settings
            </h3>
            <p className="text-sm text-muted-foreground">
              Configure your posting schedule based on optimal engagement times
            </p>
          </div>
          <div>
            <Button variant="outline" className="mr-2">
              <Calendar size={16} className="mr-2" />
              Import Times
            </Button>
            <Button>
              <Plus size={16} className="mr-2" />
              New Time Slot
            </Button>
          </div>
        </div>
        
        <div className="bg-muted/50 p-4 rounded-md flex items-center space-x-3 mb-4">
          <AlertCircle size={20} className="text-amber-500" />
          <p className="text-sm">
            Schedule times are optimized based on your audience engagement patterns. You can modify these or add custom times.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {queueSlots.map((slot) => (
          <Card key={slot.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-md">{slot.name}</CardTitle>
              <CardDescription>{slot.time}</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-60 pr-4">
                {slot.items.length > 0 ? (
                  slot.items.map((item) => (
                    <QueueItem key={item.id} item={item} />
                  ))
                ) : (
                  <EmptyQueueSlot onSchedulePost={onSchedulePost} />
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QueueView;
