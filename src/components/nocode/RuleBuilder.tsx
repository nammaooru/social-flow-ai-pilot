
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  AlertCircle, 
  ArrowDown, 
  ArrowRight, 
  Check, 
  Clock, 
  Edit, 
  Flag, 
  Heart, 
  MessageCircle, 
  PlusCircle, 
  Settings, 
  Trash, 
  Zap 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface Rule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  platform: string;
  contentType: string;
  triggerType: string;
  triggerValue: string | string[];
  action: string;
  actionValue?: string;
  schedule?: string;
}

// Example rules
const exampleRules = [
  {
    id: '1',
    name: 'Auto-Response to Product Questions',
    description: 'Automatically reply to comments asking about product availability',
    isActive: true,
    platform: 'all',
    contentType: 'comment',
    triggerType: 'keyword',
    triggerValue: ['available', 'in stock', 'when will', 'do you have'],
    action: 'reply',
    actionValue: 'Product Inquiry Response',
    schedule: 'instant'
  },
  {
    id: '2',
    name: 'Thank Positive Comments',
    description: 'Thank users for positive comments on all platforms',
    isActive: true,
    platform: 'all',
    contentType: 'comment',
    triggerType: 'sentiment',
    triggerValue: 'positive',
    action: 'reply',
    actionValue: 'Positive Feedback Response',
    schedule: 'instant'
  },
  {
    id: '3',
    name: 'Customer Support Escalation',
    description: 'Flag negative comments and direct messages for review',
    isActive: false,
    platform: 'all',
    contentType: 'all',
    triggerType: 'sentiment',
    triggerValue: 'negative',
    action: 'flag',
    schedule: null
  }
];

const platforms = [
  { id: 'all', name: 'All Platforms' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'twitter', name: 'Twitter' },
  { id: 'linkedin', name: 'LinkedIn' }
];

const contentTypes = [
  { id: 'all', name: 'All Content' },
  { id: 'comment', name: 'Comments' },
  { id: 'message', name: 'Direct Messages' },
  { id: 'mention', name: 'Mentions' }
];

const triggerTypes = [
  { id: 'keyword', name: 'Contains Keywords' },
  { id: 'sentiment', name: 'Has Sentiment' },
  { id: 'time', name: 'Time-Based' },
  { id: 'user', name: 'User Type' }
];

const actionTypes = [
  { id: 'reply', name: 'Send Response', description: 'Reply with a template' },
  { id: 'flag', name: 'Flag for Review', description: 'Mark for manual review' },
  { id: 'like', name: 'Like Content', description: 'Automatically like the content' },
  { id: 'tag', name: 'Add Tag', description: 'Add a tag to the content' },
  { id: 'assign', name: 'Assign to Team Member', description: 'Assign to someone on your team' },
];

