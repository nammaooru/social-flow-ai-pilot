
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Check, Clock, Image, Plus, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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
    scheduledFor: null
  });

  const platformOptions = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' }
  ];

  const elementTypes = [
    { value: 'text', label: 'Text Block', icon: <Plus className="h-4 w-4" /> },
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

  const savePost = () => {
    if (!currentPost.name) {
      toast({
        title: "Validation Error",
        description: "Please provide a name for your post",
        variant: "destructive"
      });
      return;
    }

    // Add or update post
    const existingIndex = posts.findIndex(p => p.id === currentPost.id);
    if (existingIndex >= 0) {
      const updatedPosts = [...posts];
      updatedPosts[existingIndex] = currentPost;
      setPosts(updatedPosts);
    } else {
      setPosts([...posts, currentPost]);
    }

    toast({
      title: "Post Saved",
      description: "Your post has been saved successfully"
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
      scheduledFor: null
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-1">Post Creator</h1>
          <p className="text-muted-foreground">
            Design and schedule social media posts with drag-and-drop simplicity
          </p>
        </div>
        <Button onClick={() => savePost()}>
          <Save className="mr-2 h-4 w-4" /> Save Post
        </Button>
      </div>

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
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="design" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>
            
            <TabsContent value="design">
              <Card>
                <CardHeader>
                  <CardTitle>Post Content</CardTitle>
                  <CardDescription>
                    Design your post by adding and editing elements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentPost.elements.map((element, index) => (
                    <Card key={element.id} className="border border-dashed">
                      <CardHeader className="py-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">{element.type.toUpperCase()}</CardTitle>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => removeElement(element.id)}
                          >
                            ✕
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
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center">
                              <Image className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="mt-4">
                                <Button>Upload Image</Button>
                              </div>
                            </div>
                            <Input 
                              placeholder="Image caption (optional)"
                              value={element.content}
                              onChange={(e) => updateElementContent(element.id, e.target.value)}
                            />
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
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => addElement('text')} className="mr-2">
                    <Plus className="h-4 w-4 mr-2" /> Add Text
                  </Button>
                  <Button variant="outline" onClick={() => addElement('image')}>
                    <Image className="h-4 w-4 mr-2" /> Add Image
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Post Preview</CardTitle>
                  <CardDescription>
                    Preview how your post will look on {platformOptions.find(p => p.value === currentPost.platform)?.label}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={`border rounded-lg p-4 ${currentPost.platform === 'instagram' ? 'max-w-md mx-auto' : ''}`}>
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                      <div>
                        <p className="font-medium">YourAccount</p>
                        <p className="text-xs text-gray-500">Just now</p>
                      </div>
                    </div>
                    
                    {currentPost.elements.map((element) => (
                      <div key={element.id} className="mb-4">
                        {element.type === 'text' ? (
                          <p className="whitespace-pre-wrap">{element.content}</p>
                        ) : element.type === 'image' ? (
                          <>
                            <div className="bg-gray-200 w-full h-48 rounded-lg mb-2 flex items-center justify-center">
                              <Image className="h-8 w-8 text-gray-400" />
                            </div>
                            {element.content && <p className="text-sm text-gray-600">{element.content}</p>}
                          </>
                        ) : element.type === 'button' ? (
                          <Button className="w-full">Call to Action</Button>
                        ) : (
                          <div className="p-4 bg-muted rounded-lg">
                            {element.type.charAt(0).toUpperCase() + element.type.slice(1)} preview
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <div className="flex gap-4 text-gray-500 pt-2 border-t">
                      <button className="flex items-center">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Like
                      </button>
                      <button className="flex items-center">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Comment
                      </button>
                      <button className="flex items-center">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                      <Button variant="outline" className="mt-4">
                        Pick a date & time
                      </Button>
                    </Card>
                    
                    <Card className="flex-1 p-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div className="font-medium">Best time to post</div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        AI-recommended time for maximum engagement
                      </p>
                      <Button className="mt-4">
                        Use recommended time
                      </Button>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Publishing Options</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="first-comment" className="flex-1">
                          Add first comment
                        </Label>
                        <Button variant="outline" size="sm">
                          Add
                        </Button>
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
                        <Button variant="outline" size="sm">
                          Generate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="mr-2">
                    Save as Draft
                  </Button>
                  <Button>
                    <Check className="mr-2 h-4 w-4" /> Schedule Post
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PostCreator;
