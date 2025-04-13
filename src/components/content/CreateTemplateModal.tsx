
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
  editTemplate?: any; // Adding the editTemplate prop
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
    }
  }, [editTemplate, open]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setDescription('');
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
      if (editTemplate) {
        // Update existing template
        const { error } = await supabase
          .from('content_templates')
          .update({
            title,
            description: description || null,
            content_type: activeTab,
            content: content || null,
            tags: processTagsString(tags),
            updated_at: new Date().toISOString() // Convert Date to ISO string
          })
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
            user_id: null, // Explicitly set to null since we made it nullable
            title,
            description: description || null,
            content_type: activeTab,
            content: content || null,
            tags: processTagsString(tags)
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
            
            <div>
              <Label htmlFor="content">Template Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Enter template content for ${activeTab} posts...`}
                rows={6}
              />
            </div>
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
