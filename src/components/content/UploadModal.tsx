
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Video, LayoutGrid, FileText, Upload, X, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: () => void;
  editMode?: boolean;
  contentToEdit?: any;
}

const UploadModal: React.FC<UploadModalProps> = ({ 
  open, 
  onOpenChange, 
  onUploadComplete,
  editMode = false,
  contentToEdit
}) => {
  const [activeTab, setActiveTab] = useState('image');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [textContent, setTextContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open && editMode && contentToEdit) {
      setTitle(contentToEdit.title || '');
      setDescription(contentToEdit.description || '');
      setActiveTab(contentToEdit.content_type || 'text');
      setTags(contentToEdit.tags ? contentToEdit.tags.join(', ') : '');
      
      // Set text content if it's a text type
      if (contentToEdit.content_type === 'text' && contentToEdit.metadata && contentToEdit.metadata.text) {
        setTextContent(contentToEdit.metadata.text);
      }
      
      // Set file preview URL for image/video/carousel
      if (contentToEdit.file_path) {
        const baseUrl = "https://jjsqtstfjodtaclulwtu.supabase.co/storage/v1/object/public/content_assets/";
        setFilePreviewUrl(baseUrl + contentToEdit.file_path);
      }
    } else if (open && !editMode) {
      resetForm();
    }
  }, [open, editMode, contentToEdit]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTags('');
    setFiles(null);
    setTextContent('');
    setUploadProgress(0);
    setActiveTab('image');
    setFilePreviewUrl(null);
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

    if (activeTab !== 'text' && !editMode && (!files || files.length === 0) && !filePreviewUrl) {
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
      let uploadFilePath = contentToEdit?.file_path || null;
      let thumbnailPath = contentToEdit?.thumbnail_path || null;
      const contentType = activeTab as 'image' | 'video' | 'carousel' | 'text';
      
      // Only upload a new file if files are selected
      if (contentType !== 'text' && files && files.length > 0) {
        const file = files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const storagePath = `${contentType}/${fileName}`;
        
        setUploadProgress(30);
        
        // If editing and there's an existing file, remove it first
        if (editMode && contentToEdit?.file_path) {
          await supabase.storage
            .from('content_assets')
            .remove([contentToEdit.file_path]);
        }
        
        const { error: uploadError, data } = await supabase.storage
          .from('content_assets')
          .upload(storagePath, file);
        
        if (uploadError) {
          throw new Error(uploadError.message);
        }
        
        setUploadProgress(70);
        uploadFilePath = storagePath;
        
        if (contentType === 'video') {
          // For a real app, implement video thumbnail generation
        }
      }
      
      setUploadProgress(80);
      
      if (editMode && contentToEdit?.id) {
        // Update existing content
        const { error: updateError } = await supabase
          .from('content_library')
          .update({
            title,
            description: description || null,
            content_type: contentType,
            file_path: uploadFilePath,
            thumbnail_path: thumbnailPath,
            tags: processTagsString(tags),
            metadata: contentType === 'text' ? { text: textContent } : contentToEdit?.metadata || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', contentToEdit.id);
        
        if (updateError) {
          throw new Error(updateError.message);
        }
        
        toast({
          title: "Content updated",
          description: "Your content has been updated successfully.",
        });
      } else {
        // Create new content
        const { error: insertError } = await supabase
          .from('content_library')
          .insert({
            user_id: null,
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
        
        toast({
          title: "Upload successful",
          description: "Your content has been added to the library.",
        });
      }
      
      setUploadProgress(100);
      resetForm();
      onUploadComplete();
      
    } catch (error: any) {
      toast({
        title: editMode ? "Update failed" : "Upload failed",
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
          <DialogTitle>{editMode ? 'Edit Content' : 'Upload New Content'}</DialogTitle>
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
                ) : filePreviewUrl && activeTab === 'image' ? (
                  <div className="relative">
                    <img
                      src={filePreviewUrl}
                      alt="Current file"
                      className="max-h-[200px] mx-auto rounded-lg object-contain"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-0 right-0 rounded-full h-8 w-8"
                      onClick={() => setFilePreviewUrl(null)}
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
                ) : filePreviewUrl && activeTab === 'video' ? (
                  <div className="relative">
                    <video
                      src={filePreviewUrl}
                      controls
                      className="max-h-[200px] w-full mx-auto rounded-lg"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full h-8 w-8"
                      onClick={() => setFilePreviewUrl(null)}
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
                ) : filePreviewUrl && activeTab === 'carousel' ? (
                  <div className="relative">
                    <img
                      src={filePreviewUrl}
                      alt="Current file"
                      className="max-h-[200px] mx-auto rounded-lg object-contain"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-0 right-0 rounded-full h-8 w-8"
                      onClick={() => setFilePreviewUrl(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Upload new images to replace current carousel
                    </p>
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
              {editMode ? 'Updating' : 'Uploading'}... {uploadProgress}%
            </p>
          </div>
        )}
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isUploading} className="gap-2">
            {editMode ? (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
