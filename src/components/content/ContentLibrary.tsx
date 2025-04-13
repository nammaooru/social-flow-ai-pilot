
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Video, FileText, LayoutGrid, Search, Filter, Trash2, Edit, MessageSquare } from 'lucide-react';
import ContentCard from './ContentCard';
import ContentDetailsModal from './ContentDetailsModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import GenerateCaptionModal from './GenerateCaptionModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ContentLibraryProps {
  content: any[];
  isLoading: boolean;
  onRefresh: () => void;
}

type ContentType = 'all' | 'image' | 'video' | 'carousel' | 'text';

const ContentLibrary: React.FC<ContentLibraryProps> = ({ content, isLoading, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState<ContentType>('all');
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCaptionModalOpen, setIsCaptionModalOpen] = useState(false);
  const { toast } = useToast();

  const filteredContent = content.filter(item => {
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

  const handleViewDetails = (item: any) => {
    setSelectedContent(item);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = (item: any) => {
    setSelectedContent(item);
    setIsDeleteModalOpen(true);
  };

  const handleGenerateCaption = (item: any) => {
    setSelectedContent(item);
    setIsCaptionModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedContent) return;
    
    try {
      // First delete the file from storage if it exists
      if (selectedContent.file_path) {
        await supabase.storage
          .from('content_assets')
          .remove([selectedContent.file_path]);
      }
      
      // Then delete the database entry
      const { error } = await supabase
        .from('content_library')
        .delete()
        .eq('id', selectedContent.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Content deleted",
        description: "The content has been removed from your library.",
      });
      
      setIsDeleteModalOpen(false);
      // No need to call onRefresh here as the real-time subscription will handle it
    } catch (error: any) {
      toast({
        title: "Error deleting content",
        description: error.message,
        variant: "destructive",
      });
    }
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
            placeholder="Search content..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredContent.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            {activeType === 'all' ? (
              <LayoutGrid className="h-10 w-10 text-muted-foreground" />
            ) : (
              getContentTypeIcon(activeType)
            )}
          </div>
          <h3 className="text-lg font-medium mb-2">No content found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm 
              ? "No content matches your search criteria." 
              : `You don't have any ${activeType === 'all' ? '' : activeType} content yet.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredContent.map((item) => (
            <ContentCard 
              key={item.id} 
              content={item}
              onView={() => handleViewDetails(item)}
              onDelete={() => handleDelete(item)}
              onGenerateCaption={() => handleGenerateCaption(item)}
            />
          ))}
        </div>
      )}

      {selectedContent && (
        <>
          <ContentDetailsModal 
            content={selectedContent}
            open={isDetailsModalOpen}
            onOpenChange={setIsDetailsModalOpen}
          />
          <DeleteConfirmationModal
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            onConfirm={confirmDelete}
            title="Delete Content"
            description="Are you sure you want to delete this content? This action cannot be undone."
          />
          <GenerateCaptionModal
            content={selectedContent}
            open={isCaptionModalOpen}
            onOpenChange={setIsCaptionModalOpen}
            onSuccess={onRefresh}
          />
        </>
      )}
    </div>
  );
};

export default ContentLibrary;
