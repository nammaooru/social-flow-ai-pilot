
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, Copy, FileType, MessageCircle, Plus, Save, Sparkles, Tag, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TemplateVariable {
  id: string;
  name: string;
  description: string;
  defaultValue: string;
  type: 'text' | 'name' | 'number' | 'date' | 'custom';
}

interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  category: string;
  variables: TemplateVariable[];
  tags: string[];
}

// Example templates
const exampleTemplates: Template[] = [
  {
    id: '1',
    name: 'Product Launch',
    description: 'Announce a new product or feature',
    content: '🚀 Exciting news! We just launched {{product_name}}! {{product_description}} Learn more at {{link}}. #{{product_category}} #Launch',
    category: 'marketing',
    variables: [
      { id: '1', name: 'product_name', description: 'Name of the product', defaultValue: 'Product X', type: 'text' },
      { id: '2', name: 'product_description', description: 'Brief description of the product', defaultValue: 'Our newest addition designed to help you achieve more.', type: 'text' },
      { id: '3', name: 'link', description: 'Link to product page', defaultValue: 'example.com/product', type: 'text' },
      { id: '4', name: 'product_category', description: 'Product category for hashtag', defaultValue: 'NewProduct', type: 'text' },
    ],
    tags: ['product', 'launch', 'marketing']
  },
  {
    id: '2',
    name: 'Customer Support Response',
    description: 'Response template for support inquiries',
    content: 'Hi {{customer_name}}, thank you for reaching out about {{issue}}. We\'re here to help! {{solution}} If you have any further questions, don\'t hesitate to ask. Best, {{agent_name}}',
    category: 'support',
    variables: [
      { id: '1', name: 'customer_name', description: 'Customer\'s first name', defaultValue: 'John', type: 'name' },
      { id: '2', name: 'issue', description: 'Brief description of the issue', defaultValue: 'your recent order', type: 'text' },
      { id: '3', name: 'solution', description: 'Proposed solution or next steps', defaultValue: 'I\'ve checked your account and issued a refund which should appear within 3-5 business days.', type: 'text' },
      { id: '4', name: 'agent_name', description: 'Support agent\'s name', defaultValue: 'Sarah', type: 'name' },
    ],
    tags: ['support', 'customer', 'response']
  },
  {
    id: '3',
    name: 'Special Offer Announcement',
    description: 'Announce a limited-time promotion or discount',
    content: '🔥 LIMITED TIME OFFER: {{offer_description}} Use code {{promo_code}} for {{discount}}% off until {{end_date}}! Shop now at {{link}} #Sale #Discount',
    category: 'promotion',
    variables: [
      { id: '1', name: 'offer_description', description: 'Description of the special offer', defaultValue: 'Our biggest sale of the year is here!', type: 'text' },
      { id: '2', name: 'promo_code', description: 'Promotion code', defaultValue: 'SPECIAL20', type: 'text' },
      { id: '3', name: 'discount', description: 'Discount percentage', defaultValue: '20', type: 'number' },
      { id: '4', name: 'end_date', description: 'End date of the promotion', defaultValue: 'June 30th', type: 'date' },
      { id: '5', name: 'link', description: 'Link to promotion page', defaultValue: 'example.com/sale', type: 'text' },
    ],
    tags: ['sale', 'promotion', 'discount']
  }
];

