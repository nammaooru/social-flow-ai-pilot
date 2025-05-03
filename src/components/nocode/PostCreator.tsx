
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Calendar, 
  CalendarIcon,
  Clock, 
  ImagePlus, 
  Video, 
  Layout, 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Sparkles, 
  Save,
  Check,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

const socialPlatforms = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
];

const contentTypes = [
  { id: 'image', name: 'Image', icon: ImagePlus },
  { id: 'video', name: 'Video', icon: Video },
  { id: 'carousel', name: 'Carousel', icon: Layout },
  { id: 'text', name: 'Text Only', icon: FileText },
];

const PostCreator = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [contentType, setContentType] = useState<string>('image');
  const [caption, setCaption] = useState<string>('');
  const [scheduling, setScheduling] = useState<'now' | 'queue' | 'schedule'>('now');
  const [date, setDate] = useState<Date>();
  const { toast } = useToast();

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleContentTypeSelect = (type: string) => {
    setContentType(type);
  };

  const handleGenerateCaption = () => {
    // This would connect to an AI service in a real implementation
    setTimeout(() => {
      setCaption("✨ Exciting news! We've just launched our new collection. Check out these amazing designs that will transform your space. #NewCollection #InteriorDesign #HomeDecor");
      
      toast({
        title: "Caption generated",
        description: "AI-powered caption has been created for your post.",
      });
    }, 1000);
  };

  const handleSavePost = () => {
    toast({
      title: "Post saved",
      description: "Your post has been saved successfully.",
    });
  };

  const handlePublishPost = () => {
    toast({
      title: "Post scheduled",
      description: scheduling === 'now' 
        ? "Your post has been published successfully." 
        : "Your post has been scheduled successfully.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Post</CardTitle>
            <CardDescription>
              Design your post and schedule it for publication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Select Content Type</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {contentTypes.map((type) => (
                      <button 
                        key={type.id}
                        className={cn(
                          "flex flex-col items-center p-4 border rounded-md transition-colors",
                          contentType === type.id 
                            ? "bg-primary/10 border-primary/30" 
                            : "hover:bg-accent"
                        )}
                        onClick={() => handleContentTypeSelect(type.id)}
                      >
                        <type.icon className="h-6 w-6 mb-2" />
                        <span className="text-sm">{type.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-3">Upload Media</h3>
                  <div 
                    className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-accent/50"
                  >
                    <div className="mx-auto flex flex-col items-center">
                      {contentType === 'image' && <ImagePlus className="h-8 w-8 mb-3 text-muted-foreground" />}
                      {contentType === 'video' && <Video className="h-8 w-8 mb-3 text-muted-foreground" />}
                      {contentType === 'carousel' && <Layout className="h-8 w-8 mb-3 text-muted-foreground" />}
                      {contentType === 'text' && <FileText className="h-8 w-8 mb-3 text-muted-foreground" />}
                      
                      <p className="text-sm font-medium mb-1">
                        {contentType === 'text' ? 'Text-only post' : 'Drag and drop or click to upload'}
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">
                        {contentType === 'image' && 'Supports: JPG, PNG, WebP • Max 10MB'}
                        {contentType === 'video' && 'Supports: MP4, MOV • Max 100MB'}
                        {contentType === 'carousel' && 'Upload up to 10 images • Max 10MB each'}
                        {contentType === 'text' && 'No media will be attached to this post'}
                      </p>
                      
                      {contentType !== 'text' && (
                        <Button size="sm" variant="secondary">
                          Select File
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="caption">Caption</Label>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="gap-1"
                      onClick={handleGenerateCaption}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span className="text-xs">Generate with AI</span>
                    </Button>
                  </div>
                  <Textarea 
                    id="caption"
                    placeholder="Write a caption for your post..."
                    rows={5}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="mb-1"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{caption.length} characters</span>
                    <span>Recommended: 70-100 characters</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="schedule" className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Publication Options</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      className={cn(
                        "flex items-center p-4 border rounded-md transition-colors",
                        scheduling === 'now' ? "bg-primary/10 border-primary/30" : "hover:bg-accent"
                      )}
                      onClick={() => setScheduling('now')}
                    >
                      <Check className="h-5 w-5 mr-2" />
                      <div className="text-left">
                        <p className="text-sm font-medium">Publish Now</p>
                        <p className="text-xs text-muted-foreground">Post immediately</p>
                      </div>
                    </button>
                    <button
                      className={cn(
                        "flex items-center p-4 border rounded-md transition-colors",
                        scheduling === 'queue' ? "bg-primary/10 border-primary/30" : "hover:bg-accent"
                      )}
                      onClick={() => setScheduling('queue')}
                    >
                      <Clock className="h-5 w-5 mr-2" />
                      <div className="text-left">
                        <p className="text-sm font-medium">Add to Queue</p>
                        <p className="text-xs text-muted-foreground">Use optimal times</p>
                      </div>
                    </button>
                    <button
                      className={cn(
                        "flex items-center p-4 border rounded-md transition-colors",
                        scheduling === 'schedule' ? "bg-primary/10 border-primary/30" : "hover:bg-accent"
                      )}
                      onClick={() => setScheduling('schedule')}
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      <div className="text-left">
                        <p className="text-sm font-medium">Schedule</p>
                        <p className="text-xs text-muted-foreground">Pick date & time</p>
                      </div>
                    </button>
                  </div>
                </div>

                {scheduling === 'schedule' && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-3">Select Date & Time</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }).map((_, hour) => (
                              <React.Fragment key={hour}>
                                <SelectItem value={`${hour + 9}:00`}>
                                  {hour + 9}:00 {hour + 9 >= 12 ? "PM" : "AM"}
                                </SelectItem>
                                <SelectItem value={`${hour + 9}:30`}>
                                  {hour + 9}:30 {hour + 9 >= 12 ? "PM" : "AM"}
                                </SelectItem>
                              </React.Fragment>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {scheduling === 'queue' && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-3">Queue Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="queue-slot">Queue Slot</Label>
                        <Select defaultValue="next">
                          <SelectTrigger id="queue-slot">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="next">Next available slot</SelectItem>
                            <SelectItem value="morning">Morning (9:00 AM)</SelectItem>
                            <SelectItem value="midday">Midday (12:00 PM)</SelectItem>
                            <SelectItem value="afternoon">Afternoon (3:00 PM)</SelectItem>
                            <SelectItem value="evening">Evening (7:00 PM)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="optimize" />
                        <Label htmlFor="optimize">
                          Optimize posting time based on audience activity
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Post Settings</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="promotion">Promotion</SelectItem>
                          <SelectItem value="announcement">Announcement</SelectItem>
                          <SelectItem value="education">Educational</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="campaign">Campaign (optional)</Label>
                      <Select>
                        <SelectTrigger id="campaign">
                          <SelectValue placeholder="Select campaign" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="summer">Summer Sale</SelectItem>
                          <SelectItem value="fall">Fall Collection</SelectItem>
                          <SelectItem value="holiday">Holiday Special</SelectItem>
                          <SelectItem value="launch">Product Launch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input 
                        id="tags"
                        placeholder="e.g., product, feature, launch"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Advanced Options</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="comments" className="cursor-pointer">Enable comments</Label>
                          <Switch id="comments" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="likes" className="cursor-pointer">Show like count</Label>
                          <Switch id="likes" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="alt" className="cursor-pointer">Generate alt text with AI</Label>
                          <Switch id="alt" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="first" className="cursor-pointer">Pin as first comment</Label>
                          <Switch id="first" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Preview and actions panel */}
      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Post Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Publishing To</h3>
              <div className="flex flex-wrap gap-2">
                {socialPlatforms.map(platform => (
                  <button 
                    key={platform.id}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3 py-1 border transition-colors",
                      selectedPlatforms.includes(platform.id) 
                        ? `bg-primary/10 border-primary/30 ${platform.color}` 
                        : "text-muted-foreground hover:bg-accent"
                    )}
                    onClick={() => handlePlatformToggle(platform.id)}
                  >
                    <platform.icon className="h-4 w-4" />
                    <span className="text-xs font-medium">{platform.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-accent/40 border rounded-md p-4 mb-6">
              <div className="flex items-start space-x-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <ImagePlus className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-sm">Your Account Name</p>
                  <p className="text-xs text-muted-foreground">
                    {scheduling === 'now' ? 'Publishing now' : 
                     scheduling === 'queue' ? 'Added to queue' :
                     date ? `Scheduled for ${format(date, "MMM d, yyyy")}` : 'Scheduled'}
                  </p>
                </div>
              </div>
              
              {contentType !== 'text' && (
                <div className="bg-muted mb-3 aspect-square rounded-md flex items-center justify-center">
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              
              <p className="text-sm mb-2">
                {caption || "Your caption will appear here..."}
              </p>
              
              <div className="flex flex-wrap gap-1.5">
                {(caption.match(/#\w+/g) || []).map((hashtag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs font-normal">
                    {hashtag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleSavePost} 
                variant="outline"
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save as Draft
              </Button>
              
              <Button 
                onClick={handlePublishPost}
                className="gap-2"
              >
                {scheduling === 'now' ? (
                  <>
                    <Check className="h-4 w-4" />
                    Publish Now
                  </>
                ) : scheduling === 'queue' ? (
                  <>
                    <Clock className="h-4 w-4" />
                    Add to Queue
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4" />
                    Schedule Post
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostCreator;
