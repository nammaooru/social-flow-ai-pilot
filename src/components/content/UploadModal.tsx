import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Video, LayoutGrid, FileText, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ open, onOpenChange, onUploadComplete }) => {
  const [activeTab, setActiveTab] = useState('image');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [textContent, setTextContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTags('');
    setFiles(null);
    setTextContent('');
    setUploadProgress(0);
    setActiveTab('image');
  };

  const handleClose = () => {
    if (!isUploading) {
      resetForm();
      onOpenChange(false);
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your content.",
        variant: "destructive",
      });
      return false;
    }

    if (activeTab !== 'text' && (!files || files.length === 0)) {
      toast({
        title: "File required",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return false;
    }

    if (activeTab === 'text' && !textContent.trim()) {
      toast({
        title: "Content required",
        description: "Please provide some text content.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const processTagsString = (tagsString: string) => {
    if (!tagsString.trim()) return [];
    return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      let uploadFilePath = null;
      let thumbnailPath = null;
      const contentType = activeTab as 'image' | 'video' | 'carousel' | 'text';
      
      // Handle file upload for non-text content
      if (contentType !== 'text' && files && files.length > 0) {
        const file = files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const storagePath = `${contentType}/${fileName}`;
        
        setUploadProgress(30);
        
        const { error: uploadError } = await supabase.storage
          .from('content_assets')
          .upload(storagePath, file);
        
        if (uploadError) {
          throw new Error(uploadError.message);
        }
        
        setUploadProgress(70);
        uploadFilePath = `content_assets/${storagePath}`;
        
        // Create thumbnail for videos (in a real app, you'd use a service to generate this)
        if (contentType === 'video') {
          // For a real app, implement video thumbnail generation
          // Placeholder: thumbnailPath = `thumbnails/${fileName.replace(fileExt, 'jpg')}`;
        }
      }
      
      setUploadProgress(80);
      
      // Create a temporary user ID - in a real app, this would be from auth
      // For now we're using a fixed value to satisfy TypeScript
      const temporaryUserId = '00000000-0000-0000-0000-000000000000';
      
      // Save to database
      const { error: insertError } = await supabase
        .from('content_library')
        .insert({
          user_id: temporaryUserId, // Add the required user_id field
          title,
          description: description || null,
          content_type: contentType,
          file_path: uploadFilePath,
          thumbnail_path: thumbnailPath,
          tags: processTagsString(tags),
          metadata: contentType === 'text' ? { text: textContent } : null,
        });
      
      if (insertError) {
        throw new Error(insertError.message);
      }
      
      setUploadProgress(100);
      resetForm();
      onUploadComplete();
      
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload New Content</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="image" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Image
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Video
            </TabsTrigger>
            <TabsTrigger value="carousel" className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" />
              Carousel
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Text
            </TabsTrigger>
          </TabsList>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter content title"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description for your content"
                rows={3}
              />
            </div>
            
            <TabsContent value="image">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                {files && files.length > 0 ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(files[0])}
                      alt="Preview"
                      className="max-h-[200px] mx-auto rounded-lg object-contain"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-0 right-0 rounded-full h-8 w-8"
                      onClick={() => setFiles(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="py-4">
                    <Image className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <Label
                      htmlFor="image-upload"
                      className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    >
                      Click to upload an image
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setFiles(e.target.files)}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="video">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                {files && files.length > 0 ? (
                  <div className="relative">
                    <video
                      src={URL.createObjectURL(files[0])}
                      controls
                      className="max-h-[200px] w-full mx-auto rounded-lg"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full h-8 w-8"
                      onClick={() => setFiles(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="py-4">
                    <Video className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <Label
                      htmlFor="video-upload"
                      className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    >
                      Click to upload a video
                    </Label>
                    <Input
                      id="video-upload"
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => setFiles(e.target.files)}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="carousel">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                {files && files.length > 0 ? (
                  <div className="relative">
                    <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                      {Array.from(files).map((file, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt={`Image ${index + 1}`}
                          className="h-24 w-full object-cover rounded"
                        />
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-0 right-0 rounded-full h-8 w-8"
                      onClick={() => setFiles(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="py-4">
                    <LayoutGrid className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <Label
                      htmlFor="carousel-upload"
                      className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    >
                      Click to upload multiple images
                    </Label>
                    <Input
                      id="carousel-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => setFiles(e.target.files)}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="text">
              <div>
                <Label htmlFor="text-content">Text Content</Label>
                <Textarea
                  id="text-content"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Enter your text content here"
                  rows={6}
                />
              </div>
            </TabsContent>
            
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. summer, promotion, product"
              />
            </div>
          </div>
        </Tabs>
        
        {isUploading && (
          <div className="mt-4">
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isUploading} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
