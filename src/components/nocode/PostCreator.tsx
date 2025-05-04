import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Check, Clock, Image, Pencil, Plus, Save, Trash, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface PostElement {
  id: string;
  type: 'text' | 'image' | 'video' | 'button' | 'poll';
  content: string;
  settings: Record<string, any>;
}

interface Post {
  id: string;
  name: string;
  platform: string;
  elements: PostElement[];
  scheduledFor: string | null;
  createdAt: Date;
  isDraft: boolean;
  settings?: Record<string, any>; // Add settings property to Post interface
}

const PostCreator = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('design');
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPost, setCurrentPost] = useState<Post>({
    id: crypto.randomUUID(),
    name: '',
    platform: 'instagram',
    elements: [
      {
        id: crypto.randomUUID(),
        type: 'text',
        content: 'Write your post content here...',
        settings: {}
      }
    ],
    scheduledFor: null,
    createdAt: new Date(),
    isDraft: true
  });
  const [manageTab, setManageTab] = useState('drafts');

  const platformOptions = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' }
  ];

  const elementTypes = [
    { value: 'text', label: 'Text Block', icon: <Pencil className="h-4 w-4" /> },
    { value: 'image', label: 'Image', icon: <Image className="h-4 w-4" /> },
    { value: 'button', label: 'Call to Action', icon: <Plus className="h-4 w-4" /> },
    { value: 'poll', label: 'Poll', icon: <Plus className="h-4 w-4" /> }
  ];

  const addElement = (type: 'text' | 'image' | 'video' | 'button' | 'poll') => {
    const newElement: PostElement = {
      id: crypto.randomUUID(),
      type,
      content: type === 'text' ? 'New text block' : '',
      settings: {}
    };

    setCurrentPost({
      ...currentPost,
      elements: [...currentPost.elements, newElement]
    });
  };

  const updateElementContent = (elementId: string, content: string) => {
    setCurrentPost({
      ...currentPost,
      elements: currentPost.elements.map(element => 
        element.id === elementId ? { ...element, content } : element
      )
    });
  };

  const removeElement = (elementId: string) => {
    setCurrentPost({
      ...currentPost,
      elements: currentPost.elements.filter(element => element.id !== elementId)
    });
  };

  const savePost = (isDraft: boolean = true) => {
    if (!currentPost.name) {
      toast({
        title: "Validation Error",
        description: "Please provide a name for your post",
        variant: "destructive"
      });
      return;
    }

    // Check if scheduling post but no date is selected
    if (!isDraft && !currentPost.scheduledFor) {
      toast({
        title: "Scheduling Error",
        description: "Please select a date and time to schedule your post",
        variant: "destructive"
      });
      return;
    }

    // Add or update post
    const existingIndex = posts.findIndex(p => p.id === currentPost.id);
    const updatedPost = { 
      ...currentPost, 
      isDraft,
      createdAt: existingIndex >= 0 ? currentPost.createdAt : new Date()
    };
    
    if (existingIndex >= 0) {
      const updatedPosts = [...posts];
      updatedPosts[existingIndex] = updatedPost;
      setPosts(updatedPosts);
    } else {
      setPosts([...posts, updatedPost]);
    }

    toast({
      title: isDraft ? "Draft Saved" : "Post Scheduled",
      description: isDraft 
        ? "Your post has been saved as a draft" 
        : `Your post has been scheduled for ${format(new Date(currentPost.scheduledFor!), 'PPpp')}`
    });

    // Reset for a new post
    setCurrentPost({
      id: crypto.randomUUID(),
      name: '',
      platform: 'instagram',
      elements: [
        {
          id: crypto.randomUUID(),
          type: 'text',
          content: 'Write your post content here...',
          settings: {}
        }
      ],
      scheduledFor: null,
      createdAt: new Date(),
      isDraft: true
    });
    
    // Switch to manage tab
    setActiveTab('manage');
    setManageTab(isDraft ? 'drafts' : 'scheduled');
  };

  const editPost = (post: Post) => {
    setCurrentPost(post);
    setActiveTab('design');
  };

  const deletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
    toast({
      title: "Post Deleted",
      description: "Your post has been deleted"
    });
  };

  const setScheduledTime = (dateTime: string) => {
    setCurrentPost({
      ...currentPost,
      scheduledFor: dateTime
    });
  };

  const useRecommendedTime = () => {
    // Simulate AI recommendation - use a time 24 hours from now
    const recommendedTime = new Date();
    recommendedTime.setDate(recommendedTime.getDate() + 1);
    recommendedTime.setHours(12, 0, 0, 0); // Set to noon
    
    setCurrentPost({
      ...currentPost,
      scheduledFor: recommendedTime.toISOString()
    });
    
    toast({
      title: "Recommended Time Set",
      description: `Post scheduled for ${format(recommendedTime, 'PPpp')}`
    });
  };

  const uploadImage = (elementId: string) => {
    // Simulate image upload
    setTimeout(() => {
      const mockImageUrl = "https://images.unsplash.com/photo-1473091534298-04dcbce3278c";
      
      setCurrentPost({
        ...currentPost,
        elements: currentPost.elements.map(element => 
          element.id === elementId 
            ? { 
                ...element, 
                settings: { ...element.settings, imageUrl: mockImageUrl }
              } 
            : element
        )
      });
      
      toast({
        title: "Image Uploaded",
        description: "Your image has been added to the post"
      });
    }, 1000);
  };

  const generateHashtags = () => {
    // Simulate hashtag generation
    const mockHashtags = "#SocialMedia #Marketing #ContentCreation #Engagement";
    
    // Add a new text element with the hashtags
    const newElement: PostElement = {
      id: crypto.randomUUID(),
      type: 'text',
      content: mockHashtags,
      settings: { isHashtags: true }
    };

    setCurrentPost({
      ...currentPost,
      elements: [...currentPost.elements, newElement]
    });
    
    toast({
      title: "Hashtags Generated",
      description: "Optimized hashtags have been added to your post"
    });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPpp');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/nocode">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-1">Post Creator</h1>
            <p className="text-muted-foreground">
              Design and schedule social media posts with drag-and-drop simplicity
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/nocode/documentation">
              View Documentation
            </Link>
          </Button>
          <Button onClick={() => savePost(true)}>
            <Save className="mr-2 h-4 w-4" /> Save Draft
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="design">Design Post</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="manage">Manage Posts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="design">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Post Details</CardTitle>
                  <CardDescription>Set up your post information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="post-name">Post Name</Label>
                    <Input 
                      id="post-name" 
                      value={currentPost.name}
                      onChange={(e) => setCurrentPost({...currentPost, name: e.target.value})}
                      placeholder="Enter a name for this post"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select 
                      value={currentPost.platform}
                      onValueChange={(value) => setCurrentPost({...currentPost, platform: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platformOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Elements</CardTitle>
                  <CardDescription>Add elements to your post</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {elementTypes.map(type => (
                    <Button 
                      key={type.value} 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => addElement(type.value as any)}
                    >
                      {type.icon}
                      <span className="ml-2">{type.label}</span>
                    </Button>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => generateHashtags()}>
                    Generate Optimized Hashtags
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Post Content</CardTitle>
                  <CardDescription>
                    Design your post by adding and editing elements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentPost.elements.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center">
                      <p className="text-muted-foreground">
                        Your post is empty. Add elements from the panel on the left to build your post.
                      </p>
                    </div>
                  ) : (
                    currentPost.elements.map((element, index) => (
                      <Card key={element.id} className="border border-dashed">
                        <CardHeader className="py-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">{
                              element.settings?.isHashtags ? 'HASHTAGS' : element.type.toUpperCase()
                            }</CardTitle>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => removeElement(element.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {element.type === 'text' ? (
                            <Textarea
                              value={element.content}
                              onChange={(e) => updateElementContent(element.id, e.target.value)}
                              rows={4}
                            />
                          ) : element.type === 'image' ? (
                            <div className="space-y-2">
                              {element.settings?.imageUrl ? (
                                <div className="relative">
                                  <img 
                                    src={element.settings.imageUrl} 
                                    alt="Post image" 
                                    className="w-full h-48 object-cover rounded-lg"
                                  />
                                  <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    className="absolute top-2 right-2"
                                    onClick={() => setCurrentPost({
                                      ...currentPost,
                                      elements: currentPost.elements.map(el => 
                                        el.id === element.id ? { ...el, settings: { ...el.settings, imageUrl: null } } : el
                                      )
                                    })}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center">
                                  <Image className="mx-auto h-12 w-12 text-gray-400" />
                                  <div className="mt-4">
                                    <Button onClick={() => uploadImage(element.id)}>Upload Image</Button>
                                  </div>
                                </div>
                              )}
                              <Input 
                                placeholder="Image caption (optional)"
                                value={element.content}
                                onChange={(e) => updateElementContent(element.id, e.target.value)}
                              />
                            </div>
                          ) : element.type === 'button' ? (
                            <div className="space-y-2">
                              <Input 
                                placeholder="Button text"
                                value={element.content}
                                onChange={(e) => updateElementContent(element.id, e.target.value)}
                              />
                              <Input 
                                placeholder="URL (where the button links to)"
                                value={element.settings?.url || ''}
                                onChange={(e) => setCurrentPost({
                                  ...currentPost,
                                  elements: currentPost.elements.map(el => 
                                    el.id === element.id ? { ...el, settings: { ...el.settings, url: e.target.value } } : el
                                  )
                                })}
                              />
                              <div className="mt-2">
                                <Button disabled={!element.content}>Preview Button: {element.content || 'Button Text'}</Button>
                              </div>
                            </div>
                          ) : element.type === 'poll' ? (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Poll Question</Label>
                                <Input 
                                  placeholder="Ask a question..."
                                  value={element.content}
                                  onChange={(e) => updateElementContent(element.id, e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Options</Label>
                                <div className="space-y-2">
                                  {(element.settings?.options || ['', '']).map((option: string, i: number) => (
                                    <div key={i} className="flex gap-2">
                                      <Input 
                                        placeholder={`Option ${i + 1}`}
                                        value={option}
                                        onChange={(e) => {
                                          const newOptions = [...(element.settings?.options || ['', ''])];
                                          newOptions[i] = e.target.value;
                                          setCurrentPost({
                                            ...currentPost,
                                            elements: currentPost.elements.map(el => 
                                              el.id === element.id ? { ...el, settings: { ...el.settings, options: newOptions } } : el
                                            )
                                          });
                                        }}
                                      />
                                      {i > 1 && (
                                        <Button 
                                          variant="ghost" 
                                          size="icon"
                                          onClick={() => {
                                            const newOptions = [...(element.settings?.options || [])].filter((_, index) => index !== i);
                                            setCurrentPost({
                                              ...currentPost,
                                              elements: currentPost.elements.map(el => 
                                                el.id === element.id ? { ...el, settings: { ...el.settings, options: newOptions } } : el
                                              )
                                            });
                                          }}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    const newOptions = [...(element.settings?.options || ['', '']), ''];
                                    setCurrentPost({
                                      ...currentPost,
                                      elements: currentPost.elements.map(el => 
                                        el.id === element.id ? { ...el, settings: { ...el.settings, options: newOptions } } : el
                                      )
                                    });
                                  }}
                                >
                                  <Plus className="h-4 w-4 mr-1" /> Add Option
                                </Button>
                              </div>
                              <div className="space-y-2">
                                <Label>Poll Duration</Label>
                                <Select 
                                  defaultValue="1"
                                  onValueChange={(value) => setCurrentPost({
                                    ...currentPost,
                                    elements: currentPost.elements.map(el => 
                                      el.id === element.id ? { ...el, settings: { ...el.settings, duration: value } } : el
                                    )
                                  })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select duration" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">1 Day</SelectItem>
                                    <SelectItem value="3">3 Days</SelectItem>
                                    <SelectItem value="7">7 Days</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 bg-muted text-center rounded">
                              {element.type.charAt(0).toUpperCase() + element.type.slice(1)} element
                              <p className="text-sm text-muted-foreground mt-1">
                                Customization options coming soon
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => addElement('text')} className="mr-2">
                    <Plus className="h-4 w-4 mr-2" /> Add Text
                  </Button>
                  <Button variant="outline" onClick={() => addElement('image')} className="mr-2">
                    <Image className="h-4 w-4 mr-2" /> Add Image
                  </Button>
                  <div className="ml-auto">
                    <Button onClick={() => setActiveTab('schedule')}>
                      Continue to Schedule
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Post</CardTitle>
              <CardDescription>
                Set when your post should be published
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <Card className="flex-1 p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div className="font-medium">Schedule for later</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Set a specific date and time to publish
                  </p>
                  
                  <div className="mt-4">
                    <Label htmlFor="schedule-date">Date and Time</Label>
                    <div className="mt-1">
                      <input 
                        type="datetime-local" 
                        id="schedule-date"
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background"
                        onChange={(e) => setScheduledTime(new Date(e.target.value).toISOString())}
                        value={currentPost.scheduledFor ? new Date(currentPost.scheduledFor).toISOString().slice(0, 16) : ''}
                      />
                    </div>
                  </div>
                </Card>
                
                <Card className="flex-1 p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div className="font-medium">Best time to post</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    AI-recommended time for maximum engagement
                  </p>
                  <Button className="mt-4" onClick={useRecommendedTime}>
                    Use recommended time
                  </Button>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Publishing Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="first-comment" className="flex-1">
                      Add first comment
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          Add
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-4">
                          <h4 className="font-medium text-sm">First Comment</h4>
                          <Textarea 
                            placeholder="Enter the text for your first comment..."
                            rows={3}
                            onChange={(e) => setCurrentPost({
                              ...currentPost,
                              settings: { ...currentPost.settings, firstComment: e.target.value }
                            })}
                          />
                          <Button size="sm" className="w-full">Save Comment</Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="post-to-multiple" className="flex-1">
                      Post to multiple platforms
                    </Label>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="generate-hashtags" className="flex-1">
                      Generate optimized hashtags
                    </Label>
                    <Button variant="outline" size="sm" onClick={generateHashtags}>
                      Generate
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('design')}>
                  Back to Design
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => savePost(true)}>
                    Save as Draft
                  </Button>
                  <Button onClick={() => savePost(false)}>
                    <Check className="mr-2 h-4 w-4" /> Schedule Post
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage">
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="drafts" value={manageTab} onValueChange={setManageTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="drafts" className="flex-1">Drafts</TabsTrigger>
                  <TabsTrigger value="scheduled" className="flex-1">Scheduled</TabsTrigger>
                  <TabsTrigger value="published" className="flex-1">Published</TabsTrigger>
                </TabsList>
                
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      {manageTab === 'drafts' ? 'Draft Posts' : 
                       manageTab === 'scheduled' ? 'Scheduled Posts' : 'Published Posts'}
                    </h3>
                    <Button onClick={() => {
                      setCurrentPost({
                        id: crypto.randomUUID(),
                        name: '',
                        platform: 'instagram',
                        elements: [
                          {
                            id: crypto.randomUUID(),
                            type: 'text',
                            content: 'Write your post content here...',
                            settings: {}
                          }
                        ],
                        scheduledFor: null,
                        createdAt: new Date(),
                        isDraft: true
                      });
                      setActiveTab('design');
                    }}>
                      <Plus className="mr-2 h-4 w-4" /> Create New Post
                    </Button>
                  </div>
                  
                  {posts.filter(post => 
                    (manageTab === 'drafts' && post.isDraft) ||
                    (manageTab === 'scheduled' && !post.isDraft && post.scheduledFor) ||
                    (manageTab === 'published' && !post.isDraft && !post.scheduledFor)
                  ).length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                      <p className="text-muted-foreground">
                        No {manageTab === 'drafts' ? 'draft' : manageTab === 'scheduled' ? 'scheduled' : 'published'} posts yet.
                      </p>
                      <Button onClick={() => setActiveTab('design')} className="mt-4">
                        <Plus className="mr-2 h-4 w-4" /> Create Your First Post
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {posts
                        .filter(post => 
                          (manageTab === 'drafts' && post.isDraft) ||
                          (manageTab === 'scheduled' && !post.isDraft && post.scheduledFor) ||
                          (manageTab === 'published' && !post.isDraft && !post.scheduledFor)
                        )
                        .map(post => (
                          <Card key={post.id}>
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{post.name}</h3>
                                    <Badge>
                                      {platformOptions.find(p => p.value === post.platform)?.label}
                                    </Badge>
                                  </div>
                                  
                                  <div className="mt-2 text-sm text-muted-foreground">
                                    {post.elements.find(el => el.type === 'text')?.content.slice(0, 100)}...
                                  </div>
                                  
                                  <div className="flex items-center mt-2 text-xs text-muted-foreground">
                                    <div className="mr-4">Created: {formatDate(post.createdAt.toString())}</div>
                                    {post.scheduledFor && (
                                      <div>Scheduled for: {formatDate(post.scheduledFor)}</div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                  <Button variant="outline" size="sm" onClick={() => editPost(post)}>
                                    Edit
                                  </Button>
                                  {post.isDraft && (
                                    <Button variant="outline" size="sm" onClick={() => {
                                      setCurrentPost(post);
                                      setActiveTab('schedule');
                                    }}>
                                      Schedule
                                    </Button>
                                  )}
                                  <Button variant="destructive" size="sm" onClick={() => deletePost(post.id)}>
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  )}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PostCreator;
