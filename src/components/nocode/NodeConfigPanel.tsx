
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X, Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';

interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

interface NodeConfigPanelProps {
  node: WorkflowNode;
  onUpdateConfig: (data: any) => void;
  onClose: () => void;
}

// Node-specific configuration settings based on type
const nodeConfigFields: Record<string, {
  name: string;
  fields: Array<{
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'switch' | 'number';
    options?: string[];
    placeholder?: string;
  }>;
}> = {
  trigger: {
    name: 'Social Trigger',
    fields: [
      { id: 'platform', label: 'Platform', type: 'select', options: ['All Platforms', 'Instagram', 'Facebook', 'Twitter', 'LinkedIn'] },
      { id: 'eventType', label: 'Event Type', type: 'select', options: ['New Comment', 'New Message', 'Mention', 'New Follower', 'Post Reaction'] },
      { id: 'keywords', label: 'Keywords (comma-separated)', type: 'text', placeholder: 'e.g., product, pricing, help' },
      { id: 'filterNegative', label: 'Filter Negative Content', type: 'switch' },
    ]
  },
  content: {
    name: 'Content Post',
    fields: [
      { id: 'contentType', label: 'Content Type', type: 'select', options: ['Image', 'Video', 'Carousel', 'Text'] },
      { id: 'platform', label: 'Platform', type: 'select', options: ['All Platforms', 'Instagram', 'Facebook', 'Twitter', 'LinkedIn'] },
      { id: 'template', label: 'Template', type: 'select', options: ['Default', 'Promotion', 'Announcement', 'Product Launch', 'Custom'] },
      { id: 'message', label: 'Message', type: 'textarea', placeholder: 'Enter your post content here' },
    ]
  },
  schedule: {
    name: 'Schedule',
    fields: [
      { id: 'scheduleType', label: 'Schedule Type', type: 'select', options: ['Immediate', 'Queue', 'Specific Time', 'Best Time'] },
      { id: 'frequency', label: 'Frequency', type: 'select', options: ['Once', 'Daily', 'Weekly', 'Monthly'] },
      { id: 'queueSlot', label: 'Queue Slot', type: 'select', options: ['Morning', 'Midday', 'Afternoon', 'Evening'] },
      { id: 'delayMinutes', label: 'Delay (minutes)', type: 'number' },
    ]
  },
  filter: {
    name: 'Filter',
    fields: [
      { id: 'condition', label: 'Condition', type: 'select', options: ['Contains', 'Doesn\'t Contain', 'Equals', 'Not Equals', 'Greater Than', 'Less Than'] },
      { id: 'field', label: 'Field', type: 'text', placeholder: 'e.g., message, username, count' },
      { id: 'value', label: 'Value', type: 'text', placeholder: 'Value to compare against' },
      { id: 'caseSensitive', label: 'Case Sensitive', type: 'switch' },
    ]
  },
  audience: {
    name: 'Audience',
    fields: [
      { id: 'segmentType', label: 'Segment Type', type: 'select', options: ['All Followers', 'New Followers', 'Engaged Users', 'Inactive Users', 'Custom Segment'] },
      { id: 'minEngagement', label: 'Min. Engagement Rate', type: 'number' },
      { id: 'location', label: 'Location Filter', type: 'text', placeholder: 'e.g., USA, Europe, Global' },
      { id: 'includePrivate', label: 'Include Private Accounts', type: 'switch' },
    ]
  },
  analytics: {
    name: 'Analytics',
    fields: [
      { id: 'metricType', label: 'Metric Type', type: 'select', options: ['Engagement Rate', 'Followers Growth', 'Reach', 'Impressions', 'Clicks'] },
      { id: 'timeRange', label: 'Time Range', type: 'select', options: ['Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Custom'] },
      { id: 'compareWithPrevious', label: 'Compare with Previous Period', type: 'switch' },
      { id: 'notifyChanges', label: 'Notify on Significant Changes', type: 'switch' },
    ]
  }
};

const NodeConfigPanel = ({ node, onUpdateConfig, onClose }: NodeConfigPanelProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    label: node.data.label || '',
    description: node.data.description || '',
    ...(node.data || {})
  });
  
  const nodeConfig = nodeConfigFields[node.type] || {
    name: 'Unknown Node',
    fields: []
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onUpdateConfig(formData);
  };

  return (
    <Card className="h-full overflow-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{nodeConfig.name} Configuration</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Configure the settings for this node</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="label">Node Label</Label>
          <Input 
            id="label" 
            value={formData.label || ''} 
            onChange={(e) => handleInputChange('label', e.target.value)}
            placeholder="Enter a name for this node"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            value={formData.description || ''} 
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description of this node's purpose"
            rows={2}
          />
        </div>

        <Separator className="my-4" />
        
        <h3 className="text-sm font-semibold mb-3">Node Settings</h3>
        
        <div className="space-y-4">
          {nodeConfig.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor={field.id}>{field.label}</Label>
                {field.type === 'switch' && (
                  <Switch 
                    id={field.id}
                    checked={!!formData[field.id]}
                    onCheckedChange={(checked) => handleInputChange(field.id, checked)}
                  />
                )}
              </div>
              
              {field.type === 'text' && (
                <Input 
                  id={field.id}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                />
              )}
              
              {field.type === 'textarea' && (
                <Textarea 
                  id={field.id}
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                />
              )}
              
              {field.type === 'select' && field.options && (
                <Select
                  value={formData[field.id] || ''}
                  onValueChange={(value) => handleInputChange(field.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              
              {field.type === 'number' && (
                <Input 
                  id={field.id}
                  type="number"
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value ? Number(e.target.value) : '')}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Check className="h-4 w-4 mr-2" />
          Apply Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NodeConfigPanel;
