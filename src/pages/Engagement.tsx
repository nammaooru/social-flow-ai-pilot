
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MessageCircle, Reply, MessageSquare, Zap, Bot, Filter, Brain, AtSign, Heart, Clock } from 'lucide-react';
import CommentsSection from '@/components/engagement/CommentsSection';
import DirectMessagesSection from '@/components/engagement/DirectMessagesSection';
import ResponseTemplatesSection from '@/components/engagement/ResponseTemplatesSection';
import AutomationRulesSection from '@/components/engagement/AutomationRulesSection';
import { useToast } from '@/hooks/use-toast';

const Engagement = () => {
  const [activeTab, setActiveTab] = useState('comments');
  const { toast } = useToast();
  
  // Auto-response settings state
  const [autoResponseActive, setAutoResponseActive] = useState(true);
  const [aiComments, setAiComments] = useState(true);
  const [aiMessages, setAiMessages] = useState(true);
  const [instantComments, setInstantComments] = useState(true);
  const [instantMessages, setInstantMessages] = useState(true);
  const [autoLike, setAutoLike] = useState(true);
  const [autoFollow, setAutoFollow] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(true);

  const handleAutoResponseChange = (checked: boolean) => {
    setAutoResponseActive(checked);
    toast({
      title: checked ? "Auto-responses activated" : "Auto-responses deactivated",
      description: checked 
        ? "The system will now automatically respond to user engagements" 
        : "Auto-responses have been turned off",
    });
  };

  const handleAiCommentsChange = (checked: boolean) => {
    setAiComments(checked);
    toast({
      title: checked ? "AI comments enabled" : "AI comments disabled",
      description: `AI-powered responses for comments have been ${checked ? 'enabled' : 'disabled'}`,
    });
  };

  const handleAiMessagesChange = (checked: boolean) => {
    setAiMessages(checked);
    toast({
      title: checked ? "AI messages enabled" : "AI messages disabled",
      description: `AI-powered responses for direct messages have been ${checked ? 'enabled' : 'disabled'}`,
    });
  };

  const handleInstantCommentsChange = (checked: boolean) => {
    setInstantComments(checked);
    toast({
      title: checked ? "Instant comments enabled" : "Instant comments disabled",
      description: `Instant responses for comments have been ${checked ? 'enabled' : 'disabled'}`,
    });
  };

  const handleInstantMessagesChange = (checked: boolean) => {
    setInstantMessages(checked);
    toast({
      title: checked ? "Instant messages enabled" : "Instant messages disabled",
      description: `Instant responses for direct messages have been ${checked ? 'enabled' : 'disabled'}`,
    });
  };

  const handleAutoLikeChange = (checked: boolean) => {
    setAutoLike(checked);
    toast({
      title: checked ? "Auto-like enabled" : "Auto-like disabled",
      description: `Automatic liking of comments has been ${checked ? 'enabled' : 'disabled'}`,
    });
  };

  const handleAutoFollowChange = (checked: boolean) => {
    setAutoFollow(checked);
    toast({
      title: checked ? "Auto-follow enabled" : "Auto-follow disabled",
      description: `Automatic following of active users has been ${checked ? 'enabled' : 'disabled'}`,
    });
  };

  const handleShowAiSuggestionsChange = (checked: boolean) => {
    setShowAiSuggestions(checked);
    toast({
      title: checked ? "AI suggestions enabled" : "AI suggestions disabled",
      description: `AI suggestions for responses have been ${checked ? 'enabled' : 'disabled'}`,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Engagement Manager</h1>
        <p className="text-muted-foreground">Monitor and respond to your audience across all platforms.</p>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-[600px] grid-cols-4">
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageCircle size={16} />
              <span className="hidden sm:inline">Comments</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span className="hidden sm:inline">Direct Messages</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Reply size={16} />
              <span className="hidden sm:inline">Response Templates</span>
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Zap size={16} />
              <span className="hidden sm:inline">Automation Rules</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Auto-Response Status</CardTitle>
              <CardDescription>Configure AI-powered auto-responses for your accounts</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="auto-response" 
                checked={autoResponseActive}
                onCheckedChange={handleAutoResponseChange}
              />
              <Label htmlFor="auto-response">Active</Label>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Card className="flex-1">
                <CardHeader className="py-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Bot size={18} />
                    AI-Powered Responses
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-3 pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ai-comments" className="text-sm">Comments</Label>
                      <Switch 
                        id="ai-comments" 
                        checked={aiComments} 
                        onCheckedChange={handleAiCommentsChange}
                        disabled={!autoResponseActive}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ai-messages" className="text-sm">Direct Messages</Label>
                      <Switch 
                        id="ai-messages" 
                        checked={aiMessages}
                        onCheckedChange={handleAiMessagesChange}
                        disabled={!autoResponseActive}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="ai-suggestions" className="text-sm">Show AI Suggestions</Label>
                      <Switch 
                        id="ai-suggestions" 
                        checked={showAiSuggestions}
                        onCheckedChange={handleShowAiSuggestionsChange}
                        disabled={!autoResponseActive}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardHeader className="py-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock size={18} />
                    Response Times
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-3 pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="instant-comments" className="text-sm">Instant Comments</Label>
                      <Switch 
                        id="instant-comments" 
                        checked={instantComments}
                        onCheckedChange={handleInstantCommentsChange}
                        disabled={!autoResponseActive}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="instant-messages" className="text-sm">Instant Messages</Label>
                      <Switch 
                        id="instant-messages" 
                        checked={instantMessages}
                        onCheckedChange={handleInstantMessagesChange}
                        disabled={!autoResponseActive}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardHeader className="py-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Heart size={18} />
                    Auto-Interactions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-3 pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-like" className="text-sm">Auto-Like Comments</Label>
                      <Switch 
                        id="auto-like" 
                        checked={autoLike}
                        onCheckedChange={handleAutoLikeChange}
                        disabled={!autoResponseActive}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-follow" className="text-sm">Auto-Follow Active Users</Label>
                      <Switch 
                        id="auto-follow" 
                        checked={autoFollow}
                        onCheckedChange={handleAutoFollowChange}
                        disabled={!autoResponseActive}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <TabsContent value="comments" className="mt-0">
          <CommentsSection />
        </TabsContent>

        <TabsContent value="messages" className="mt-0">
          <DirectMessagesSection showAiSuggestions={showAiSuggestions} />
        </TabsContent>

        <TabsContent value="templates" className="mt-0">
          <ResponseTemplatesSection />
        </TabsContent>

        <TabsContent value="automation" className="mt-0">
          <AutomationRulesSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Engagement;
