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
  Save,
  FileText,
  Image,
  Video,
  LayoutGrid,
  Upload,
  X,
  Check as CheckCircle,
  Search,
  Folder as Layers,
  FileImage
} from 'lucide-react';
import { format, addMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ScheduledPost {
  id: string;
  title: string;
  content_type: "image" | "video" | "carousel" | "text";
  platform: string;
  scheduled_date: Date;
  status: 'scheduled' | 'published' | 'failed';
  campaign?: string;
}

interface ScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduleComplete: () => void;
  initialDate?: Date;
  selectedContent?: any;
  contentSource?: 'library' | 'template';
  editPost?: ScheduledPost | null;
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
  initialDate,
  selectedContent,
  contentSource,
  editPost
}) => {
  const [scheduleType, setScheduleType] = useState<'one-time' | 'recurring' | 'smart'>('one-time');
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [date, setDate] = useState<Date | undefined>(initialDate || new Date());
  const [time, setTime] = useState('12:00');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [campaign, setCampaign] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState('weekly');
  const [recurrenceDays, setRecurrenceDays] = useState<string[]>([]);
  const [contentStep, setContentStep] = useState<'select-source' | 'select-content' | 'schedule'>('schedule');
  const [contentSourceType, setContentSourceType] = useState<'library' | 'template' | 'new'>(contentSource || 'new');
  const [libraryContent, setLibraryContent] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [selectedLibraryItem, setSelectedLibraryItem] = useState<any>(contentSource === 'library' ? selectedContent : null);
  const [selectedTemplateItem, setSelectedTemplateItem] = useState<any>(contentSource === 'template' ? selectedContent : null);
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [contentType, setContentType] = useState<'image' | 'video' | 'carousel' | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
      setFilePreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };
  
  const clearFile = () => {
    setFiles(null);
    setFilePreviewUrl(null);
  };

  const { toast } = useToast();
  
  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
    
    if (open) {
      if (editPost) {
        setTitle(editPost.title || '');
        setDescription('');
        setPlatforms([editPost.platform]);
        
        const scheduledDate = new Date(editPost.scheduled_date);
        setDate(scheduledDate);
        
        const hours = scheduledDate.getHours().toString().padStart(2, '0');
        const minutes = scheduledDate.getMinutes().toString().padStart(2, '0');
        setTime(`${hours}:${minutes}`);
        
        setCampaign(editPost.campaign || '');
        setContentStep('schedule');
        setContentSourceType('new');
      } else if (selectedContent) {
        setTitle(selectedContent.title || '');
        setDescription(selectedContent.description || '');
        
        if (contentSource === 'library') {
          setSelectedLibraryItem(selectedContent);
          setContentSourceType('library');
        } else if (contentSource === 'template') {
          setSelectedTemplateItem(selectedContent);
          setContentSourceType('template');
        }
        
        setContentStep('schedule');
      } else {
        setContentStep('select-source');
      }
      
      if (contentSourceType !== 'new' && contentStep === 'select-content') {
        fetchContent();
      }
    }
  }, [initialDate, open, selectedContent, contentSource, editPost]);
  
  const fetchContent = async () => {
    setIsLoadingContent(true);
    
    try {
      if (contentSourceType === 'library') {
        const { data, error } = await supabase
          .from('content_library')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setLibraryContent(data || []);
      } 
      else if (contentSourceType === 'template') {
        const { data, error } = await supabase
          .from('content_templates')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setTemplates(data || []);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching content",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoadingContent(false);
    }
  };
  
  const resetForm = () => {
    setScheduleType('one-time');
    setPlatforms([]);
    setDate(new Date());
    setTime('12:00');
    setTitle('');
    setDescription('');
    setCampaign('');
    setRecurrenceType('weekly');
    setRecurrenceDays([]);
    setContentSourceType('new');
    setSelectedLibraryItem(null);
    setSelectedTemplateItem(null);
    setContentStep('select-source');
  };

  const handleClose = () => {
    if (!isSaving) {
      resetForm();
      onOpenChange(false);
    }
  };

  const validateForm = () => {
    if (platforms.length === 0) {
      toast({
        title: "Platform required",
        description: "Please select at least one platform for your post.",
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
      
      const scheduledDateTime = new Date(date!);
      const [hours, minutes] = time.split(':').map(Number);
      scheduledDateTime.setHours(hours, minutes);
      
      let contentDetails = {};
      
      if (contentSourceType === 'library' && selectedLibraryItem) {
        contentDetails = {
          content_id: selectedLibraryItem.id,
          content_type: selectedLibraryItem.content_type,
          file_path: selectedLibraryItem.file_path,
        };
      } else if (contentSourceType === 'template' && selectedTemplateItem) {
        contentDetails = {
          template_id: selectedTemplateItem.id,
          content_type: selectedTemplateItem.content_type,
          content: selectedTemplateItem.content,
        };
      } else if (contentType) {
        contentDetails = {
          content_type: contentType,
          file_path: URL.createObjectURL(files![0]),
        };
      }
      
      for (const platform of platforms) {
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
          ...contentDetails
        };
        
        console.log("Scheduling post for platform:", platform, postData);
      }
      
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

  const handlePlatformToggle = (platform: string) => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter(p => p !== platform));
    } else {
      setPlatforms([...platforms, platform]);
    }
  };

  const handleSelectContent = (item: any, source: 'library' | 'template') => {
    if (source === 'library') {
      setSelectedLibraryItem(item);
      setSelectedTemplateItem(null);
    } else {
      setSelectedTemplateItem(item);
      setSelectedLibraryItem(null);
    }
    
    setTitle(item.title || '');
    setDescription(item.description || '');
    setContentStep('schedule');
  };

  const handleNextStep = async () => {
    if (contentStep === 'select-source') {
      if (contentSourceType === 'new') {
        setContentStep('schedule');
      } else {
        setContentStep('select-content');
        await fetchContent();
      }
    }
  };

  const filteredLibraryContent = libraryContent.filter(item => 
    !searchTerm || 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredTemplates = templates.filter(item => 
    !searchTerm || 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const renderContentSelection = () => {
    if (contentStep === 'select-source') {
      return (
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Label>Choose content source</Label>
            <div className="grid grid-cols-3 gap-4">
              <Card 
                className={cn("cursor-pointer", contentSourceType === 'new' && "border-primary")}
                onClick={() => setContentSourceType('new')}
              >
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <FileText className="h-10 w-10 mb-2 text-muted-foreground" />
                  <span className="font-medium">New Content</span>
                </CardContent>
              </Card>
              
              <Card 
                className={cn("cursor-pointer", contentSourceType === 'library' && "border-primary")}
                onClick={() => setContentSourceType('library')}
              >
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <Layers className="h-10 w-10 mb-2 text-muted-foreground" />
                  <span className="font-medium">From Library</span>
                </CardContent>
              </Card>
              
              <Card 
                className={cn("cursor-pointer", contentSourceType === 'template' && "border-primary")}
                onClick={() => setContentSourceType('template')}
              >
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <FileImage className="h-10 w-10 mb-2 text-muted-foreground" />
                  <span className="font-medium">From Templates</span>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleNextStep}>
              Continue
            </Button>
          </div>
        </div>
      );
    }
    
    if (contentStep === 'select-content') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>{contentSourceType === 'library' ? 'Select content from library' : 'Select content template'}</Label>
            <Button variant="outline" size="sm" onClick={() => setContentStep('select-source')}>
              Back
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <ScrollArea className="h-[300px]">
            {isLoadingContent ? (
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((index) => (
                  <Card key={index} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : contentSourceType === 'library' ? (
              filteredLibraryContent.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No content found in library
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {filteredLibraryContent.map(item => (
                    <Card 
                      key={item.id} 
                      className={cn(
                        "cursor-pointer hover:border-primary transition-colors",
                        selectedLibraryItem?.id === item.id && "border-primary bg-primary/10"
                      )}
                      onClick={() => handleSelectContent(item, 'library')}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium line-clamp-1">{item.title}</h4>
                            {item.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                            )}
                            <span className="text-xs mt-2 inline-block capitalize">{item.content_type}</span>
                          </div>
                          {selectedLibraryItem?.id === item.id && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            ) : (
              filteredTemplates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No templates found
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {filteredTemplates.map(item => (
                    <Card 
                      key={item.id} 
                      className={cn(
                        "cursor-pointer hover:border-primary transition-colors",
                        selectedTemplateItem?.id === item.id && "border-primary bg-primary/10"
                      )}
                      onClick={() => handleSelectContent(item, 'template')}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium line-clamp-1">{item.title}</h4>
                            {item.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                            )}
                            <span className="text-xs mt-2 inline-block capitalize">{item.content_type} Template</span>
                          </div>
                          {selectedTemplateItem?.id === item.id && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )
            )}
          </ScrollArea>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setContentStep('select-source')}>
              Back
            </Button>
            <Button 
              onClick={() => setContentStep('schedule')}
              disabled={(contentSourceType === 'library' && !selectedLibraryItem) || 
                        (contentSourceType === 'template' && !selectedTemplateItem)}
            >
              Continue
            </Button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const renderFileUpload = () => {
    if (!contentType) return null;

    return (
      <div className="border-2 border-dashed rounded-lg p-8 text-center mt-4">
        {files && files.length > 0 ? (
          <div className="relative">
            {contentType === 'video' ? (
              <video
                src={filePreviewUrl || ''}
                controls
                className="max-h-[200px] w-full mx-auto rounded-lg"
              />
            ) : contentType === 'carousel' ? (
              <div className="grid grid-cols-2 gap-2">
                {Array.from(files).map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-full object-cover rounded"
                  />
                ))}
              </div>
            ) : (
              <img
                src={filePreviewUrl || ''}
                alt="Preview"
                className="max-h-[200px] mx-auto rounded-lg object-contain"
              />
            )}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 rounded-full"
              onClick={clearFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="py-4">
            {contentType === 'video' ? (
              <Video className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            ) : contentType === 'carousel' ? (
              <LayoutGrid className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            ) : (
              <Image className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            )}
            <Label
              htmlFor="content-upload"
              className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
            >
              Click to upload {contentType === 'carousel' ? 'images' : contentType}
            </Label>
            <Input
              id="content-upload"
              type="file"
              accept={contentType === 'video' ? "video/*" : "image/*"}
              multiple={contentType === 'carousel'}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Content</DialogTitle>
        </DialogHeader>
        
        {contentStep === 'select-source' || contentStep === 'select-content' ? (
          renderContentSelection()
        ) : (
          <>
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
                  <Label htmlFor="platform">Platforms</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {platformOptions.map((platform) => (
                      <div key={platform} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`platform-${platform}`} 
                          checked={platforms.includes(platform)}
                          onCheckedChange={() => handlePlatformToggle(platform)}
                        />
                        <Label 
                          htmlFor={`platform-${platform}`}
                          className="cursor-pointer text-sm"
                        >
                          {platform}
                        </Label>
                      </div>
                    ))}
                  </div>
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
                
                {contentSourceType === 'new' && (
                  <div>
                    <Label htmlFor="content-type">Content Type</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <Card 
                        className={cn("cursor-pointer", contentType === 'image' && "border-primary")}
                        onClick={() => setContentType('image')}
                      >
                        <CardContent className="flex flex-col items-center justify-center py-4">
                          <Image className="h-8 w-8 mb-2 text-muted-foreground" />
                          <span className="text-sm font-medium">Image</span>
                        </CardContent>
                      </Card>
                      
                      <Card 
                        className={cn("cursor-pointer", contentType === 'video' && "border-primary")}
                        onClick={() => setContentType('video')}
                      >
                        <CardContent className="flex flex-col items-center justify-center py-4">
                          <Video className="h-8 w-8 mb-2 text-muted-foreground" />
                          <span className="text-sm font-medium">Video</span>
                        </CardContent>
                      </Card>
                      
                      <Card 
                        className={cn("cursor-pointer", contentType === 'carousel' && "border-primary")}
                        onClick={() => setContentType('carousel')}
                      >
                        <CardContent className="flex flex-col items-center justify-center py-4">
                          <LayoutGrid className="h-8 w-8 mb-2 text-muted-foreground" />
                          <span className="text-sm font-medium">Carousel</span>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {renderFileUpload()}
                  </div>
                )}
                
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
              {contentSourceType !== 'new' && (
                <Button variant="outline" onClick={() => setContentStep('select-content')} className="mr-auto">
                  Back to Content
                </Button>
              )}
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleModal;
