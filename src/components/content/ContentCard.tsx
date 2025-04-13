
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, MessageSquare, Image, Video, FileText, LayoutGrid } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ContentCardProps {
  content: any;
  onView: () => void;
  onDelete: () => void;
  onGenerateCaption: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, onView, onDelete, onGenerateCaption }) => {
  const getContentTypeIcon = () => {
    switch (content.content_type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'carousel':
        return <LayoutGrid className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getContentPreview = () => {
    const baseUrl = "https://jjsqtstfjodtaclulwtu.supabase.co/storage/v1/object/public/content_assets/";
    
    switch (content.content_type) {
      case 'image':
        return (
          <img 
            src={content.file_path ? baseUrl + content.file_path : '/placeholder.svg'} 
            alt={content.title}
            className="object-cover w-full h-48 rounded-t-lg"
          />
        );
      case 'video':
        return (
          <div className="relative bg-black h-48 flex items-center justify-center rounded-t-lg">
            {content.thumbnail_path ? (
              <img 
                src={baseUrl + content.thumbnail_path} 
                alt={content.title}
                className="object-cover w-full h-full rounded-t-lg opacity-70"
              />
            ) : (
              <Video className="h-16 w-16 text-muted" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-primary/80 p-3">
                <Video className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
          </div>
        );
      case 'carousel':
        return (
          <div className="bg-muted flex items-center justify-center h-48 rounded-t-lg">
            <div className="grid grid-cols-2 gap-1 p-4 w-full h-full">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-background rounded"></div>
              ))}
            </div>
            <LayoutGrid className="absolute h-10 w-10 text-foreground opacity-50" />
          </div>
        );
      case 'text':
        return (
          <div className="bg-muted flex items-center justify-center h-48 p-6 rounded-t-lg">
            <div className="text-center">
              <FileText className="h-10 w-10 text-foreground opacity-50 mx-auto mb-2" />
              <p className="line-clamp-4 text-sm text-foreground/70">
                {content.description || "Text content"}
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-muted flex items-center justify-center h-48 rounded-t-lg">
            <FileText className="h-10 w-10 text-muted-foreground" />
          </div>
        );
    }
  };

  // Check if the content has an AI caption
  const hasAiCaption = content.metadata && (content.metadata.ai_caption || content.metadata.ai_hashtags);

  return (
    <Card className="overflow-hidden flex flex-col">
      {getContentPreview()}
      <CardContent className="p-4 flex-grow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {getContentTypeIcon()}
            <span className="capitalize">{content.content_type}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {content.created_at && formatDistanceToNow(new Date(content.created_at), { addSuffix: true })}
          </span>
        </div>
        <h3 className="font-medium text-base mb-1 truncate">{content.title}</h3>
        {content.description && (
          <p className="text-muted-foreground text-sm mb-1 line-clamp-2">{content.description}</p>
        )}
        {hasAiCaption && (
          <div className="mt-2 bg-primary/5 p-2 rounded-sm">
            <p className="text-xs text-primary/90 line-clamp-2">
              {content.metadata.ai_caption || "AI caption available"}
            </p>
          </div>
        )}
        {content.tags && content.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {content.tags.slice(0, 3).map((tag: string, index: number) => (
              <span 
                key={index} 
                className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full"
              >
                {tag}
              </span>
            ))}
            {content.tags.length > 3 && (
              <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
                +{content.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="px-4 py-3 bg-muted/20 border-t flex justify-between">
        <Button variant="ghost" size="sm" onClick={onView}>
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onGenerateCaption}
            className={hasAiCaption ? "text-primary" : ""}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ContentCard;
