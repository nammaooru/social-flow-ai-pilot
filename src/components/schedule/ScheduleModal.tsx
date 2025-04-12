
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  RotateCw, 
  Sparkles, 
  Calendar as CalendarCheck,
  Globe,
  Save
} from 'lucide-react';
import { format, addMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduleComplete: () => void;
  initialDate?: Date;
}

const platformOptions = [
  'Instagram',
  'Facebook',
  'Twitter',
  'LinkedIn',
  'TikTok',
  'YouTube',
  'Pinterest'
];

const timeOptions = Array.from({ length: 24 * 4 }).map((_, i) => {
  const hour = Math.floor(i / 4);
  const minute = (i % 4) * 15;
  const ampm = hour < 12 ? 'AM' : 'PM';
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return {
    value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
    label: `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`
  };
});

const ScheduleModal: React.FC<ScheduleModalProps> = ({ 
  open, 
  onOpenChange, 
  onScheduleComplete,
  initialDate 
}) => {
  const [scheduleType, setScheduleType] = useState<'one-time' | 'recurring' | 'smart'>('one-time');
  const [platform, setPlatform] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(initialDate || new Date());
  const [time, setTime] = useState('12:00');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [campaign, setCampaign] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState('weekly');
  const [recurrenceDays, setRecurrenceDays] = useState<string[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
  }, [initialDate, open]);
  
  const resetForm = () => {
    setScheduleType('one-time');
    setPlatform('');
    setDate(new Date());
    setTime('12:00');
    setTitle('');
    setDescription('');
    setCampaign('');
    setRecurrenceType('weekly');
    setRecurrenceDays([]);
  };

  const handleClose = () => {
    if (!isSaving) {
      resetForm();
      onOpenChange(false);
    }
  };

  const validateForm = () => {
    if (!platform) {
      toast({
        title: "Platform required",
        description: "Please select a platform for your post.",
        variant: "destructive",
      });
      return false;
    }

    if (!date) {
      toast({
        title: "Date required",
        description: "Please select a date for your post.",
        variant: "destructive",
      });
      return false;
    }

    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your post.",
        variant: "destructive",
      });
      return false;
    }

    if (scheduleType === 'recurring' && recurrenceDays.length === 0) {
      toast({
        title: "Recurrence days required",
        description: "Please select at least one day for recurring posts.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    try {
      const temporaryUserId = '00000000-0000-0000-0000-000000000000';
      
      // Combine date and time
      const scheduledDateTime = new Date(date!);
      const [hours, minutes] = time.split(':').map(Number);
      scheduledDateTime.setHours(hours, minutes);
      
      const postData = {
        user_id: temporaryUserId,
        title,
        description: description || null,
        platform,
        campaign: campaign || null,
        schedule_type: scheduleType,
        scheduled_date: scheduledDateTime.toISOString(),
        recurrence_type: scheduleType === 'recurring' ? recurrenceType : null,
        recurrence_days: scheduleType === 'recurring' ? recurrenceDays : null,
      };
      
      // In a real app, this would insert into a scheduled_posts table
      // For this demo, we'll just simulate success
      
      setTimeout(() => {
        setIsSaving(false);
        resetForm();
        onScheduleComplete();
      }, 1000);
      
    } catch (error: any) {
      toast({
        title: "Error scheduling post",
        description: error.message,
        variant: "destructive",
      });
      setIsSaving(false);
    }
  };

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Content</DialogTitle>
        </DialogHeader>
        
        <Tabs value={scheduleType} onValueChange={(value) => setScheduleType(value as any)} className="mt-4">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="one-time" className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4" />
              One-Time
            </TabsTrigger>
            <TabsTrigger value="recurring" className="flex items-center gap-2">
              <RotateCw className="h-4 w-4" />
              Recurring
            </TabsTrigger>
            <TabsTrigger value="smart" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Smart Schedule
            </TabsTrigger>
          </TabsList>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={platform}
                onValueChange={setPlatform}
              >
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platformOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="title">Post Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Post Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter post description"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="campaign">Campaign (optional)</Label>
              <Input
                id="campaign"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                placeholder="e.g. Summer Sale, Product Launch"
              />
            </div>
            
            <TabsContent value="one-time" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="block mb-2">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal w-full",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={{ before: new Date() }}
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label htmlFor="time" className="block mb-2">Time</Label>
                  <Select
                    value={time}
                    onValueChange={setTime}
                  >
                    <SelectTrigger id="time" className="w-full">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="recurring" className="mt-4 space-y-4">
              <div>
                <Label htmlFor="recurrence-type" className="block mb-2">Recurrence Type</Label>
                <Select
                  value={recurrenceType}
                  onValueChange={setRecurrenceType}
                >
                  <SelectTrigger id="recurrence-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {recurrenceType === 'weekly' && (
                <div className="space-y-3">
                  <Label className="block">Repeat on days</Label>
                  <div className="flex flex-wrap gap-2">
                    {weekDays.map((day) => {
                      const isSelected = recurrenceDays.includes(day);
                      return (
                        <Button
                          key={day}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (isSelected) {
                              setRecurrenceDays(recurrenceDays.filter(d => d !== day));
                            } else {
                              setRecurrenceDays([...recurrenceDays, day]);
                            }
                          }}
                        >
                          {day.substring(0, 3)}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date" className="block mb-2">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="start-date"
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal w-full",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={{ before: new Date() }}
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label htmlFor="end-date" className="block mb-2">End Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="end-date"
                        variant={"outline"}
                        className="justify-start text-left font-normal w-full"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span>No end date</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        initialFocus
                        disabled={{ before: new Date() }}
                        defaultMonth={date}
                        fromDate={date}
                        toDate={addMonths(new Date(), 12)}
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div>
                <Label htmlFor="recurrence-time" className="block mb-2">Time</Label>
                <Select
                  value={time}
                  onValueChange={setTime}
                >
                  <SelectTrigger id="recurrence-time" className="w-full">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="smart" className="mt-4 space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium flex items-center mb-2">
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI-Powered Smart Scheduling
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our AI will analyze your audience engagement patterns and schedule your content at the optimal times.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Optimize for engagement</Label>
                      <div className="text-xs text-muted-foreground">
                        Schedule when your audience is most active
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Consider posting frequency</Label>
                      <div className="text-xs text-muted-foreground">
                        Avoids posting too frequently
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Platform-specific optimization</Label>
                      <div className="text-xs text-muted-foreground">
                        Uses best times for each platform
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smart-start-date" className="block mb-2">Earliest Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="smart-start-date"
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal w-full",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={{ before: new Date() }}
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label htmlFor="smart-time-preference" className="block mb-2">Time Preference</Label>
                  <Select
                    defaultValue="any"
                  >
                    <SelectTrigger id="smart-time-preference" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any time</SelectItem>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <div className="flex items-center space-x-2 mt-4">
              <Switch id="time-zone" defaultChecked />
              <div className="space-y-0.5">
                <Label htmlFor="time-zone" className="text-sm">
                  <div className="flex items-center">
                    <Globe className="mr-2 h-4 w-4" />
                    Use local time zone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
                  </div>
                </Label>
              </div>
            </div>
          </div>
        </Tabs>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <>
                <RotateCw className="h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {scheduleType === 'smart' ? 'Schedule with AI' : 'Schedule Post'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleModal;