const RuleBuilder = () => {
  const [rules, setRules] = useState<Rule[]>(exampleRules);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const { toast } = useToast();

  const handleToggleRule = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? {...rule, isActive: !rule.isActive} : rule
    ));
    
    toast({
      title: "Rule status updated",
      description: `Rule has been ${rules.find(r => r.id === ruleId)?.isActive ? 'deactivated' : 'activated'}.`,
    });
  };

  const handleCreateRule = () => {
    setIsCreating(true);
    setEditingRule({
      id: String(Date.now()),
      name: '',
      description: '',
      isActive: true,
      platform: 'all',
      contentType: 'comment',
      triggerType: 'keyword',
      triggerValue: '',
      action: 'reply'
    });
  };

  const handleEditRule = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      setEditingRule({...rule});
      setIsCreating(false);
    }
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
    
    toast({
      title: "Rule deleted",
      description: "The automation rule has been removed.",
    });
  };

  const handleSaveRule = () => {
    if (!editingRule) return;
    
    if (!editingRule.name.trim()) {
      toast({
        title: "Error",
        description: "Rule name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (isCreating) {
      setRules([...rules, editingRule]);
    } else {
      setRules(rules.map(r => 
        r.id === editingRule.id ? editingRule : r
      ));
    }
    
    setEditingRule(null);
    setIsCreating(false);
    toast({
      title: "Rule saved",
      description: "Your automation rule has been saved successfully.",
    });
  };

  const handleTriggerValueChange = (value: string) => {
    if (!editingRule) return;
    
    if (editingRule.triggerType === 'keyword') {
      // For keywords, split by comma and trim
      const keywords = value.split(',').map(k => k.trim()).filter(Boolean);
      setEditingRule({...editingRule, triggerValue: keywords});
    } else {
      // For other trigger types, just use the value directly
      setEditingRule({...editingRule, triggerValue: value});
    }
  };

  const getTriggerValueString = (triggerValue: string | string[]): string => {
    if (Array.isArray(triggerValue)) {
      return triggerValue.join(', ');
    }
    return triggerValue;
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'reply': return <MessageCircle className="h-4 w-4" />;
      case 'flag': return <Flag className="h-4 w-4" />;
      case 'like': return <Heart className="h-4 w-4" />;
      case 'tag': return <Settings className="h-4 w-4" />;
      case 'assign': return <Settings className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {!editingRule ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Automation Rules</h2>
            <Button onClick={handleCreateRule} className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Rule
            </Button>
          </div>
          
          {rules.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No automation rules</h3>
              <p className="text-muted-foreground text-center mb-4 max-w-md">
                Create your first automation rule to handle social media interactions automatically.
              </p>
              <Button onClick={handleCreateRule}>Create Your First Rule</Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {rules.map((rule) => (
                <Card key={rule.id} className={cn(!rule.isActive && "opacity-70")}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className={`h-5 w-5 ${rule.isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                          <h3 className="font-medium text-lg">{rule.name}</h3>
                          <Badge variant={rule.isActive ? 'default' : 'outline'}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{rule.description}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={() => handleToggleRule(rule.id)}
                          aria-label={`Toggle ${rule.name}`}
                        />
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditRule(rule.id)}>
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteRule(rule.id)}
                            className="text-destructive"
                          >
                            <Trash className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                          <Settings className="h-4 w-4 text-muted-foreground" />
                          When
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Platform:</span>
                            <span>{platforms.find(p => p.id === rule.platform)?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Content:</span>
                            <span>{contentTypes.find(t => t.id === rule.contentType)?.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Trigger:</span>
                            <span>{triggerTypes.find(t => t.id === rule.triggerType)?.name}</span>
                          </div>
                          
                          {Array.isArray(rule.triggerValue) ? (
                            <div className="pt-1">
                              <span className="text-muted-foreground block mb-1">Values:</span>
                              <div className="flex flex-wrap gap-1">
                                {rule.triggerValue.map((val, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {val}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Value:</span>
                              <span>{rule.triggerValue}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          Then
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Action:</span>
                            <div className="flex items-center gap-1">
                              {getActionIcon(rule.action)}
                              <span>{actionTypes.find(a => a.id === rule.action)?.name}</span>
                            </div>
                          </div>
                          
                          {rule.actionValue && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Using:</span>
                              <span>{rule.actionValue}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          Schedule
                        </h4>
                        <div className="text-sm">
                          {rule.schedule ? (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Timing:</span>
                              <span className="capitalize">
                                {rule.schedule === 'instant' ? 'Immediate response' : rule.schedule}
                              </span>
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No timing configuration</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? "Create New Rule" : "Edit Rule"}</CardTitle>
            <CardDescription>
              Configure when and how to automatically respond to social media interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rule-name">Rule Name</Label>
                <Input
                  id="rule-name"
                  value={editingRule.name}
                  onChange={(e) => setEditingRule({...editingRule, name: e.target.value})}
                  placeholder="E.g., Auto-Response to Product Questions"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rule-active">Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="rule-active"
                    checked={editingRule.isActive}
                    onCheckedChange={(checked) => setEditingRule({...editingRule, isActive: checked})}
                  />
                  <Label htmlFor="rule-active">{editingRule.isActive ? 'Active' : 'Inactive'}</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rule-description">Description</Label>
              <Textarea
                id="rule-description"
                value={editingRule.description}
                onChange={(e) => setEditingRule({...editingRule, description: e.target.value})}
                placeholder="Brief description of what this rule does"
                rows={2}
              />
            </div>

            <Accordion type="single" collapsible defaultValue="when" className="w-full">
              <AccordionItem value="when">
                <AccordionTrigger className="py-4">
                  <span className="flex items-center gap-2 text-base">
                    <Settings className="h-5 w-5" />
                    When
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="rule-platform">Platform</Label>
                      <Select 
                        value={editingRule.platform} 
                        onValueChange={(value) => setEditingRule({...editingRule, platform: value})}
                      >
                        <SelectTrigger id="rule-platform">
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {platforms.map(platform => (
                            <SelectItem key={platform.id} value={platform.id}>
                              {platform.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rule-content-type">Content Type</Label>
                      <Select 
                        value={editingRule.contentType} 
                        onValueChange={(value) => setEditingRule({...editingRule, contentType: value})}
                      >
                        <SelectTrigger id="rule-content-type">
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          {contentTypes.map(contentType => (
                            <SelectItem key={contentType.id} value={contentType.id}>
                              {contentType.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="rule-trigger">Trigger Type</Label>
                      <Select 
                        value={editingRule.triggerType} 
                        onValueChange={(value) => setEditingRule({...editingRule, triggerType: value, triggerValue: ''})}
                      >
                        <SelectTrigger id="rule-trigger">
                          <SelectValue placeholder="Select trigger" />
                        </SelectTrigger>
                        <SelectContent>
                          {triggerTypes.map(triggerType => (
                            <SelectItem key={triggerType.id} value={triggerType.id}>
                              {triggerType.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      {editingRule.triggerType === 'keyword' ? (
                        <>
                          <Label htmlFor="rule-keywords">Keywords (comma separated)</Label>
                          <Input
                            id="rule-keywords"
                            value={getTriggerValueString(editingRule.triggerValue)}
                            onChange={(e) => handleTriggerValueChange(e.target.value)}
                            placeholder="E.g., product, price, available"
                          />
                        </>
                      ) : editingRule.triggerType === 'sentiment' ? (
                        <>
                          <Label htmlFor="rule-sentiment">Sentiment</Label>
                          <Select 
                            value={getTriggerValueString(editingRule.triggerValue)}
                            onValueChange={(value) => handleTriggerValueChange(value)}
                          >
                            <SelectTrigger id="rule-sentiment">
                              <SelectValue placeholder="Select sentiment" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="positive">Positive</SelectItem>
                              <SelectItem value="negative">Negative</SelectItem>
                              <SelectItem value="neutral">Neutral</SelectItem>
                            </SelectContent>
                          </Select>
                        </>
                      ) : editingRule.triggerType === 'time' ? (
                        <>
                          <Label htmlFor="rule-time">Time Condition</Label>
                          <Select 
                            value={getTriggerValueString(editingRule.triggerValue)}
                            onValueChange={(value) => handleTriggerValueChange(value)}
                          >
                            <SelectTrigger id="rule-time">
                              <SelectValue placeholder="Select time condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="outside_hours">Outside Business Hours</SelectItem>
                              <SelectItem value="weekends">Weekends Only</SelectItem>
                              <SelectItem value="business_hours">Business Hours Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </>
                      ) : (
                        <>
                          <Label htmlFor="rule-user">User Type</Label>
                          <Select 
                            value={getTriggerValueString(editingRule.triggerValue)}
                            onValueChange={(value) => handleTriggerValueChange(value)}
                          >
                            <SelectTrigger id="rule-user">
                              <SelectValue placeholder="Select user type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new_follower">New Followers</SelectItem>
                              <SelectItem value="returning">Returning Users</SelectItem>
                              <SelectItem value="high_engagement">High Engagement Users</SelectItem>
                              <SelectItem value="verified">Verified Accounts</SelectItem>
                            </SelectContent>
                          </Select>
                        </>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="then">
                <AccordionTrigger className="py-4">
                  <span className="flex items-center gap-2 text-base">
                    <ArrowDown className="h-5 w-5" />
                    Then
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="rule-action">Action</Label>
                      <Select 
                        value={editingRule.action} 
                        onValueChange={(value) => setEditingRule({...editingRule, action: value})}
                      >
                        <SelectTrigger id="rule-action">
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          {actionTypes.map(actionType => (
                            <SelectItem key={actionType.id} value={actionType.id}>
                              {actionType.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        {actionTypes.find(a => a.id === editingRule.action)?.description || "Select an action to see description"}
                      </p>
                    </div>
                    
                    {editingRule.action === 'reply' && (
                      <div className="space-y-2">
                        <Label htmlFor="rule-template">Response Template</Label>
                        <Select 
                          value={editingRule.actionValue} 
                          onValueChange={(value) => setEditingRule({...editingRule, actionValue: value})}
                        >
                          <SelectTrigger id="rule-template">
                            <SelectValue placeholder="Select template" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Positive Feedback Response">Positive Feedback Response</SelectItem>
                            <SelectItem value="Product Inquiry Response">Product Inquiry Response</SelectItem>
                            <SelectItem value="Customer Service Complaint">Customer Service Complaint</SelectItem>
                            <SelectItem value="After Hours Response">After Hours Response</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {editingRule.action === 'tag' && (
                      <div className="space-y-2">
                        <Label htmlFor="rule-tag">Tag</Label>
                        <Select 
                          value={editingRule.actionValue} 
                          onValueChange={(value) => setEditingRule({...editingRule, actionValue: value})}
                        >
                          <SelectTrigger id="rule-tag">
                            <SelectValue placeholder="Select tag" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="product-inquiry">Product Inquiry</SelectItem>
                            <SelectItem value="positive-feedback">Positive Feedback</SelectItem>
                            <SelectItem value="complaint">Complaint</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {editingRule.action === 'assign' && (
                      <div className="space-y-2">
                        <Label htmlFor="rule-assign">Assign To</Label>
                        <Select 
                          value={editingRule.actionValue} 
                          onValueChange={(value) => setEditingRule({...editingRule, actionValue: value})}
                        >
                          <SelectTrigger id="rule-assign">
                            <SelectValue placeholder="Select team member" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="john">John Smith</SelectItem>
                            <SelectItem value="sarah">Sarah Johnson</SelectItem>
                            <SelectItem value="mike">Mike Williams</SelectItem>
                            <SelectItem value="team_lead">Team Lead</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {editingRule.action === 'reply' && (
                <AccordionItem value="schedule">
                  <AccordionTrigger className="py-4">
                    <span className="flex items-center gap-2 text-base">
                      <Clock className="h-5 w-5" />
                      Schedule
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="rule-schedule">Response Timing</Label>
                        <Select 
                          value={editingRule.schedule || 'instant'} 
                          onValueChange={(value) => setEditingRule({...editingRule, schedule: value})}
                        >
                          <SelectTrigger id="rule-schedule">
                            <SelectValue placeholder="Select timing" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instant">Instant Response</SelectItem>
                            <SelectItem value="delay_5min">5 Minute Delay</SelectItem>
                            <SelectItem value="delay_1hr">1 Hour Delay</SelectItem>
                            <SelectItem value="business_hours">During Business Hours Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="rule-optimize" />
                        <Label htmlFor="rule-optimize">
                          Optimize response timing based on past interactions
                        </Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button 
              variant="outline"
              onClick={() => {
                setEditingRule(null);
                setIsCreating(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveRule} className="gap-2">
              <Check className="h-4 w-4" />
              {isCreating ? 'Create Rule' : 'Save Changes'}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default RuleBuilder;
