
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Image, Video, LayoutGrid, FileText, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface ContentDetailsModalProps {
  content: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContentDetailsModal: React.FC<ContentDetailsModalProps> = ({ content, open, onOpenChange }) => {
  const getContentTypeIcon = () => {
    switch (content.content_type) {
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

  const getContentPreview = () => {
    const baseUrl = "https://jjsqtstfjodtaclulwtu.supabase.co/storage/v1/object/public/content_assets/";

    switch (content.content_type) {
      case 'image':
        return (
          <div className="aspect-video flex items-center justify-center bg-black rounded-lg overflow-hidden mb-6">
            <img 
              src={content.file_path ? baseUrl + content.file_path.split('/').pop() : '/placeholder.svg'} 
              alt={content.title}
              className="max-h-[400px] max-w-full object-contain"
            />
          </div>
        );
      case 'video':
        return (
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
            <video 
              src={content.file_path ? baseUrl + content.file_path.split('/').pop() : undefined}
              controls
              className="w-full h-full object-contain"
              poster={content.thumbnail_path ? baseUrl + content.thumbnail_path.split('/').pop() : undefined}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'carousel':
        // In a real app, you'd map through carousel items
        return (
          <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center">
            <LayoutGrid className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground">Carousel preview</p>
          </div>
        );
      case 'text':
        return (
          <Card className="p-6 mb-6 bg-muted/30 max-h-[400px] overflow-y-auto">
            <p className="whitespace-pre-wrap">
              {content.metadata?.text || "No text content available."}
            </p>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getContentTypeIcon()}
            {content.title}
          </DialogTitle>
        </DialogHeader>
        
        {getContentPreview()}
        
        <div className="space-y-4">
          {content.description && (
            <div>
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-muted-foreground">{content.description}</p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span>Created</span>
              </div>
              <p className="text-sm">
                {content.created_at && format(new Date(content.created_at), 'PPP')}
              </p>
            </div>
            
            <div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <Tag className="h-4 w-4" />
                <span>Content Type</span>
              </div>
              <p className="text-sm capitalize">{content.content_type}</p>
            </div>
          </div>
          
          {content.tags && content.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {content.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentDetailsModal;
