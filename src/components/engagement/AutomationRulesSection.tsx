
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, Edit, Trash2, Play, Pause, Copy, Settings, 
  MessageSquare, Heart, Reply, Share, Clock, Zap, Filter, Bot
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for automation rules
const automationRules = [
  {
    id: '1',
    name: 'Welcome New Followers',
    platforms: ['Instagram', 'Twitter'],
    trigger: 'new_follower',
    action: 'send_message',
    message: 'Thanks for following! 🎉',
    isActive: true,
    created: '2024-01-15',
    lastRun: '2 hours ago',
    timesTriggered: 47
  },
  {
    id: '2',
    name: 'Auto-like Comments',
    platforms: ['Facebook', 'Instagram'],
    trigger: 'new_comment',
    action: 'like_comment',
    message: '',
    isActive: true,
    created: '2024-01-10',
    lastRun: '5 minutes ago',
    timesTriggered: 234
  },
  {
    id: '3',
    name: 'Respond to Mentions',
    platforms: ['Twitter', 'LinkedIn'],
    trigger: 'mention',
    action: 'auto_reply',
    message: 'Thanks for mentioning us! We appreciate your support.',
    isActive: false,
    created: '2024-01-08',
    lastRun: '1 day ago',
    timesTriggered: 12
  }
];

