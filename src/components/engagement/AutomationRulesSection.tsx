
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Plus, Zap, AlertTriangle, Check, Settings, Clock, Edit, Trash, 
  MessageCircle, Timer, Eye, MoreHorizontal, Filter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Mock data for automation rules
const automationRules = [
  {
    id: '1',
    name: 'Auto-Response to Product Questions',
    description: 'Automatically reply to comments asking about product availability',
    platform: 'all',
    contentType: 'comment',
    trigger: 'keyword',
    triggerValue: ['available', 'in stock', 'when will', 'do you have'],
    action: 'reply',
    isActive: true,
    responseTemplate: 'Product Inquiry Response',
    schedule: 'instant'
  },
  {
    id: '2',
    name: 'Thank Positive Comments',
    description: 'Thank users for positive comments on all platforms',
    platform: 'all',
    contentType: 'comment',
    trigger: 'sentiment',
    triggerValue: 'positive',
    action: 'reply',
    isActive: true,
    responseTemplate: 'Positive Feedback Response',
    schedule: 'instant'
  },
  {
    id: '3',
    name: 'Customer Support Escalation',
    description: 'Flag negative comments and direct messages for review',
    platform: 'all',
    contentType: 'all',
    trigger: 'sentiment',
    triggerValue: 'negative',
    action: 'flag',
    isActive: true,
    responseTemplate: null,
    schedule: null
  },
  {
    id: '4',
    name: 'Auto-Like Positive Comments',
    description: 'Automatically like comments with positive sentiment',
    platform: 'instagram',
    contentType: 'comment',
    trigger: 'sentiment',
    triggerValue: 'positive',
    action: 'like',
    isActive: false,
    responseTemplate: null,
    schedule: 'delay_5min'
  },
  {
    id: '5',
    name: 'Business Hours Auto-Response',
    description: 'Send an after-hours message to direct messages received outside business hours',
    platform: 'all',
    contentType: 'message',
    trigger: 'time',
    triggerValue: 'outside_hours',
    action: 'reply',
    isActive: false,
    responseTemplate: 'After Hours Response',
    schedule: 'instant'
  }
];

const platforms = {
  all: 'All Platforms',
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'Twitter',
  linkedin: 'LinkedIn'
};

const contentTypes = {
  all: 'All Content',
  comment: 'Comments',
  message: 'Direct Messages'
};

