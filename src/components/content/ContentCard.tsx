
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Edit, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ContentCardProps {
  content: {
    id: string;
    title: string;
    description?: string;
    content_type: string;
    thumbnail_path?: string;
    file_path?: string;
    created_at?: string;
  };
  onView: () => void;
  onDelete: () => void;
  onGenerateCaption: () => void;
  onEdit: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  content, 
  onView, 
  onDelete, 
  onGenerateCaption, 
  onEdit
}) => {
  const getContentTypeBadge = (type: string) => {
    switch (type) {
      case 'image':
        return <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Image</span>;
      case 'video':
        return <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">Video</span>;
      case 'carousel':
        return <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">Carousel</span>;
      case 'text':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Text</span>;
      default:
        return null;
    }
  };
  
  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="h-48 bg-muted relative">
        {content.thumbnail_path || content.file_path ? (
          <img 
            src={content.thumbnail_path || content.file_path} 
            alt={content.title}
            className="object-cover w-full h-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <img src="/placeholder.svg" alt="Placeholder" className="w-16 h-16 opacity-50" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          {getContentTypeBadge(content.content_type)}
        </div>
      </div>
      <CardContent className="p-4 flex-grow flex flex-col">
        <h3 className="font-medium text-base mb-1 line-clamp-1" title={content.title}>{content.title}</h3>
        {content.description && (
          <p className="text-muted-foreground text-sm mb-2 line-clamp-2" title={content.description}>
            {content.description}
          </p>
        )}
        <div className="flex justify-between items-center mt-auto pt-2">
          <span className="text-xs text-muted-foreground">
            {content.created_at && formatDistanceToNow(new Date(content.created_at), { addSuffix: true })}
          </span>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={onView} title="View details">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onEdit} title="Edit content">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onGenerateCaption} title="Generate caption">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete} title="Delete content">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentCard;
