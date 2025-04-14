
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  List, 
  Clock, 
  Plus, 
  Filter,
  Grid,
  Columns,
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CalendarView from '@/components/schedule/CalendarView';
import QueueView from '@/components/schedule/QueueView';
import ListScheduleView from '@/components/schedule/ListScheduleView';
import ScheduleModal from '@/components/schedule/ScheduleModal';
import ScheduleFilters from '@/components/schedule/ScheduleFilters';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

interface ScheduledPost {
  id: string;
  title: string;
  content_type: "image" | "video" | "carousel" | "text";
  platform: string;
  scheduled_date: Date;
  status: 'scheduled' | 'published' | 'failed';
  campaign?: string;
}

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

const Schedule = () => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    platforms: ['all'],
    contentTypes: ['all'],
    campaigns: ['all'],
  });
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
  const { toast } = useToast();

  const demoUserId = '00000000-0000-0000-0000-000000000000';

  const { data: scheduledPosts, isLoading, refetch } = useQuery({
    queryKey: ['scheduledPosts', filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_library')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);
      
      if (error) {
        toast({
          title: "Error fetching scheduled posts",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      const transformedData = data?.map(item => ({
        ...item,
        scheduled_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        platform: ['Instagram', 'Twitter', 'Facebook', 'LinkedIn'][Math.floor(Math.random() * 4)],
        status: ['scheduled', 'published', 'failed'][Math.floor(Math.random() * 3)] as 'scheduled' | 'published' | 'failed',
        campaign: ['Summer Sale', 'Product Launch', 'Brand Awareness'][Math.floor(Math.random() * 3)]
      })) as ScheduledPost[] || [];
      
      return transformedData;
    }
  });

  const queueSlots: QueueSlot[] = [
    { 
      id: 'morning', 
      name: 'Morning', 
      time: '9:00 AM', 
      items: scheduledPosts?.filter(() => Math.random() > 0.7).map(post => ({
        ...post,
        status: post.status as 'scheduled' | 'published' | 'failed'
      })) || [] 
    },
    { 
      id: 'midday', 
      name: 'Midday', 
      time: '12:00 PM', 
      items: scheduledPosts?.filter(() => Math.random() > 0.7).map(post => ({
        ...post,
        status: post.status as 'scheduled' | 'published' | 'failed'
      })) || [] 
    },
    { 
      id: 'afternoon', 
      name: 'Afternoon', 
      time: '3:00 PM', 
      items: scheduledPosts?.filter(() => Math.random() > 0.7).map(post => ({
        ...post,
        status: post.status as 'scheduled' | 'published' | 'failed'
      })) || [] 
    },
    { 
      id: 'evening', 
      name: 'Evening', 
      time: '7:00 PM', 
      items: scheduledPosts?.filter(() => Math.random() > 0.7).map(post => ({
        ...post,
        status: post.status as 'scheduled' | 'published' | 'failed'
      })) || [] 
    },
  ];

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (calendarView === 'day') {
      setSelectedDate(direction === 'prev' ? subDays(selectedDate, 1) : addDays(selectedDate, 1));
    } else if (calendarView === 'week') {
      setSelectedDate(direction === 'prev' ? subDays(selectedDate, 7) : addDays(selectedDate, 7));
    } else {
      setSelectedDate(direction === 'prev' 
        ? new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
        : new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
    }
  };

  const getDateRangeText = () => {
    if (calendarView === 'day') {
      return format(selectedDate, 'MMMM d, yyyy');
    } else if (calendarView === 'week') {
      const start = startOfWeek(selectedDate);
      const end = endOfWeek(selectedDate);
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    } else {
      return format(selectedDate, 'MMMM yyyy');
    }
  };

  const handleScheduleComplete = () => {
    setIsScheduleModalOpen(false);
    setEditingPost(null);
    refetch();
    toast({
      title: "Content scheduled",
      description: "Your content has been scheduled successfully.",
    });
  };

  const applyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
  };

  const handleEditPost = (post: ScheduledPost) => {
    setEditingPost(post);
    setIsScheduleModalOpen(true);
  };

  const handleReschedulePost = (post: ScheduledPost) => {
    setEditingPost(post);
    setIsScheduleModalOpen(true);
  };

  const handleClonePost = (post: ScheduledPost) => {
    // Create a new post based on the original, but with a new ID
    const clonedPost = {
      ...post,
      id: crypto.randomUUID(),
      title: `${post.title} (Copy)`,
    };
    
    // In a real app, you would save this to your database
    toast({
      title: "Post cloned",
      description: "A copy of the post has been created successfully.",
    });
    
    setTimeout(() => refetch(), 500);
  };

  const handleDeletePost = (postId: string) => {
    // In a real app, you would delete this from your database
    toast({
      title: "Post deleted",
      description: "The scheduled post has been deleted successfully.",
    });
    
    setTimeout(() => refetch(), 500);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Content Schedule</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="icon"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(isFilterOpen && "bg-accent")}
          >
            <Filter size={16} />
          </Button>
          <Button 
            onClick={() => {
              setEditingPost(null);
              setIsScheduleModalOpen(true);
            }}
            className="gap-2"
          >
            <Plus size={16} />
            Schedule Content
          </Button>
        </div>
      </div>
      
      {isFilterOpen && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <ScheduleFilters 
              filters={filters}
              onApplyFilters={applyFilters}
              onClose={() => setIsFilterOpen(false)}
            />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <TabsList className="grid grid-cols-3 w-full sm:w-auto">
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon size={16} />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="queue" className="flex items-center gap-2">
              <Clock size={16} />
              Queue
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List size={16} />
              List
            </TabsTrigger>
          </TabsList>

          {activeTab === 'calendar' && (
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateDate('prev')}
                className="px-2"
              >
                <ChevronLeft size={16} />
              </Button>
              <div className="text-sm font-medium min-w-[120px] text-center">
                {getDateRangeText()}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigateDate('next')}
                className="px-2"
              >
                <ChevronRight size={16} />
              </Button>
              <Separator orientation="vertical" className="h-8 mx-2 hidden sm:block" />
              <div className="hidden sm:flex rounded-md border">
                <Button 
                  variant={calendarView === 'month' ? "default" : "ghost"} 
                  size="sm" 
                  onClick={() => setCalendarView('month')}
                  className="rounded-r-none"
                >
                  <Grid size={16} />
                </Button>
                <Button 
                  variant={calendarView === 'week' ? "default" : "ghost"} 
                  size="sm" 
                  onClick={() => setCalendarView('week')}
                  className="rounded-none"
                >
                  <Columns size={16} />
                </Button>
                <Button 
                  variant={calendarView === 'day' ? "default" : "ghost"} 
                  size="sm" 
                  onClick={() => setCalendarView('day')}
                  className="rounded-l-none"
                >
                  <CalendarIcon size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <TabsContent value="calendar">
          <CalendarView 
            posts={scheduledPosts || []} 
            isLoading={isLoading}
            view={calendarView}
            selectedDate={selectedDate}
            onDateSelect={handleDateChange}
            onSchedulePost={() => {
              setEditingPost(null);
              setIsScheduleModalOpen(true);
            }}
          />
        </TabsContent>
        
        <TabsContent value="queue">
          <QueueView 
            queueSlots={queueSlots} 
            isLoading={isLoading}
            onSchedulePost={() => {
              setEditingPost(null);
              setIsScheduleModalOpen(true);
            }}
          />
        </TabsContent>
        
        <TabsContent value="list">
          <ListScheduleView 
            posts={scheduledPosts || []} 
            isLoading={isLoading}
            onSchedulePost={() => {
              setEditingPost(null);
              setIsScheduleModalOpen(true);
            }}
            onEditPost={handleEditPost}
            onReschedulePost={handleReschedulePost}
            onClonePost={handleClonePost}
            onDeletePost={handleDeletePost}
          />
        </TabsContent>
      </Tabs>

      <ScheduleModal 
        open={isScheduleModalOpen} 
        onOpenChange={setIsScheduleModalOpen}
        onScheduleComplete={handleScheduleComplete}
        initialDate={selectedDate}
        editPost={editingPost}
      />
    </div>
  );
};

export default Schedule;
