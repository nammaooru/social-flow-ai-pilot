
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Video, FileText, LayoutGrid, Search, Edit, Trash2, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import CreateTemplateModal from './CreateTemplateModal';

interface ContentTemplatesProps {
  templates: any[];
  isLoading: boolean;
  onRefresh: () => void;
}

type ContentType = 'all' | 'image' | 'video' | 'carousel' | 'text';

const ContentTemplates: React.FC<ContentTemplatesProps> = ({ templates, isLoading, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState<ContentType>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  const filteredTemplates = templates.filter(item => {
    // Filter by content type
    if (activeType !== 'all' && item.content_type !== activeType) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !item.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleDelete = (template: any) => {
    setSelectedTemplate(template);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = (template: any) => {
    setSelectedTemplate(template);
    setIsEditModalOpen(true);
  };

  const handleCopy = (template: any) => {
    navigator.clipboard.writeText(template.content || '');
    toast({
      title: "Copied to clipboard",
      description: "Template content has been copied to your clipboard.",
    });
  };

  const confirmDelete = async () => {
    if (!selectedTemplate) return;
    
    const { error } = await supabase
      .from('content_templates')
      .delete()
      .eq('id', selectedTemplate.id);
    
    if (error) {
      toast({
        title: "Error deleting template",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Template deleted",
        description: "The template has been removed.",
      });
      onRefresh();
    }
    
    setIsDeleteModalOpen(false);
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'carousel':
        return <LayoutGrid className="h-5 w-5" />;
      case 'text':
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={activeType} onValueChange={(value) => setActiveType(value as ContentType)} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="image" className="flex items-center gap-1">
              <Image className="h-4 w-4" />
              Images
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-1">
              <Video className="h-4 w-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="carousel" className="flex items-center gap-1">
              <LayoutGrid className="h-4 w-4" />
              Carousels
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Text
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-32 bg-muted rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            {activeType === 'all' ? (
              <FileText className="h-10 w-10 text-muted-foreground" />
            ) : (
              getContentTypeIcon(activeType)
            )}
          </div>
          <h3 className="text-lg font-medium mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm 
              ? "No templates match your search criteria." 
              : `You don't have any ${activeType === 'all' ? '' : activeType} templates yet.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden flex flex-col">
              <div className="h-32 bg-muted p-4 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  {getContentTypeIcon(template.content_type)}
                  <span className="text-sm text-muted-foreground mt-2 capitalize">{template.content_type} Template</span>
                </div>
              </div>
              <CardContent className="p-4 flex-grow">
                <h3 className="font-medium text-base mb-1">{template.title}</h3>
                {template.description && (
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{template.description}</p>
                )}
                <div className="flex justify-between items-end">
                  <span className="text-xs text-muted-foreground">
                    {template.created_at && formatDistanceToNow(new Date(template.created_at), { addSuffix: true })}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(template)} title="Copy content">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(template)} title="Edit template">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(template)} title="Delete template">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedTemplate && (
        <>
          <DeleteConfirmationModal
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            onConfirm={confirmDelete}
            title="Delete Template"
            description="Are you sure you want to delete this template? This action cannot be undone."
          />
          <CreateTemplateModal
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            onTemplateCreate={onRefresh}
            editTemplate={selectedTemplate}
          />
        </>
      )}
    </div>
  );
};

export default ContentTemplates;
