
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MessageSquare,
  AlertCircle,
  Edit,
  Trash2,
  Save,
  Clock,
  Plus
} from "lucide-react";

// Define props interface
interface ChatbotSettingsProps {
  role: string;
}

export function ChatbotSettings({ role }: ChatbotSettingsProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(500);
  
  // Sample chat bot response templates
  const [responseTemplates, setResponseTemplates] = useState([
    {
      id: "1",
      name: "Greeting",
      content: "Hello! Welcome to our platform. How can I assist you today?",
      isEnabled: true,
    },
    {
      id: "2",
      name: "Out of scope",
      content: "I'm sorry, but that question is beyond my current capabilities. Would you like to speak with a human agent?",
      isEnabled: true,
    },
    {
      id: "3",
      name: "Support request",
      content: "I'll help you with your support request. To better assist you, could you please provide more details about the issue you're experiencing?",
      isEnabled: true,
    },
    {
      id: "4",
      name: "Product information",
      content: "Our platform offers social media management tools including content scheduling, analytics, and engagement tracking. Would you like to know more about any specific feature?",
      isEnabled: false,
    },
  ]);
  
  // Sample training phrases
  const [trainingPhrases, setTrainingPhrases] = useState([
    {
      id: "1",
      intent: "Schedule post",
      phrases: [
        "How do I schedule a post?",
        "I want to schedule content",
        "Can I post something later?",
        "Schedule my Instagram post"
      ],
    },
    {
      id: "2",
      intent: "Analytics help",
      phrases: [
        "How do I check analytics?",
        "Show me my post performance",
        "Where are the engagement stats?",
        "How to view report"
      ],
    },
    {
      id: "3",
      intent: "Account issues",
      phrases: [
        "Can't login to my account",
        "Password reset not working",
        "Account locked out",
        "How to change email"
      ],
    },
  ]);
  
  // Sample conversation logs
  const conversationLogs = [
    {
      id: "1",
      userId: "user123",
      date: "2023-05-01",
      duration: "5m 23s",
      rating: "Positive",
      messages: 8
    },
    {
      id: "2",
      userId: "user456",
      date: "2023-05-01",
      duration: "2m 12s",
      rating: "Neutral",
      messages: 4
    },
    {
      id: "3",
      userId: "user789",
      date: "2023-04-30",
      duration: "8m 45s",
      rating: "Negative",
      messages: 12
    },
    {
      id: "4",
      userId: "user234",
      date: "2023-04-30",
      duration: "3m 17s",
      rating: "Positive",
      messages: 6
    },
    {
      id: "5",
      userId: "user567",
      date: "2023-04-29",
      duration: "1m 45s",
      rating: "Neutral",
      messages: 3
    }
  ];
  
  const handleSaveGeneral = () => {
    toast({
      title: "Settings saved",
      description: "Your chatbot settings have been updated successfully.",
    });
  };
  
  const handleAddTemplate = () => {
    // In a real app, this would add a new template to the list
    toast({
      title: "Template added",
      description: "Your new response template has been created.",
    });
  };
  
  const handleDeleteTemplate = (id: string) => {
    setResponseTemplates(responseTemplates.filter(template => template.id !== id));
    
    toast({
      title: "Template deleted",
      description: "The response template has been removed.",
    });
  };
  
  const toggleTemplateStatus = (id: string) => {
    setResponseTemplates(responseTemplates.map(template => {
      if (template.id === id) {
        return { ...template, isEnabled: !template.isEnabled };
      }
      return template;
    }));
    
    const template = responseTemplates.find(t => t.id === id);
    if (template) {
      toast({
        title: template.isEnabled ? "Template disabled" : "Template enabled",
        description: `The "${template.name}" template has been ${template.isEnabled ? "disabled" : "enabled"}.`,
      });
    }
  };
  
  const handleAddTrainingPhrase = () => {
    toast({
      title: "Intent created",
      description: "Your new training intent has been created.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Chatbot Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your AI assistant's behavior and responses.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="responses" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Responses</span>
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Training</span>
          </TabsTrigger>
          {(role === "Super Admin" || role === "White Label" || role === "Admin") && (
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Configuration</CardTitle>
              <CardDescription>
                Configure the basic settings for your chatbot.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chatbot-name">Chatbot Name</Label>
                <Input id="chatbot-name" defaultValue="Support Assistant" />
                <p className="text-xs text-muted-foreground">
                  The name that will be displayed to users when they interact with your chatbot.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="welcome-message">Welcome Message</Label>
                <Textarea 
                  id="welcome-message" 
                  rows={3}
                  defaultValue="Hello! I'm your AI assistant. How can I help you today?"
                />
                <p className="text-xs text-muted-foreground">
                  The initial message users will see when starting a conversation.
                </p>
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="chatbot-active" className="flex flex-col space-y-1">
                  <span>Chatbot Status</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Enable or disable the chatbot for all users.
                  </span>
                </Label>
                <Switch
                  id="chatbot-active"
                  defaultChecked={true}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="collect-feedback" className="flex flex-col space-y-1">
                  <span>Collect User Feedback</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Ask users to rate their experience after each conversation.
                  </span>
                </Label>
                <Switch
                  id="collect-feedback"
                  defaultChecked={true}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral}>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Model Configuration</CardTitle>
              <CardDescription>
                Configure the behavior of the AI model powering your chatbot.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="model-selection">AI Model</Label>
                  {(role === "Super Admin" || role === "White Label") && (
                    <Button variant="outline" size="sm">Upgrade</Button>
                  )}
                </div>
                <Select defaultValue="gpt-3.5">
                  <SelectTrigger id="model-selection">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="gpt-4" disabled={role === "User" || role === "Admin"}>GPT-4 (Premium)</SelectItem>
                    <SelectItem value="custom" disabled={role !== "Super Admin"}>Custom Model</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="temperature-slider">Temperature: {temperature.toFixed(1)}</Label>
                </div>
                <Slider
                  id="temperature-slider"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Controls randomness: Lower values make responses more deterministic, higher values make responses more creative.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="max-tokens-slider">Max Tokens: {maxTokens}</Label>
                </div>
                <Slider
                  id="max-tokens-slider"
                  min={100}
                  max={2000}
                  step={50}
                  value={[maxTokens]}
                  onValueChange={(value) => setMaxTokens(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum length of the chatbot's responses.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fallback-message">Fallback Message</Label>
                <Textarea 
                  id="fallback-message" 
                  rows={2}
                  defaultValue="I'm sorry, I don't understand that question. Could you please rephrase it or ask something else?"
                />
                <p className="text-xs text-muted-foreground">
                  Message shown when the chatbot cannot understand or process a user query.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral}>Save Configuration</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure advanced settings for your chatbot.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="human-handoff" className="flex flex-col space-y-1">
                  <span>Human Handoff</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Allow users to request a human agent when needed.
                  </span>
                </Label>
                <Switch
                  id="human-handoff"
                  defaultChecked={true}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="handoff-message">Human Handoff Message</Label>
                <Textarea 
                  id="handoff-message" 
                  rows={2}
                  defaultValue="I'll connect you with a human agent who can better assist you. Please wait a moment while I transfer your conversation."
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="sentiment-analysis" className="flex flex-col space-y-1">
                  <span>Sentiment Analysis</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Analyze user sentiment to tailor responses.
                  </span>
                </Label>
                <Switch
                  id="sentiment-analysis"
                  defaultChecked={true}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="conversation-history" className="flex flex-col space-y-1">
                  <span>Conversation History</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Use previous conversations to provide personalized responses.
                  </span>
                </Label>
                <Switch
                  id="conversation-history"
                  defaultChecked={true}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input id="session-timeout" type="number" defaultValue="30" />
                <p className="text-xs text-muted-foreground">
                  Time of inactivity after which a conversation is considered ended.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral}>Save Advanced Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="responses" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Response Templates</CardTitle>
                <CardDescription>
                  Create and manage pre-defined responses for common scenarios.
                </CardDescription>
              </div>
              <Button onClick={handleAddTemplate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Template
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {responseTemplates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{template.name}</div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                        <Switch
                          checked={template.isEnabled}
                          onCheckedChange={() => toggleTemplateStatus(template.id)}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-muted p-3 rounded-md text-sm">
                      {template.content}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Context Variables</CardTitle>
              <CardDescription>
                Define variables that can be used in response templates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Variable</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Example</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-sm">{"{{user.name}}"}</TableCell>
                    <TableCell>User's name</TableCell>
                    <TableCell>"John"</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">{"{{user.email}}"}</TableCell>
                    <TableCell>User's email address</TableCell>
                    <TableCell>"john@example.com"</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">{"{{current.date}}"}</TableCell>
                    <TableCell>Current date</TableCell>
                    <TableCell>"May 1, 2023"</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-mono text-sm">{"{{company.name}}"}</TableCell>
                    <TableCell>Your company name</TableCell>
                    <TableCell>"Acme Inc."</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <div className="mt-4">
                <Button variant="outline">
                  Add Custom Variable
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Training Data</CardTitle>
                <CardDescription>
                  Provide examples to train your chatbot on how to respond to specific intents.
                </CardDescription>
              </div>
              <Button onClick={handleAddTrainingPhrase}>
                <Plus className="mr-2 h-4 w-4" />
                Add Intent
              </Button>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {trainingPhrases.map((training) => (
                  <AccordionItem key={training.id} value={training.id}>
                    <AccordionTrigger className="text-lg hover:bg-muted/50 px-4 rounded-md">
                      {training.intent}
                    </AccordionTrigger>
                    <AccordionContent className="px-4">
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Add example phrases that users might say to express this intent.
                        </p>
                        
                        <div className="space-y-2">
                          {training.phrases.map((phrase, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="bg-muted p-2 rounded-md text-sm flex-1">
                                {phrase}
                              </div>
                              <Button variant="ghost" size="sm" className="ml-2">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Input placeholder="Add a new example phrase..." />
                          <Button variant="outline">Add</Button>
                        </div>
                        
                        <div className="pt-4">
                          <Button variant="default">
                            <Save className="mr-2 h-4 w-4" />
                            Save Intent
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Training Controls</CardTitle>
              <CardDescription>
                Manage how and when your chatbot learns from new data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="auto-training" className="flex flex-col space-y-1">
                  <span>Automatic Training</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Automatically train the model with new conversations.
                  </span>
                </Label>
                <Switch
                  id="auto-training"
                  defaultChecked={false}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="learn-from-corrections" className="flex flex-col space-y-1">
                  <span>Learn from Human Corrections</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Improve chatbot responses based on human agent corrections.
                  </span>
                </Label>
                <Switch
                  id="learn-from-corrections"
                  defaultChecked={true}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="training-schedule">Training Schedule</Label>
                <Select defaultValue="weekly">
                  <SelectTrigger id="training-schedule">
                    <SelectValue placeholder="Select schedule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="manual">Manual Only</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  How often the model should be retrained with new data.
                </p>
              </div>
              
              <div className="flex justify-start space-x-2 mt-4">
                <Button variant="outline" className="flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Test Model
                </Button>
                <Button variant="default" className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Schedule Training
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversation Metrics</CardTitle>
              <CardDescription>
                View metrics and performance data for your chatbot.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,284</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Average User Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.2/5</div>
                    <p className="text-xs text-muted-foreground">+0.3 from last month</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Human Handoff Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18%</div>
                    <p className="text-xs text-muted-foreground">-3% from last month</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-4">Common Topics</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-muted rounded-full h-4">
                      <div className="bg-blue-500 h-4 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                    <span className="text-sm font-medium">Account Issues (45%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-muted rounded-full h-4">
                      <div className="bg-green-500 h-4 rounded-full" style={{ width: "30%" }}></div>
                    </div>
                    <span className="text-sm font-medium">How to Use (30%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-muted rounded-full h-4">
                      <div className="bg-yellow-500 h-4 rounded-full" style={{ width: "15%" }}></div>
                    </div>
                    <span className="text-sm font-medium">Billing (15%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-muted rounded-full h-4">
                      <div className="bg-purple-500 h-4 rounded-full" style={{ width: "10%" }}></div>
                    </div>
                    <span className="text-sm font-medium">Feature Requests (10%)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
              <CardDescription>
                Review recent chatbot interactions with users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Messages</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversationLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.userId}</TableCell>
                      <TableCell>{log.date}</TableCell>
                      <TableCell>{log.duration}</TableCell>
                      <TableCell>{log.messages}</TableCell>
                      <TableCell>
                        <span
                          className={
                            log.rating === "Positive"
                              ? "text-green-600"
                              : log.rating === "Negative"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }
                        >
                          {log.rating}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline">Load More</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
