
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Video, LayoutGrid, FileText, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface CreateTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateCreate: () => void;
  editTemplate?: any;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({ 
  open, 
  onOpenChange, 
  onTemplateCreate,
  editTemplate 
}) => {
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'carousel' | 'text'>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Load template data when editing an existing template
  useEffect(() => {
    if (editTemplate && open) {
      setTitle(editTemplate.title || '');
      setContent(editTemplate.content || '');
      setDescription(editTemplate.description || '');
      setActiveTab(editTemplate.content_type || 'text');
      setTags(editTemplate.tags ? editTemplate.tags.join(', ') : '');
      
      // Set file preview URL if there's a stored file path
      if (editTemplate.file_path) {
        const baseUrl = "https://jjsqtstfjodtaclulwtu.supabase.co/storage/v1/object/public/content_assets/";
        setFilePreviewUrl(baseUrl + editTemplate.file_path);
      }
    } else if (open && !editTemplate) {
      resetForm();
    }
  }, [editTemplate, open]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setDescription('');
    setTags('');
    setActiveTab('text');
    setFiles(null);
    setFilePreviewUrl(null);
  };

  const handleClose = () => {
    if (!isSaving) {
      resetForm();
      onOpenChange(false);
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your template.",
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
    
    setIsSaving(true);
    
    try {
      let uploadFilePath = editTemplate?.file_path || null;
      
      // Handle file upload for image, video, and carousel templates
      if (['image', 'video', 'carousel'].includes(activeTab) && files && files.length > 0) {
        const file = files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `templates/${uuidv4()}.${fileExt}`;
        
        // If editing and there's an existing file, remove it first
        if (editTemplate?.file_path) {
          await supabase.storage
            .from('content_assets')
            .remove([editTemplate.file_path]);
        }
        
        const { error: uploadError } = await supabase.storage
          .from('content_assets')
          .upload(fileName, file);
        
        if (uploadError) {
          throw new Error(uploadError.message);
        }
        
        uploadFilePath = fileName;
      }
      
      // Template data to save
      const templateData = {
        title,
        description: description || null,
        content_type: activeTab,
        content: content || null,
        tags: processTagsString(tags),
        file_path: uploadFilePath,
        updated_at: new Date().toISOString()
      };
      
      if (editTemplate) {
        // Update existing template
        const { error } = await supabase
          .from('content_templates')
          .update(templateData)
          .eq('id', editTemplate.id);
        
        if (error) {
          throw new Error(error.message);
        }
        
        toast({
          title: "Template updated",
          description: "Your content template has been updated successfully.",
        });
      } else {
        // Create new template
        const { error } = await supabase
          .from('content_templates')
          .insert({
            ...templateData,
            user_id: null, // Explicitly set to null since we made it nullable
          });
        
        if (error) {
          throw new Error(error.message);
        }
        
        toast({
          title: "Template created",
          description: "Your content template has been saved successfully.",
        });
      }
      
      resetForm();
      onTemplateCreate();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: editTemplate ? "Error updating template" : "Error creating template",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editTemplate ? 'Edit' : 'Create'} Content Template</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="title">Template Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter template title"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description for your template"
              rows={2}
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <Label>Template Type</Label>
            <TabsList className="grid grid-cols-4 mt-1 mb-4">
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
            
            <TabsContent value="image">
              <div className="space-y-4">
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
                        htmlFor="image-upload-template"
                        className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                      >
                        Click to upload an image
                      </Label>
                      <Input
                        id="image-upload-template"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setFiles(e.target.files)}
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="image-content">Template Text (optional)</Label>
                  <Textarea
                    id="image-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter template text for image posts..."
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="video">
              <div className="space-y-4">
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
                        htmlFor="video-upload-template"
                        className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                      >
                        Click to upload a video
                      </Label>
                      <Input
                        id="video-upload-template"
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => setFiles(e.target.files)}
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="video-content">Template Text (optional)</Label>
                  <Textarea
                    id="video-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter template text for video posts..."
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="carousel">
              <div className="space-y-4">
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
                        htmlFor="carousel-upload-template"
                        className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                      >
                        Click to upload multiple images
                      </Label>
                      <Input
                        id="carousel-upload-template"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => setFiles(e.target.files)}
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="carousel-content">Template Text (optional)</Label>
                  <Textarea
                    id="carousel-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter template text for carousel posts..."
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="text">
              <div>
                <Label htmlFor="content">Template Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter template content for text posts..."
                  rows={6}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. branding, promotion, product"
            />
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving} className="gap-2">
            <Save className="h-4 w-4" />
            {editTemplate ? 'Update' : 'Save'} Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTemplateModal;
