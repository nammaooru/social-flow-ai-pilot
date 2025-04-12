import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Video, LayoutGrid, FileText, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [activeTab, setActiveTab] = useState('text');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (editTemplate) {
      setTitle(editTemplate.title || '');
      setDescription(editTemplate.description || '');
      setContent(editTemplate.content || '');
      setActiveTab(editTemplate.content_type || 'text');
      setTags(editTemplate.tags ? editTemplate.tags.join(', ') : '');
    }
  }, [editTemplate, open]);
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setContent('');
    setTags('');
    setActiveTab('text');
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
      const temporaryUserId = '00000000-0000-0000-0000-000000000000';
      
      const templateData = {
        title,
        description: description || null,
        content: content || null,
        content_type: activeTab as 'image' | 'video' | 'carousel' | 'text',
        tags: processTagsString(tags),
        user_id: temporaryUserId,
      };
      
      if (editTemplate) {
        const { error } = await supabase
          .from('content_templates')
          .update(templateData)
          .eq('id', editTemplate.id);
        
        if (error) throw error;
        
        toast({
          title: "Template updated",
          description: "Your content template has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('content_templates')
          .insert(templateData);
        
        if (error) throw error;
        
        toast({
          title: "Template created",
          description: "Your content template has been created successfully.",
        });
      }
      
      resetForm();
      onTemplateCreate();
      onOpenChange(false);
      
    } catch (error: any) {
      toast({
        title: "Error saving template",
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
          <DialogTitle>
            {editTemplate ? 'Edit Content Template' : 'Create Content Template'}
          </DialogTitle>
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
            
            <div>
              <Label htmlFor="content">Template Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Enter your ${activeTab} template content...`}
                rows={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {activeTab === 'text' && "Enter the text content you want to reuse."}
                {activeTab === 'image' && "Enter caption templates, instructions, or hashtags for image posts."}
                {activeTab === 'video' && "Enter video descriptions, call-to-actions, or hashtags for video content."}
                {activeTab === 'carousel' && "Enter slide descriptions or hashtags for carousel posts."}
              </p>
            </div>
            
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. promotion, product, announcement"
              />
            </div>
          </div>
        </Tabs>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving} className="gap-2">
            <Save className="h-4 w-4" />
            {editTemplate ? 'Update Template' : 'Save Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTemplateModal;
