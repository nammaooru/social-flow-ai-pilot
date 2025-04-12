
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Plus, Pencil, Trash, Copy, Reply, MessageCircle, MessageSquare, 
  FileText, Smile, Frown, Search, Filter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for response templates
const templates = [
  {
    id: '1',
    name: 'Positive Feedback Response',
    content: "Thank you so much for your positive feedback! We're thrilled to hear you're enjoying our products. Your support means a lot to us!",
    type: 'comment',
    triggers: ['thank you', 'love it', 'great', 'amazing'],
    sentiment: 'positive'
  },
  {
    id: '2',
    name: 'Product Inquiry Response',
    content: "Thank you for your interest in our products! We offer a variety of options to suit different needs. Could you please let us know more specifically what you're looking for so we can provide the best information?",
    type: 'message',
    triggers: ['product', 'looking for', 'available', 'have in stock'],
    sentiment: 'neutral'
  },
  {
    id: '3',
    name: 'Customer Service Complaint',
    content: "We sincerely apologize for the inconvenience you've experienced. We take all feedback seriously and would like to make this right. Please DM us with your order details, and a member of our customer service team will assist you promptly.",
    type: 'comment',
    triggers: ['disappointed', 'unhappy', 'issue', 'problem', 'not working'],
    sentiment: 'negative'
  },
  {
    id: '4',
    name: 'Shipping Query Response',
    content: "Thank you for your order! Shipping usually takes 3-5 business days for domestic orders and 7-14 days for international shipments. If you'd like to track your package, please use the tracking number provided in your shipping confirmation email.",
    type: 'message',
    triggers: ['shipping', 'delivery', 'when will', 'track', 'arrived'],
    sentiment: 'neutral'
  },
  {
    id: '5',
    name: 'Out of Stock Response',
    content: "Thank you for your interest in this item! Unfortunately, it's currently out of stock. We expect to restock within the next 2-3 weeks. Would you like us to notify you when it's available again?",
    type: 'message',
    triggers: ['out of stock', 'available', 'when will', 'in stock'],
    sentiment: 'neutral'
  }
];

const sentimentIcons = {
  positive: <Smile className="h-4 w-4 text-green-500" />,
  neutral: <MessageCircle className="h-4 w-4 text-blue-500" />,
  negative: <Frown className="h-4 w-4 text-red-500" />
};

const typeIcons = {
  comment: <MessageCircle className="h-4 w-4" />,
  message: <MessageSquare className="h-4 w-4" />
};

const ResponseTemplatesSection = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [templateData, setTemplateData] = useState({
    name: '',
    content: '',
    type: 'comment',
    triggers: '',
    sentiment: 'neutral'
  });

  const filteredTemplates = templates.filter(template => {
    if (activeTab !== 'all' && template.type !== activeTab) {
      return false;
    }
    
    if (searchQuery && !template.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleNewTemplate = () => {
    setSelectedTemplate(null);
    setEditMode(true);
    setTemplateData({
      name: '',
      content: '',
      type: 'comment',
      triggers: '',
      sentiment: 'neutral'
    });
  };

  const handleEditTemplate = (id: string) => {
    const template = templates.find(t => t.id === id);
    if (template) {
      setSelectedTemplate(id);
      setEditMode(true);
      setTemplateData({
        name: template.name,
        content: template.content,
        type: template.type,
        triggers: template.triggers.join(', '),
        sentiment: template.sentiment
      });
    }
  };

  const handleSaveTemplate = () => {
    // In a real implementation, this would save to an API
    console.log('Saving template:', templateData);
    setEditMode(false);
    setSelectedTemplate(null);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <CardTitle>Response Templates</CardTitle>
              <CardDescription>Create and manage templates for automated responses</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative flex items-center">
                <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full md:w-auto max-w-[200px]"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button onClick={handleNewTemplate}>
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="comment">Comment Responses</TabsTrigger>
              <TabsTrigger value="message">Message Responses</TabsTrigger>
            </TabsList>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="border hover:border-primary/50 cursor-pointer">
                  <CardHeader className="p-4 pb-0">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {typeIcons[template.type]}
                        <CardTitle className="text-base">{template.name}</CardTitle>
                      </div>
                      {sentimentIcons[template.sentiment]}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-28 overflow-hidden text-sm text-muted-foreground mb-4">
                      {template.content.substring(0, 150)}
                      {template.content.length > 150 && '...'}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {template.triggers.map((trigger, index) => (
                        <Badge key={index} variant="outline">{trigger}</Badge>
                      ))}
                    </div>
                    <div className="flex justify-between">
                      <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(template.id)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {editMode && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedTemplate ? 'Edit Template' : 'New Template'}</CardTitle>
            <CardDescription>
              Create templates to automatically respond to common messages and comments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={templateData.name}
                    onChange={(e) => setTemplateData({...templateData, name: e.target.value})}
                    placeholder="E.g., Positive Feedback Response"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="template-type">Response Type</Label>
                  <Select 
                    value={templateData.type} 
                    onValueChange={(value) => setTemplateData({...templateData, type: value})}
                  >
                    <SelectTrigger id="template-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comment">Comment Response</SelectItem>
                      <SelectItem value="message">Message Response</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-content">Response Content</Label>
                <Textarea
                  id="template-content"
                  value={templateData.content}
                  onChange={(e) => setTemplateData({...templateData, content: e.target.value})}
                  placeholder="Enter the template content..."
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="template-triggers">Trigger Keywords (comma separated)</Label>
                  <Input
                    id="template-triggers"
                    value={templateData.triggers}
                    onChange={(e) => setTemplateData({...templateData, triggers: e.target.value})}
                    placeholder="E.g., great, awesome, thank you"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="template-sentiment">Sentiment</Label>
                  <Select 
                    value={templateData.sentiment} 
                    onValueChange={(value) => setTemplateData({...templateData, sentiment: value})}
                  >
                    <SelectTrigger id="template-sentiment">
                      <SelectValue placeholder="Select sentiment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="negative">Negative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                <Button onClick={handleSaveTemplate}>Save Template</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResponseTemplatesSection;
