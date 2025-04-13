
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, Tag, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GenerateCaptionModalProps {
  content: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const GenerateCaptionModal: React.FC<GenerateCaptionModalProps> = ({ 
  content, 
  open, 
  onOpenChange,
  onSuccess
}) => {
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // For demo purposes, generate a basic caption based on content type
  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simple demo caption generator based on content type
    setTimeout(() => {
      let generatedCaption = '';
      let generatedHashtags = '';
      
      switch(content.content_type) {
        case 'image':
          generatedCaption = `Check out this amazing ${content.title} we just captured! 📸 ${content.description || ''}`;
          generatedHashtags = '#photooftheday #amazing #photography';
          break;
        case 'video':
          generatedCaption = `New video alert! 🎬 ${content.title} - ${content.description || 'Watch now!'}`;
          generatedHashtags = '#video #trending #viral';
          break;
        case 'carousel':
          generatedCaption = `Swipe through to see all the amazing ${content.title} moments! ➡️ ${content.description || ''}`;
          generatedHashtags = '#swiperight #carousel #moments';
          break;
        case 'text':
          generatedCaption = `Thoughts on ${content.title}: ${content.description || 'Read more in our blog!'}`;
          generatedHashtags = '#thoughts #insights #perspective';
          break;
        default:
          generatedCaption = `Check out our latest content: ${content.title}`;
          generatedHashtags = '#content #social #share';
      }
      
      setCaption(generatedCaption);
      setHashtags(generatedHashtags);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopyToClipboard = () => {
    const fullText = `${caption}\n\n${hashtags}`;
    navigator.clipboard.writeText(fullText);
    toast({
      title: "Copied to clipboard",
      description: "Caption and hashtags copied to clipboard.",
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Save the AI-generated caption to the database
      const { error } = await supabase
        .from('ai_captions')
        .insert({
          content_id: content.id,
          caption: caption,
          hashtags: hashtags.split(' ').filter(tag => tag.startsWith('#')),
          user_id: '00000000-0000-0000-0000-000000000000' // Demo user ID
        });
      
      if (error) throw error;
      
      // Update the content library with the caption
      const { error: updateError } = await supabase
        .from('content_library')
        .update({
          metadata: {
            ...content.metadata,
            ai_caption: caption,
            ai_hashtags: hashtags
          }
        })
        .eq('id', content.id);
      
      if (updateError) throw updateError;
      
      toast({
        title: "Caption saved",
        description: "Your AI-generated caption has been saved.",
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error saving caption",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate Caption for {content?.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            <div className="col-span-2 flex flex-col gap-2">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-1">{content?.title}</h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-3">{content?.description || 'No description'}</p>
                <div className="flex flex-wrap gap-1">
                  {content?.tags?.map((tag: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating} 
                className="w-full gap-2 mt-2"
              >
                <Sparkles className="h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Generate Caption'}
              </Button>
            </div>
            
            <div className="col-span-3 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Caption</label>
                  {caption && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={handleCopyToClipboard}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy all
                    </Button>
                  )}
                </div>
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Your caption will appear here..."
                  rows={4}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Hashtags</label>
                <Input
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="#hashtag1 #hashtag2 #hashtag3"
                />
              </div>
            </div>
          </div>

          {!caption && !isGenerating && (
            <div className="bg-muted p-4 rounded-lg flex items-center gap-3 text-sm">
              <AlertCircle className="h-5 w-5 text-muted-foreground" />
              <p className="text-muted-foreground">
                Click "Generate Caption" to create AI-powered caption and hashtags for your content.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!caption || isLoading} 
            className="gap-2"
          >
            {isLoading ? 'Saving...' : 'Save Caption'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateCaptionModal;