const AutomationRulesSection = () => {
  const [rules, setRules] = useState(automationRules);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    platform: 'all',
    contentType: 'comment',
    trigger: 'keyword',
    triggerValue: '',
    action: 'reply',
    responseTemplate: '',
    schedule: 'instant',
    isActive: true
  });

  const handleToggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? {...rule, isActive: !rule.isActive} : rule
    ));
  };

  const handleEditRule = (id: string) => {
    const rule = rules.find(r => r.id === id);
    if (rule) {
      setEditingRule(id);
      setFormData({
        name: rule.name,
        description: rule.description,
        platform: rule.platform,
        contentType: rule.contentType,
        trigger: rule.trigger,
        triggerValue: Array.isArray(rule.triggerValue) ? rule.triggerValue.join(', ') : rule.triggerValue,
        action: rule.action,
        responseTemplate: rule.responseTemplate || '',
        schedule: rule.schedule || 'instant',
        isActive: rule.isActive
      });
      setShowForm(true);
    }
  };

  const handleNewRule = () => {
    setEditingRule(null);
    setFormData({
      name: '',
      description: '',
      platform: 'all',
      contentType: 'comment',
      trigger: 'keyword',
      triggerValue: '',
      action: 'reply',
      responseTemplate: '',
      schedule: 'instant',
      isActive: true
    });
    setShowForm(true);
  };

  const handleSaveRule = () => {
    // In a real implementation, this would save to an API
    console.log('Saving rule:', formData);
    setShowForm(false);
    setEditingRule(null);
  };

  const handleCancelEdit = () => {
    setShowForm(false);
    setEditingRule(null);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <CardTitle>Automation Rules</CardTitle>
              <CardDescription>Configure automated responses and actions for your social media</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button onClick={handleNewRule}>
                <Plus className="h-4 w-4 mr-2" />
                New Rule
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <Card key={rule.id} className="border">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Zap className={`h-5 w-5 ${rule.isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                        <h3 className="font-medium">{rule.name}</h3>
                        <Badge variant={rule.isActive ? 'default' : 'outline'}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{rule.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2 md:space-x-4">
                      <div className="hidden md:flex items-center">
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={() => handleToggleRule(rule.id)}
                          id={`toggle-${rule.id}`}
                        />
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditRule(rule.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Activity
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted rounded-md p-3">
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
                        When
                      </h4>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Platform: <span className="text-foreground">{platforms[rule.platform]}</span></p>
                        <p className="text-muted-foreground">Content: <span className="text-foreground">{contentTypes[rule.contentType]}</span></p>
                        <p className="text-muted-foreground">Trigger: <span className="text-foreground">
                          {rule.trigger === 'keyword' ? 'Contains keywords' : 
                           rule.trigger === 'sentiment' ? 'Has sentiment' :
                           rule.trigger === 'time' ? 'Time-based' : rule.trigger}
                        </span></p>
                        {Array.isArray(rule.triggerValue) ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {rule.triggerValue.map((val, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{val}</Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">Value: <span className="text-foreground">{rule.triggerValue}</span></p>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-muted rounded-md p-3">
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Zap className="h-4 w-4 mr-2 text-muted-foreground" />
                        Then
                      </h4>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Action: <span className="text-foreground">
                          {rule.action === 'reply' ? 'Send response' : 
                           rule.action === 'flag' ? 'Flag for review' :
                           rule.action === 'like' ? 'Like content' : rule.action}
                        </span></p>
                        {rule.responseTemplate && (
                          <p className="text-muted-foreground">Template: <span className="text-foreground">{rule.responseTemplate}</span></p>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-muted rounded-md p-3">
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        Schedule
                      </h4>
                      <div className="text-sm">
                        {rule.schedule ? (
                          <p className="text-muted-foreground">Timing: <span className="text-foreground">
                            {rule.schedule === 'instant' ? 'Instant response' : 
                             rule.schedule === 'delay_5min' ? '5 minute delay' :
                             rule.schedule === 'business_hours' ? 'Business hours only' : rule.schedule}
                          </span></p>
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
        </CardContent>
      </Card>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingRule ? 'Edit Automation Rule' : 'New Automation Rule'}</CardTitle>
            <CardDescription>
              Configure when and how to automatically respond to social media interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-name">Rule Name</Label>
                  <Input
                    id="rule-name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="E.g., Auto-Response to Product Questions"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rule-active">Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="rule-active"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                    />
                    <Label htmlFor="rule-active">{formData.isActive ? 'Active' : 'Inactive'}</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rule-description">Description</Label>
                <Textarea
                  id="rule-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of what this rule does"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-platform">Platform</Label>
                  <Select 
                    value={formData.platform} 
                    onValueChange={(value) => setFormData({...formData, platform: value})}
                  >
                    <SelectTrigger id="rule-platform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rule-content-type">Content Type</Label>
                  <Select 
                    value={formData.contentType} 
                    onValueChange={(value) => setFormData({...formData, contentType: value})}
                  >
                    <SelectTrigger id="rule-content-type">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Content</SelectItem>
                      <SelectItem value="comment">Comments</SelectItem>
                      <SelectItem value="message">Direct Messages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />
              
              <h3 className="font-medium">When</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-trigger">Trigger Type</Label>
                  <Select 
                    value={formData.trigger} 
                    onValueChange={(value) => setFormData({...formData, trigger: value})}
                  >
                    <SelectTrigger id="rule-trigger">
                      <SelectValue placeholder="Select trigger" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="keyword">Contains Keywords</SelectItem>
                      <SelectItem value="sentiment">Has Sentiment</SelectItem>
                      <SelectItem value="time">Time-Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  {formData.trigger === 'keyword' ? (
                    <>
                      <Label htmlFor="rule-keywords">Keywords (comma separated)</Label>
                      <Input
                        id="rule-keywords"
                        value={formData.triggerValue}
                        onChange={(e) => setFormData({...formData, triggerValue: e.target.value})}
                        placeholder="E.g., product, price, available"
                      />
                    </>
                  ) : formData.trigger === 'sentiment' ? (
                    <>
                      <Label htmlFor="rule-sentiment">Sentiment</Label>
                      <Select 
                        value={formData.triggerValue as string} 
                        onValueChange={(value) => setFormData({...formData, triggerValue: value})}
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
                  ) : (
                    <>
                      <Label htmlFor="rule-time">Time Condition</Label>
                      <Select 
                        value={formData.triggerValue as string} 
                        onValueChange={(value) => setFormData({...formData, triggerValue: value})}
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
                  )}
                </div>
              </div>

              <Separator />
              
              <h3 className="font-medium">Then</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-action">Action</Label>
                  <Select 
                    value={formData.action} 
                    onValueChange={(value) => setFormData({...formData, action: value})}
                  >
                    <SelectTrigger id="rule-action">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reply">Send Response</SelectItem>
                      <SelectItem value="flag">Flag for Review</SelectItem>
                      <SelectItem value="like">Like Content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.action === 'reply' && (
                  <div className="space-y-2">
                    <Label htmlFor="rule-template">Response Template</Label>
                    <Select 
                      value={formData.responseTemplate} 
                      onValueChange={(value) => setFormData({...formData, responseTemplate: value})}
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
              </div>

              {formData.action === 'reply' && (
                <>
                  <Separator />
                  
                  <h3 className="font-medium">Schedule</h3>
                  <div className="space-y-2">
                    <Label htmlFor="rule-schedule">Response Timing</Label>
                    <Select 
                      value={formData.schedule} 
                      onValueChange={(value) => setFormData({...formData, schedule: value})}
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
                </>
              )}
              
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                <Button onClick={handleSaveRule}>Save Rule</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AutomationRulesSection;