const availablePlatforms = [
  { id: 'instagram', name: 'Instagram', color: 'bg-pink-500' },
  { id: 'facebook', name: 'Facebook', color: 'bg-blue-600' },
  { id: 'twitter', name: 'Twitter', color: 'bg-blue-400' },
  { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-800' },
  { id: 'tiktok', name: 'TikTok', color: 'bg-black' },
  { id: 'youtube', name: 'YouTube', color: 'bg-red-600' }
];

const AutomationRulesSection = () => {
  const [rules, setRules] = useState(automationRules);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [activeTab, setActiveTab] = useState('rules');
  
  // New rule form state
  const [newRule, setNewRule] = useState({
    name: '',
    platforms: [],
    trigger: '',
    action: '',
    message: '',
    conditions: []
  });
  
  const { toast } = useToast();

  const handleCreateRule = () => {
    if (!newRule.name || newRule.platforms.length === 0 || !newRule.trigger || !newRule.action) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const rule = {
      id: (rules.length + 1).toString(),
      name: newRule.name,
      platforms: newRule.platforms,
      trigger: newRule.trigger,
      action: newRule.action,
      message: newRule.message,
      isActive: true,
      created: new Date().toISOString().split('T')[0],
      lastRun: 'Never',
      timesTriggered: 0
    };

    setRules([...rules, rule]);
    setNewRule({
      name: '',
      platforms: [],
      trigger: '',
      action: '',
      message: '',
      conditions: []
    });
    setShowCreateDialog(false);
    
    toast({
      title: "Automation rule created",
      description: `"${rule.name}" has been created successfully`,
    });
  };

  const toggleRule = (ruleId) => {
    setRules(rules.map(rule => 
      rule.id === ruleId 
        ? { ...rule, isActive: !rule.isActive }
        : rule
    ));
    
    const rule = rules.find(r => r.id === ruleId);
    toast({
      title: rule?.isActive ? "Rule deactivated" : "Rule activated",
      description: `"${rule?.name}" is now ${rule?.isActive ? 'inactive' : 'active'}`,
    });
  };

  const deleteRule = (ruleId) => {
    const rule = rules.find(r => r.id === ruleId);
    setRules(rules.filter(rule => rule.id !== ruleId));
    
    toast({
      title: "Rule deleted",
      description: `"${rule?.name}" has been deleted`,
    });
  };

  const handlePlatformToggle = (platformId) => {
    setNewRule(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Automation Rules</h3>
          <p className="text-sm text-muted-foreground">Set up automated responses and actions</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              New Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Automation Rule</DialogTitle>
              <DialogDescription>
                Set up automated responses and actions for your social media accounts
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Setup</TabsTrigger>
                <TabsTrigger value="platforms">Platforms</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="rule-name">Rule Name</Label>
                    <Input
                      id="rule-name"
                      placeholder="e.g., Welcome New Followers"
                      value={newRule.name}
                      onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="trigger">Trigger</Label>
                      <Select value={newRule.trigger} onValueChange={(value) => setNewRule({...newRule, trigger: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select trigger" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new_follower">New Follower</SelectItem>
                          <SelectItem value="new_comment">New Comment</SelectItem>
                          <SelectItem value="mention">Mention</SelectItem>
                          <SelectItem value="dm_received">DM Received</SelectItem>
                          <SelectItem value="post_engagement">Post Engagement</SelectItem>
                          <SelectItem value="hashtag_mention">Hashtag Mention</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="action">Action</Label>
                      <Select value={newRule.action} onValueChange={(value) => setNewRule({...newRule, action: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="send_message">Send Message</SelectItem>
                          <SelectItem value="auto_reply">Auto Reply</SelectItem>
                          <SelectItem value="like_comment">Like Comment</SelectItem>
                          <SelectItem value="follow_back">Follow Back</SelectItem>
                          <SelectItem value="add_to_list">Add to List</SelectItem>
                          <SelectItem value="send_email">Send Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {(newRule.action === 'send_message' || newRule.action === 'auto_reply') && (
                    <div>
                      <Label htmlFor="message">Message Template</Label>
                      <Textarea
                        id="message"
                        placeholder="Enter your automated message..."
                        value={newRule.message}
                        onChange={(e) => setNewRule({...newRule, message: e.target.value})}
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="platforms" className="space-y-4">
                <div>
                  <Label>Select Platforms (Multiple Selection Enabled)</Label>
                  <p className="text-sm text-muted-foreground mb-3">Choose which platforms this rule should apply to</p>
                  <div className="grid grid-cols-2 gap-3">
                    {availablePlatforms.map((platform) => (
                      <div key={platform.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={platform.id}
                          checked={newRule.platforms.includes(platform.name)}
                          onCheckedChange={() => handlePlatformToggle(platform.name)}
                        />
                        <label
                          htmlFor={platform.id}
                          className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          <div className={`h-3 w-3 rounded-full ${platform.color}`}></div>
                          <span>{platform.name}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  {newRule.platforms.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Selected platforms:</p>
                      <div className="flex flex-wrap gap-2">
                        {newRule.platforms.map((platform) => (
                          <Badge key={platform} variant="secondary">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4">
                <div>
                  <Label>Advanced Conditions</Label>
                  <p className="text-sm text-muted-foreground mb-3">Set additional conditions for when this rule should trigger</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="time-condition" />
                      <label htmlFor="time-condition" className="text-sm">Only run during business hours</label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="frequency-condition" />
                      <label htmlFor="frequency-condition" className="text-sm">Limit to once per user per day</label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="keyword-condition" />
                      <label htmlFor="keyword-condition" className="text-sm">Only for messages containing specific keywords</label>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRule}>
                Create Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="rules">Active Rules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid gap-4">
            {rules.map((rule) => (
              <Card key={rule.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{rule.name}</h4>
                        <div className="flex gap-1">
                          {rule.platforms.map((platform) => {
                            const platformConfig = availablePlatforms.find(p => p.name === platform);
                            return (
                              <Badge key={platform} variant="outline" className="text-xs">
                                <div className={`h-2 w-2 rounded-full mr-1 ${platformConfig?.color || 'bg-gray-400'}`}></div>
                                {platform}
                              </Badge>
                            );
                          })}
                        </div>
                        <Badge variant={rule.isActive ? "default" : "secondary"}>
                          {rule.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Trigger:</span> {rule.trigger.replace('_', ' ')}
                        </div>
                        <div>
                          <span className="font-medium">Action:</span> {rule.action.replace('_', ' ')}
                        </div>
                        <div>
                          <span className="font-medium">Times triggered:</span> {rule.timesTriggered}
                        </div>
                      </div>
                      
                      {rule.message && (
                        <div className="mt-2 p-2 bg-muted rounded text-sm">
                          <span className="font-medium">Message:</span> {rule.message}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => deleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{rules.length}</div>
                <p className="text-xs text-muted-foreground">
                  {rules.filter(r => r.isActive).length} active
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Triggers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {rules.reduce((sum, rule) => sum + rule.timesTriggered, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  This month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">
                  Successful executions
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Pre-built automation rule templates will be available here.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AutomationRulesSection;