const TemplateBuilder = () => {
  const [templates, setTemplates] = useState<Template[]>(exampleTemplates);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleVariableChange = (variableId: string, value: string) => {
    setVariableValues(prev => ({
      ...prev,
      [variableId]: value
    }));
  };

  const getPreviewContent = () => {
    if (!activeTemplate) return '';
    
    const template = templates.find(t => t.id === activeTemplate);
    if (!template) return '';
    
    let content = template.content;
    template.variables.forEach(variable => {
      const value = variableValues[variable.id] || variable.defaultValue;
      content = content.replace(`{{${variable.name}}}`, value);
    });
    
    return content;
  };

  const handleCreateTemplate = () => {
    setIsCreating(true);
    setEditingTemplate({
      id: String(Date.now()),
      name: '',
      description: '',
      content: '',
      category: 'general',
      variables: [],
      tags: []
    });
  };

  const handleAddVariable = () => {
    if (!editingTemplate) return;
    
    const newVariable: TemplateVariable = {
      id: String(Date.now()),
      name: `variable_${editingTemplate.variables.length + 1}`,
      description: '',
      defaultValue: '',
      type: 'text'
    };
    
    setEditingTemplate({
      ...editingTemplate,
      variables: [...editingTemplate.variables, newVariable]
    });
  };

  const handleUpdateVariable = (id: string, field: keyof TemplateVariable, value: string) => {
    if (!editingTemplate) return;
    
    setEditingTemplate({
      ...editingTemplate,
      variables: editingTemplate.variables.map(v => 
        v.id === id ? { ...v, [field]: value } : v
      )
    });
  };

  const handleDeleteVariable = (id: string) => {
    if (!editingTemplate) return;
    
    setEditingTemplate({
      ...editingTemplate,
      variables: editingTemplate.variables.filter(v => v.id !== id)
    });
  };

  const handleContentChange = (content: string) => {
    if (!editingTemplate) return;
    
    // Extract variables from content (anything in {{variable}} format)
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const matches = [...content.matchAll(variableRegex)];
    const variableNames = matches.map(match => match[1]);
    
    // Add any new variables found
    const existingVarNames = editingTemplate.variables.map(v => v.name);
    const newVarNames = variableNames.filter(name => !existingVarNames.includes(name));
    
    let updatedVariables = [...editingTemplate.variables];
    
    // Add new variables
    newVarNames.forEach(name => {
      updatedVariables.push({
        id: String(Date.now() + Math.random()),
        name,
        description: `Value for ${name}`,
        defaultValue: '',
        type: 'text'
      });
    });
    
    setEditingTemplate({
      ...editingTemplate,
      content,
      variables: updatedVariables
    });
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;
    
    if (!editingTemplate.name.trim()) {
      toast({
        title: "Error",
        description: "Template name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (isCreating) {
      setTemplates([...templates, editingTemplate]);
    } else {
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id ? editingTemplate : t
      ));
    }
    
    setEditingTemplate(null);
    setIsCreating(false);
    toast({
      title: "Template saved",
      description: "Your template has been saved successfully.",
    });
  };

  const handleSelectTemplate = (templateId: string) => {
    setActiveTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    
    // Reset variable values to defaults
    if (template) {
      const initialValues: Record<string, string> = {};
      template.variables.forEach(v => {
        initialValues[v.id] = v.defaultValue;
      });
      setVariableValues(initialValues);
    }
    
    setShowPreview(true);
  };

  const handleEditTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setEditingTemplate({...template});
      setIsCreating(false);
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    
    if (activeTemplate === templateId) {
      setActiveTemplate(null);
      setShowPreview(false);
    }
    
    toast({
      title: "Template deleted",
      description: "The template has been removed.",
    });
  };

  const handleCopyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      const newTemplate = {
        ...template,
        id: String(Date.now()),
        name: `${template.name} (Copy)`,
      };
      setTemplates([...templates, newTemplate]);
      
      toast({
        title: "Template copied",
        description: "A copy of the template has been created.",
      });
    }
  };

  const handleGenerateTemplate = () => {
    toast({
      title: "Generating template",
      description: "AI is generating a template based on your inputs...",
    });
    
    // Simulate AI generation delay
    setTimeout(() => {
      if (!editingTemplate) return;
      
      // This would be replaced with actual AI generation
      setEditingTemplate({
        ...editingTemplate,
        content: "✨ Check out our new {{product_name}}! {{product_description}} Available now at {{price}}. Visit {{link}} to learn more. #{{hashtag}}",
        variables: [
          { id: '1', name: 'product_name', description: 'Name of your product', defaultValue: 'Amazing Product', type: 'text' },
          { id: '2', name: 'product_description', description: 'Brief product description', defaultValue: 'The perfect solution for your needs.', type: 'text' },
          { id: '3', name: 'price', description: 'Product price', defaultValue: '$99', type: 'text' },
          { id: '4', name: 'link', description: 'Link to product page', defaultValue: 'example.com/product', type: 'text' },
          { id: '5', name: 'hashtag', description: 'Primary hashtag', defaultValue: 'NewProduct', type: 'text' },
        ]
      });
      
      toast({
        title: "Template generated",
        description: "AI has generated a template. You can now edit it to fit your needs.",
      });
    }, 1500);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(getPreviewContent());
    
    toast({
      title: "Copied to clipboard",
      description: "Template content has been copied to your clipboard.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Template List */}
      {!editingTemplate && (
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Response Templates</h2>
            <Button onClick={handleCreateTemplate} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Template
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Templates Found</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Create your first template to start crafting consistent responses.
                  </p>
                  <Button onClick={handleCreateTemplate}>Create Template</Button>
                </CardContent>
              </Card>
            ) : (
              templates.map(template => (
                <Card key={template.id} className={cn(
                  "transition-all hover:shadow-md",
                  activeTemplate === template.id && "ring-2 ring-primary"
                )}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm max-h-32 overflow-hidden text-ellipsis bg-muted p-3 rounded-md mb-4">
                      {template.content}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {template.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {template.variables.length} variable{template.variables.length !== 1 ? 's' : ''}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 gap-2">
                    <Button 
                      variant="default" 
                      size="sm"
                      className="flex-1"
                      onClick={() => handleSelectTemplate(template.id)}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Use
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEditTemplate(template.id)}
                    >
                      Edit
                    </Button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Tag className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="bottom" align="end" className="w-48">
                        <div className="flex flex-col gap-2 text-sm">
                          <button 
                            className="flex items-center gap-2 p-2 hover:bg-accent rounded-md"
                            onClick={() => handleCopyTemplate(template.id)}
                          >
                            <Copy className="h-4 w-4" />
                            Duplicate
                          </button>
                          <button 
                            className="flex items-center gap-2 p-2 hover:bg-accent rounded-md text-destructive"
                            onClick={() => handleDeleteTemplate(template.id)}
                          >
                            <Trash className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
      
      {/* Template Editor */}
      {editingTemplate && (
        <>
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isCreating ? "Create New Template" : "Edit Template"}
                </CardTitle>
                <CardDescription>
                  Design a response template with customizable variables
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="template-name">Template Name</Label>
                      <Input 
                        id="template-name"
                        value={editingTemplate.name}
                        onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                        placeholder="e.g., Product Inquiry Response"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="template-category">Category</Label>
                      <Select 
                        value={editingTemplate.category} 
                        onValueChange={(value) => setEditingTemplate({...editingTemplate, category: value})}
                      >
                        <SelectTrigger id="template-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="support">Customer Support</SelectItem>
                          <SelectItem value="promotion">Promotion</SelectItem>
                          <SelectItem value="announcement">Announcement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="template-description">Description</Label>
                    <Input 
                      id="template-description"
                      value={editingTemplate.description}
                      onChange={(e) => setEditingTemplate({...editingTemplate, description: e.target.value})}
                      placeholder="Brief description of this template's purpose"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-1">
                      <Label htmlFor="template-content">Template Content</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateTemplate}
                        className="gap-1"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Generate with AI
                      </Button>
                    </div>
                    <Textarea 
                      id="template-content"
                      value={editingTemplate.content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      placeholder="Write your template with {{variable}} placeholders"
                      rows={5}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use double curly braces to define variables, e.g., {{'{{'}}variable_name{{'}}'}}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Variables</Label>
                      <Button
                        variant="outline" 
                        size="sm" 
                        onClick={handleAddVariable}
                        className="gap-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Variable
                      </Button>
                    </div>
                    
                    {editingTemplate.variables.length === 0 ? (
                      <div className="py-4 text-center text-sm text-muted-foreground">
                        No variables defined. Add variables or include {{'{{'}}variable{{'}}'}} in your template.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {editingTemplate.variables.map(variable => (
                          <div key={variable.id} className="flex gap-2 items-start border p-3 rounded-md">
                            <div className="flex-1 grid grid-cols-2 gap-2">
                              <div className="space-y-2">
                                <Label htmlFor={`var-name-${variable.id}`}>Variable Name</Label>
                                <div className="flex items-center gap-2">
                                  <FileType className="h-4 w-4 text-muted-foreground" />
                                  <Input 
                                    id={`var-name-${variable.id}`}
                                    value={variable.name}
                                    onChange={(e) => handleUpdateVariable(variable.id, 'name', e.target.value)}
                                    className="h-8"
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`var-type-${variable.id}`}>Type</Label>
                                <Select 
                                  value={variable.type} 
                                  onValueChange={(value: any) => handleUpdateVariable(variable.id, 'type', value)}
                                >
                                  <SelectTrigger id={`var-type-${variable.id}`} className="h-8">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="name">Name</SelectItem>
                                    <SelectItem value="number">Number</SelectItem>
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="custom">Custom</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`var-default-${variable.id}`}>Default Value</Label>
                                <Input 
                                  id={`var-default-${variable.id}`}
                                  value={variable.defaultValue}
                                  onChange={(e) => handleUpdateVariable(variable.id, 'defaultValue', e.target.value)}
                                  className="h-8"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor={`var-desc-${variable.id}`}>Description</Label>
                                <Input 
                                  id={`var-desc-${variable.id}`}
                                  value={variable.description}
                                  onChange={(e) => handleUpdateVariable(variable.id, 'description', e.target.value)}
                                  className="h-8"
                                />
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDeleteVariable(variable.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="template-tags">Tags (comma-separated)</Label>
                    <Input 
                      id="template-tags"
                      value={editingTemplate.tags.join(', ')}
                      onChange={(e) => setEditingTemplate({
                        ...editingTemplate, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                      })}
                      placeholder="e.g., support, product, response"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setEditingTemplate(null);
                    setIsCreating(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  See how your template will appear
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-accent/40 border rounded-md p-4 mb-4 min-h-[100px] whitespace-pre-wrap">
                  {editingTemplate.content || (
                    <span className="text-muted-foreground">
                      Template preview will appear here...
                    </span>
                  )}
                </div>
                
                <p className="text-sm font-medium mb-2">Variables Highlighted:</p>
                <div className="bg-accent/40 border rounded-md p-4 min-h-[100px] whitespace-pre-wrap">
                  {editingTemplate.content ? (
                    editingTemplate.content.replace(
                      /\{\{([^}]+)\}\}/g, 
                      (match, p1) => `<span class="bg-primary/20 text-primary rounded px-1">${match}</span>`
                    )
                  ) : (
                    <span className="text-muted-foreground">
                      No template content yet
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
      
      {/* Template Preview and Use */}
      {!editingTemplate && showPreview && activeTemplate && (
        <div className={`lg:col-span-3 ${showPreview ? '' : 'hidden'}`}>
          <Card>
            <CardHeader>
              <CardTitle>Use Template</CardTitle>
              <CardDescription>
                Fill in variables to customize your message
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4">Variables</h3>
                  
                  {templates.find(t => t.id === activeTemplate)?.variables.map(variable => (
                    <div key={variable.id} className="mb-3">
                      <Label 
                        htmlFor={`preview-var-${variable.id}`}
                        className="mb-1 block"
                      >
                        {variable.description || variable.name}
                      </Label>
                      <Input 
                        id={`preview-var-${variable.id}`}
                        value={variableValues[variable.id] || variable.defaultValue}
                        onChange={(e) => handleVariableChange(variable.id, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Preview</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCopyToClipboard}
                      className="gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                  
                  <div className="bg-accent/40 border rounded-md p-4 min-h-[200px] whitespace-pre-wrap">
                    {getPreviewContent()}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button 
                variant="outline"
                onClick={() => setShowPreview(false)}
              >
                Back to Templates
              </Button>
              <Button className="gap-2">
                <Check className="h-4 w-4" />
                Use Template
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TemplateBuilder;
