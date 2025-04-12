
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MessageSquare, Save, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GenerateCaptionModalProps {
  content: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const GenerateCaptionModal: React.FC<GenerateCaptionModalProps> = ({ content, open, onOpenChange, onSuccess }) => {
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [savedCaptions, setSavedCaptions] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open && content) {
      loadSavedCaptions();
    }
  }, [open, content]);

  const loadSavedCaptions = async () => {
    if (!content) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('ai_captions')
        .select('*')
        .eq('content_id', content.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSavedCaptions(data || []);
    } catch (error: any) {
      console.error('Error loading captions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateCaption = async () => {
    setIsGenerating(true);
    
    try {
      // In a real app, this would call an AI service
      // For demo purposes, we'll generate a placeholder caption
      setTimeout(() => {
        const demoCaption = `Check out our amazing ${content.content_type === 'image' ? 'photo' : content.content_type}! ${
          content.description ? content.description : ''
        }`;
        
        const demoHashtags = content.tags 
          ? content.tags.map((tag: string) => `#${tag.replace(/\s+/g, '')}`).join(' ') 
          : '#SocialFlow #ContentCreation #SocialMediaMarketing';
        
        setCaption(demoCaption);
        setHashtags(demoHashtags);
        setIsGenerating(false);
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Generation failed",
        description: error.message,
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const saveCaption = async () => {
    if (!caption.trim()) {
      toast({
        title: "Caption required",
        description: "Please generate or enter a caption first.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('ai_captions')
        .insert({
          content_id: content.id,
          caption: caption,
          hashtags: hashtags.split(' ').filter(tag => tag.startsWith('#')),
        });
      
      if (error) throw error;
      
      toast({
        title: "Caption saved",
        description: "Your caption has been saved successfully.",
      });
      
      loadSavedCaptions();
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The caption has been copied to your clipboard.",
    });
  };

  const selectSavedCaption = (savedCaption: any) => {
    setCaption(savedCaption.caption);
    setHashtags(savedCaption.hashtags.join(' '));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Caption Generator
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Generate New Caption</h3>
            
            <Button 
              onClick={generateCaption} 
              disabled={isGenerating}
              variant="outline"
              className="w-full mb-4"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Caption
                </>
              )}
            </Button>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Caption</label>
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Your AI-generated caption will appear here"
                  rows={4}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1.5 block">Hashtags</label>
                <Input
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="#hashtag1 #hashtag2"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="default" 
                  className="flex-1 gap-1"
                  onClick={saveCaption}
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => copyToClipboard(`${caption}\n\n${hashtags}`)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Saved Captions</h3>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : savedCaptions.length === 0 ? (
              <div className="text-center py-10 border rounded-lg">
                <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No saved captions yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {savedCaptions.map((saved, index) => (
                  <Card 
                    key={index} 
                    className="p-3 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => selectSavedCaption(saved)}
                  >
                    <p className="text-sm line-clamp-2 mb-2">{saved.caption}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {saved.hashtags.slice(0, 3).map((tag: string, i: number) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          {tag}
                        </span>
                      ))}
                      {saved.hashtags.length > 3 && (
                        <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
                          +{saved.hashtags.length - 3}
                        </span>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateCaptionModal;
