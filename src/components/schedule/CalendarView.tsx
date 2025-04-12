
import React from 'react';
import { format, parseISO, isToday, isSameMonth, isSameDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { CalendarPlus } from 'lucide-react';

interface ScheduledPost {
  id: string;
  title: string;
  content_type: string;
  platform: string;
  scheduled_date: Date;
  status: 'scheduled' | 'published' | 'failed';
  campaign?: string;
}

interface CalendarViewProps {
  posts: ScheduledPost[];
  isLoading: boolean;
  view: 'month' | 'week' | 'day';
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
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

const statusColors: Record<string, string> = {
  scheduled: 'bg-yellow-500',
  published: 'bg-green-500',
  failed: 'bg-red-500',
};

const CalendarDayView = ({ date, posts, onSchedulePost }: { date: Date, posts: ScheduledPost[], onSchedulePost: () => void }) => (
  <Card className="h-full">
    <CardHeader className="py-3">
      <CardTitle className="text-lg flex justify-between items-center">
        <span>{format(date, 'EEEE, MMMM d, yyyy')}</span>
        <Button size="sm" variant="ghost" onClick={onSchedulePost}>
          <CalendarPlus size={16} />
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="space-y-4">
          {posts.length > 0 ? (
            <div className="space-y-3">
              {posts.map((post) => (
                <PostItem key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <p>No posts scheduled for this day</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={onSchedulePost}
              >
                <CalendarPlus size={16} className="mr-2" />
                Schedule post
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </CardContent>
  </Card>
);

const CalendarWeekView = ({ date, posts, onSchedulePost }: { date: Date, posts: ScheduledPost[], onSchedulePost: () => void }) => {
  // Group posts by hour
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  return (
    <Card className="h-full">
      <CardHeader className="py-3">
        <CardTitle className="text-lg">Weekly Schedule</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-250px)]">
          <div className="grid grid-cols-8 divide-x divide-border border-t border-border">
            {/* Time column */}
            <div className="col-span-1">
              {hours.map((hour) => (
                <div key={hour} className="h-20 p-2 text-xs text-muted-foreground border-b border-border">
                  {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
                </div>
              ))}
            </div>
            
            {/* Days columns */}
            {Array.from({ length: 7 }).map((_, dayIndex) => {
              const currentDate = new Date(date);
              currentDate.setDate(currentDate.getDate() - currentDate.getDay() + dayIndex);
              
              const dayPosts = posts.filter(post => 
                isSameDay(new Date(post.scheduled_date), currentDate)
              );
              
              return (
                <div key={dayIndex} className="col-span-1">
                  <div className={cn(
                    "h-10 p-2 text-center font-medium sticky top-0 bg-background border-b border-border",
                    isToday(currentDate) && "bg-accent"
                  )}>
                    <div className="text-xs">{format(currentDate, 'EEE')}</div>
                    <div className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                      isToday(currentDate) && "bg-primary text-primary-foreground"
                    )}>
                      {format(currentDate, 'd')}
                    </div>
                  </div>
                  
                  {hours.map((hour) => {
                    const hourPosts = dayPosts.filter(post => {
                      const postDate = new Date(post.scheduled_date);
                      return postDate.getHours() === hour;
                    });
                    
                    return (
                      <div 
                        key={hour} 
                        className="h-20 p-1 border-b border-border relative"
                        onClick={() => onSchedulePost()}
                      >
                        {hourPosts.map((post) => (
                          <div 
                            key={post.id}
                            className={cn(
                              "text-xs p-1 mb-1 rounded truncate",
                              platformColors[post.platform] || "bg-gray-500",
                              "text-white"
                            )}
                            title={post.title}
                          >
                            {format(new Date(post.scheduled_date), 'h:mm a')} - {post.title.substring(0, 16)}
                            {post.title.length > 16 && '...'}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const CalendarMonthView = ({ 
  selectedDate, 
  posts, 
  onDateSelect 
}: { 
  selectedDate: Date; 
  posts: ScheduledPost[]; 
  onDateSelect: (date: Date) => void;
}) => {
  // Group posts by date for the badge counts
  const postsByDate: Record<string, ScheduledPost[]> = {};
  
  posts.forEach(post => {
    const dateStr = format(new Date(post.scheduled_date), 'yyyy-MM-dd');
    if (!postsByDate[dateStr]) {
      postsByDate[dateStr] = [];
    }
    postsByDate[dateStr].push(post);
  });
  
  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={(date) => date && onDateSelect(date)}
      className="p-3 pointer-events-auto bg-card rounded-md border shadow"
      modifiers={{
        booked: (date) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          return !!postsByDate[dateStr]?.length;
        }
      }}
      modifiersStyles={{
        booked: { fontWeight: 'bold' }
      }}
      components={{
        DayContent: (props) => {
          const dateStr = format(props.date, 'yyyy-MM-dd');
          const dayPosts = postsByDate[dateStr] || [];
          
          return (
            <div className="relative w-full h-full flex justify-center">
              <div 
                className={cn(
                  "flex items-center justify-center",
                  isToday(props.date) && "bg-primary text-primary-foreground rounded-full",
                  !isSameMonth(props.date, selectedDate) && "text-muted-foreground"
                )}
              >
                {props.date.getDate()}
              </div>
              
              {dayPosts.length > 0 && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                  {dayPosts.length <= 3 ? (
                    dayPosts.slice(0, 3).map((post, i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1 w-1 rounded-full",
                          platformColors[post.platform] || "bg-primary"
                        )}
                      />
                    ))
                  ) : (
                    <div className="text-xs text-muted-foreground">{dayPosts.length}</div>
                  )}
                </div>
              )}
            </div>
          );
        },
      }}
    />
  );
};

const PostItem = ({ post }: { post: ScheduledPost }) => (
  <div className="flex items-start space-x-3 p-3 border rounded-md hover:bg-accent/50 transition-colors">
    <div className={cn(
      "w-2 h-full min-h-[2rem] rounded-full flex-shrink-0",
      platformColors[post.platform] || "bg-gray-500"
    )} />
    <div className="flex-grow min-w-0">
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-medium text-sm truncate">{post.title}</h4>
        <Badge 
          variant="outline" 
          className={cn(
            "text-white text-xs",
            statusColors[post.status]
          )}
        >
          {post.status}
        </Badge>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {post.platform}
          </Badge>
          <span>{format(new Date(post.scheduled_date), 'h:mm a')}</span>
        </div>
        {post.campaign && (
          <Badge variant="outline" className="text-xs">
            {post.campaign}
          </Badge>
        )}
      </div>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-start space-x-3 p-3 border rounded-md">
        <Skeleton className="w-2 h-16 rounded-full" />
        <div className="flex-grow space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const CalendarView: React.FC<CalendarViewProps> = ({ 
  posts, 
  isLoading, 
  view, 
  selectedDate, 
  onDateSelect,
  onSchedulePost
}) => {
  // Filter posts for the selected date (for day view)
  const selectedDatePosts = posts.filter(post => 
    isSameDay(new Date(post.scheduled_date), selectedDate)
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="bg-card rounded-md border">
      {view === 'month' && (
        <div className="p-4">
          <CalendarMonthView 
            selectedDate={selectedDate} 
            posts={posts} 
            onDateSelect={onDateSelect} 
          />
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">
              Posts for {format(selectedDate, 'MMMM d, yyyy')}
            </h3>
            <ScrollArea className="h-[300px]">
              {selectedDatePosts.length > 0 ? (
                <div className="space-y-3">
                  {selectedDatePosts.map(post => (
                    <PostItem key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <p>No posts scheduled for this day</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={onSchedulePost}
                  >
                    <CalendarPlus size={16} className="mr-2" />
                    Schedule post
                  </Button>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      )}
      
      {view === 'week' && (
        <CalendarWeekView 
          date={selectedDate} 
          posts={posts} 
          onSchedulePost={onSchedulePost} 
        />
      )}
      
      {view === 'day' && (
        <CalendarDayView 
          date={selectedDate} 
          posts={selectedDatePosts} 
          onSchedulePost={onSchedulePost} 
        />
      )}
    </div>
  );
};

export default CalendarView;
