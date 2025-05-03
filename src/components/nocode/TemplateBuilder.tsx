
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Bot, MessageSquare, Plus, Save, Wand2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Template {
  id: string;
  name: string;
  category: string;
  content: string;
  variables: string[];
  isAIEnabled: boolean;
}

const TemplateBuilder = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('edit');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<Template>({
    id: crypto.randomUUID(),
    name: '',
    category: 'general',
    content: '',
    variables: [],
    isAIEnabled: false
  });
  
  const categoryOptions = [
    { value: 'general', label: 'General Responses' },
    { value: 'comments', label: 'Comment Replies' },
    { value: 'messages', label: 'Direct Messages' },
    { value: 'support', label: 'Customer Support' },
    { value: 'sales', label: 'Sales & Promotions' }
  ];
  
  const [newVariable, setNewVariable] = useState('');

  const addVariable = () => {
    if (!newVariable.trim()) return;
    
    if (!newVariable.startsWith('{') || !newVariable.endsWith('}')) {
      const formattedVariable = `{${newVariable.replace(/[{}]/g, '')}}`;
      setCurrentTemplate({
        ...currentTemplate,
        variables: [...currentTemplate.variables, formattedVariable]
      });
    } else {
      setCurrentTemplate({
        ...currentTemplate,
        variables: [...currentTemplate.variables, newVariable]
      });
    }
    
    setNewVariable('');
  };

  const removeVariable = (variable: string) => {
    setCurrentTemplate({
      ...currentTemplate,
      variables: currentTemplate.variables.filter(v => v !== variable)
    });
  };

  const insertVariable = (variable: string) => {
    setCurrentTemplate({
      ...currentTemplate,
      content: currentTemplate.content + ' ' + variable
    });
  };

  const generateWithAI = () => {
    // Simulate AI generation
    const aiSuggestions = [
      "Thank you for your comment! We appreciate your feedback and will take it into consideration.",
      "Thanks for reaching out to us! Our team will get back to you shortly.",
      "We're thrilled you enjoyed our content! Stay tuned for more updates coming soon."
    ];
    
    const randomSuggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
    
    setCurrentTemplate({
      ...currentTemplate,
      content: randomSuggestion
    });
    
    toast({
      title: "AI Template Generated",
      description: "A template suggestion has been created based on your parameters"
    });
  };

  const saveTemplate = () => {
    if (!currentTemplate.name) {
      toast({
        title: "Validation Error",
        description: "Please provide a name for your template",
        variant: "destructive"
      });
      return;
    }
    
    if (!currentTemplate.content) {
      toast({
        title: "Validation Error",
        description: "Template content cannot be empty",
        variant: "destructive"
      });
      return;
    }

    // Add or update template
    const existingIndex = templates.findIndex(t => t.id === currentTemplate.id);
    if (existingIndex >= 0) {
      const updatedTemplates = [...templates];
      updatedTemplates[existingIndex] = currentTemplate;
      setTemplates(updatedTemplates);
    } else {
      setTemplates([...templates, currentTemplate]);
    }

    toast({
      title: "Template Saved",
      description: "Your response template has been saved successfully"
    });

    // Reset for a new template
    setCurrentTemplate({
      id: crypto.randomUUID(),
      name: '',
      category: 'general',
      content: '',
      variables: [],
      isAIEnabled: false
    });
  };

  const getPreviewWithVariables = () => {
    let preview = currentTemplate.content;
    
    // Replace variable placeholders with example values
    currentTemplate.variables.forEach((variable, index) => {
      const variableName = variable.replace(/[{}]/g, '');
      const exampleValue = `<span class="bg-primary/20 px-1 rounded">${variableName}-value</span>`;
      preview = preview.replace(new RegExp(variable, 'g'), exampleValue);
    });
    
    return preview;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/nocode">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-1">Template Builder</h1>
            <p className="text-muted-foreground">
              Create reusable response templates for consistent engagement
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/nocode/documentation">
              View Documentation
            </Link>
          </Button>
          <Button onClick={() => saveTemplate()}>
            <Save className="mr-2 h-4 w-4" /> Save Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
              <CardDescription>Set up your template information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input 
                  id="template-name" 
                  value={currentTemplate.name}
                  onChange={(e) => setCurrentTemplate({...currentTemplate, name: e.target.value})}
                  placeholder="Enter a name for this template"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={currentTemplate.category}
                  onValueChange={(value) => setCurrentTemplate({...currentTemplate, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="ai-enabled"
                  checked={currentTemplate.isAIEnabled}
                  onCheckedChange={(checked) => 
                    setCurrentTemplate({...currentTemplate, isAIEnabled: checked})
                  }
                />
                <Label htmlFor="ai-enabled">Enable AI adaptations</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Template Variables</CardTitle>
              <CardDescription>Add dynamic variables to personalize responses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input 
                  placeholder="Enter variable name"
                  value={newVariable} 
                  onChange={(e) => setNewVariable(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addVariable()}
                />
                <Button onClick={addVariable} type="button">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {currentTemplate.variables.length > 0 ? (
                <div className="space-y-2">
                  <Label>Available Variables</Label>
                  <div className="flex flex-wrap gap-2">
                    {currentTemplate.variables.map((variable, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="cursor-pointer flex items-center gap-1 py-1"
                      >
                        <span onClick={() => insertVariable(variable)}>
                          {variable}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => removeVariable(variable)}
                        >
                          ✕
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Click a variable to insert it into your template
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No variables added yet. Variables allow you to create personalized templates.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="edit" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="edit">Edit Template</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="ai">AI Assist</TabsTrigger>
              <TabsTrigger value="manage">Manage Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit">
              <Card>
                <CardHeader>
                  <CardTitle>Template Content</CardTitle>
                  <CardDescription>
                    Write your template content. Insert variables where needed.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea 
                    value={currentTemplate.content}
                    onChange={(e) => setCurrentTemplate({...currentTemplate, content: e.target.value})}
                    placeholder="Write your template content here..."
                    rows={10}
                  />
                  
                  {currentTemplate.variables.length > 0 && (
                    <div>
                      <Label>Quick Insert</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentTemplate.variables.map((variable, index) => (
                          <Button 
                            key={index}
                            variant="outline" 
                            size="sm"
                            onClick={() => insertVariable(variable)}
                          >
                            {variable}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button onClick={() => saveTemplate()}>
                    <Save className="mr-2 h-4 w-4" /> Save Template
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>
                    See how your template will look with variables applied
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">Response Preview</p>
                        <p className="text-sm text-muted-foreground">
                          Template: {currentTemplate.name || "Unnamed Template"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="prose max-w-none dark:prose-invert">
                      {currentTemplate.content ? (
                        <div 
                          className="whitespace-pre-wrap" 
                          dangerouslySetInnerHTML={{ __html: getPreviewWithVariables() }}
                        />
                      ) : (
                        <p className="text-muted-foreground italic">
                          Your template preview will appear here once you add content
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Tips for effective templates:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                      <li>Keep responses conversational and natural</li>
                      <li>Use variables for personalization</li>
                      <li>Include a clear call to action when appropriate</li>
                      <li>Match your brand voice and tone</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ai">
              <Card>
                <CardHeader>
                  <CardTitle>AI Template Assistant</CardTitle>
                  <CardDescription>
                    Get AI help to create or improve your templates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
                    <Bot className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-primary">AI Template Assistant</h4>
                      <p className="text-sm mt-1">
                        Let AI help you create professional response templates for any situation.
                        Describe what you need or select a suggestion below.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Generate a template for:</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={generateWithAI}
                      >
                        <Wand2 className="mr-2 h-4 w-4 text-primary" />
                        Customer Service Response
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={generateWithAI}
                      >
                        <Wand2 className="mr-2 h-4 w-4 text-primary" />
                        Thank You Message
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={generateWithAI}
                      >
                        <Wand2 className="mr-2 h-4 w-4 text-primary" />
                        Promotional Announcement
                      </Button>
                      <Button 
                        variant="outline" 
                        className="justify-start"
                        onClick={generateWithAI}
                      >
                        <Wand2 className="mr-2 h-4 w-4 text-primary" />
                        Feedback Request
                      </Button>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <Label>Custom request:</Label>
                      <div className="flex gap-2">
                        <Input placeholder="Describe the template you need..." />
                        <Button onClick={generateWithAI}>
                          <Wand2 className="mr-2 h-4 w-4" /> Generate
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manage">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Manage Templates</CardTitle>
                      <CardDescription>View and manage your saved templates</CardDescription>
                    </div>
                    <Button onClick={() => setActiveTab('edit')}>
                      <Plus className="mr-2 h-4 w-4" /> Create New Template
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {templates.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                      <p className="text-muted-foreground">You haven't created any templates yet.</p>
                      <Button onClick={() => setActiveTab('edit')} className="mt-4">
                        <Plus className="mr-2 h-4 w-4" /> Create Your First Template
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {templates.map(template => (
                        <Card key={template.id}>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{template.name}</h3>
                                  <Badge>{categoryOptions.find(c => c.value === template.category)?.label}</Badge>
                                  {template.isAIEnabled && <Badge variant="outline">AI-Enabled</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {template.content.substring(0, 100)}{template.content.length > 100 ? '...' : ''}
                                </p>
                                <div className="mt-2">
                                  {template.variables.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {template.variables.map((variable, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">
                                          {variable}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 justify-end">
                                <Button variant="outline" size="sm" onClick={() => {
                                  setCurrentTemplate(template);
                                  setActiveTab('edit');
                                }}>
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => {
                                  setCurrentTemplate(template);
                                  setActiveTab('preview');
                                }}>
                                  Preview
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => {
                                  setTemplates(templates.filter(t => t.id !== template.id));
                                  toast({
                                    title: "Template Deleted",
                                    description: "The template has been removed"
                                  });
                                }}>
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TemplateBuilder;
