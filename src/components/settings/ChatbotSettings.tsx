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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageSquare, Upload, Sparkles, Bot, Languages, Plus } from "lucide-react";

interface ChatbotSettingsProps {
  role: string;
}

export function ChatbotSettings({ role }: ChatbotSettingsProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [chatbotEnabled, setChatbotEnabled] = useState(true);
  const [aiAssistEnabled, setAiAssistEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  
  // Sample responses for the chatbot
  const [welcomeMessage, setWelcomeMessage] = useState("Hi there! How can I assist you today?");
  const [fallbackMessage, setFallbackMessage] = useState("I'm sorry, I don't understand. Could you try rephrasing that?");
  
  const handleSave = () => {
    toast({
      title: "Chatbot settings saved",
      description: "Your chatbot settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Chatbot Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your AI assistant and chatbot preferences.
        </p>
      </div>
      
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" /> Basic Configuration
              </CardTitle>
              <CardDescription>
                Configure general chatbot settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="chatbot-enabled" className="flex flex-col space-y-1">
                  <span>Enable Chatbot</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Show the chatbot interface to users.
                  </span>
                </Label>
                <Switch
                  id="chatbot-enabled"
                  checked={chatbotEnabled}
                  onCheckedChange={setChatbotEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="ai-enabled" className="flex flex-col space-y-1">
                  <span>AI-Powered Responses</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Use advanced AI to generate responses.
                  </span>
                </Label>
                <Switch
                  id="ai-enabled"
                  checked={aiAssistEnabled}
                  onCheckedChange={setAiAssistEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="voice-enabled" className="flex flex-col space-y-1">
                  <span>Voice Commands</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Allow users to speak to the chatbot.
                  </span>
                </Label>
                <Switch
                  id="voice-enabled"
                  checked={voiceEnabled}
                  onCheckedChange={setVoiceEnabled}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="chatbot-name">Chatbot Name</Label>
                <Input
                  id="chatbot-name"
                  placeholder="e.g., SocialAssist"
                  defaultValue="SocialAssist"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="chatbot-avatar">Chatbot Avatar</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <Bot className="h-8 w-8" />
                  </div>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" /> Upload Image
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Settings</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" /> Language Settings
              </CardTitle>
              <CardDescription>
                Configure language preferences for your chatbot.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primary-language">Primary Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="primary-language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="it">Italian</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                    <SelectItem value="zh">Chinese (Simplified)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="auto-translate" className="flex flex-col space-y-1">
                  <span>Auto-Translate Responses</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Automatically translate responses to the user's language.
                  </span>
                </Label>
                <Switch
                  id="auto-translate"
                  defaultChecked={true}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="multi-language" className="flex flex-col space-y-1">
                  <span>Support Multiple Languages</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Allow users to switch languages in the chatbot interface.
                  </span>
                </Label>
                <Switch
                  id="multi-language"
                  defaultChecked={true}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Language Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="responses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> Message Templates
              </CardTitle>
              <CardDescription>
                Configure standard responses for common situations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="welcome-message">Welcome Message</Label>
                <Textarea
                  id="welcome-message"
                  placeholder="Enter your welcome message"
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  This message is shown when a user first opens the chatbot.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fallback-message">Fallback Message</Label>
                <Textarea
                  id="fallback-message"
                  placeholder="Enter your fallback message"
                  value={fallbackMessage}
                  onChange={(e) => setFallbackMessage(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  This message is shown when the chatbot doesn't understand a user query.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="conversation-timeout">Away Message</Label>
                <Textarea
                  id="away-message"
                  placeholder="Enter your away message"
                  defaultValue="Our team is currently unavailable. We'll get back to you as soon as possible."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  This message is shown during off-hours or when live support is unavailable.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Message Templates</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" /> AI Personality
              </CardTitle>
              <CardDescription>
                Configure how your AI assistant communicates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tone">Conversational Tone</Label>
                <Select defaultValue="friendly">
                  <SelectTrigger id="tone">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Friendly and Casual</SelectItem>
                    <SelectItem value="professional">Professional and Formal</SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic and Energetic</SelectItem>
                    <SelectItem value="helpful">Helpful and Informative</SelectItem>
                    <SelectItem value="concise">Brief and Direct</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="response-length">Typical Response Length</Label>
                <Select defaultValue="balanced">
                  <SelectTrigger id="response-length">
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="concise">Concise (1-2 sentences)</SelectItem>
                    <SelectItem value="balanced">Balanced (2-4 sentences)</SelectItem>
                    <SelectItem value="detailed">Detailed (4+ sentences)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="personality-traits">Personality Traits</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Label className="flex items-center space-x-2 p-2 border rounded-md">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    <span>Helpful</span>
                  </Label>
                  
                  <Label className="flex items-center space-x-2 p-2 border rounded-md">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    <span>Friendly</span>
                  </Label>
                  
                  <Label className="flex items-center space-x-2 p-2 border rounded-md">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Humorous</span>
                  </Label>
                  
                  <Label className="flex items-center space-x-2 p-2 border rounded-md">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    <span>Knowledgeable</span>
                  </Label>
                  
                  <Label className="flex items-center space-x-2 p-2 border rounded-md">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Creative</span>
                  </Label>
                  
                  <Label className="flex items-center space-x-2 p-2 border rounded-md">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    <span>Professional</span>
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save AI Personality</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="knowledge" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>
                Manage the information your chatbot can access and use.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Knowledge Sources</Label>
                <div className="grid gap-2">
                  <Label className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                      <span>Product Documentation</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </Label>
                  
                  <Label className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                      <span>FAQ Database</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </Label>
                  
                  <Label className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                      <span>Support Articles</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </Label>
                  
                  <Label className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>User Guides</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="upload-documents">Upload Custom Documents</Label>
                <div className="flex gap-2">
                  <Input
                    id="upload-documents"
                    type="file"
                    multiple
                  />
                  <Button variant="outline">
                    Upload
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload PDF, DOCX, or TXT files to add to your chatbot's knowledge base.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Knowledge Base</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Custom Answers</CardTitle>
              <CardDescription>
                Configure custom responses for specific questions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="font-medium">
                    "What are your business hours?"
                  </AccordionTrigger>
                  <AccordionContent>
                    <Textarea
                      defaultValue="Our business hours are Monday to Friday, 9 AM to 5 PM Eastern Time."
                      rows={3}
                    />
                    <Button size="sm" className="mt-2">Save Answer</Button>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="font-medium">
                    "How do I reset my password?"
                  </AccordionTrigger>
                  <AccordionContent>
                    <Textarea
                      defaultValue="You can reset your password by clicking on the 'Forgot Password' link on the login page and following the instructions sent to your email."
                      rows={3}
                    />
                    <Button size="sm" className="mt-2">Save Answer</Button>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="font-medium">
                    "How much does your service cost?"
                  </AccordionTrigger>
                  <AccordionContent>
                    <Textarea
                      defaultValue="We offer several pricing tiers starting at $29/month for our Basic plan. You can view all our pricing options on our pricing page."
                      rows={3}
                    />
                    <Button size="sm" className="mt-2">Save Answer</Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add New Custom Answer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-6">
          {(role === "Super Admin" || role === "White Label") && (
            <Card>
              <CardHeader>
                <CardTitle>AI Model Configuration</CardTitle>
                <CardDescription>
                  Advanced settings for the AI model powering your chatbot.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="model">AI Model</Label>
                  <Select defaultValue="gpt-4">
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Select AI model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4 (Most Advanced)</SelectItem>
                      <SelectItem value="gpt-3.5">GPT-3.5 (Balanced)</SelectItem>
                      <SelectItem value="custom">Custom Model</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      id="temperature"
                      min="0" 
                      max="1" 
                      step="0.1"
                      defaultValue="0.7"
                      className="w-full"
                    />
                    <span className="font-mono">0.7</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Controls randomness: Lower values are more deterministic, higher values more creative.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-tokens">Max Response Length</Label>
                  <Input
                    id="max-tokens"
                    type="number"
                    defaultValue="256"
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum number of tokens in the AI's response.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="system-prompt">System Prompt</Label>
                  <Textarea
                    id="system-prompt"
                    rows={4}
                    defaultValue="You are a helpful assistant for a social media management platform. You help users with questions about posting content, scheduling, analytics, and engagement strategies."
                  />
                  <p className="text-xs text-muted-foreground">
                    Instructions that define how the AI behaves throughout the conversation.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save AI Configuration</Button>
              </CardFooter>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Conversation Settings</CardTitle>
              <CardDescription>
                Configure how conversations are handled and stored.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="save-history" className="flex flex-col space-y-1">
                  <span>Save Conversation History</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Store chat conversations for future reference.
                  </span>
                </Label>
                <Switch
                  id="save-history"
                  defaultChecked={true}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="history-retention">History Retention Period</Label>
                <Select defaultValue="30">
                  <SelectTrigger id="history-retention">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="human-handoff" className="flex flex-col space-y-1">
                  <span>Enable Human Handoff</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Allow conversations to be transferred to human agents.
                  </span>
                </Label>
                <Switch
                  id="human-handoff"
                  defaultChecked={true}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="handoff-threshold">Handoff After Failed Responses</Label>
                <Input
                  id="handoff-threshold"
                  type="number"
                  defaultValue="3"
                />
                <p className="text-xs text-muted-foreground">
                  Number of consecutive unclear responses before offering human support.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Conversation Settings</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Reporting</CardTitle>
              <CardDescription>
                Configure chatbot analytics and reporting settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="collect-analytics" className="flex flex-col space-y-1">
                  <span>Collect Usage Analytics</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Gather data on user interactions and chatbot performance.
                  </span>
                </Label>
                <Switch
                  id="collect-analytics"
                  defaultChecked={true}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="weekly-reports" className="flex flex-col space-y-1">
                  <span>Weekly Performance Reports</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Receive weekly email reports on chatbot performance.
                  </span>
                </Label>
                <Switch
                  id="weekly-reports"
                  defaultChecked={true}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="save-unclear" className="flex flex-col space-y-1">
                  <span>Track Unclear Queries</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Save questions the chatbot couldn't answer for review.
                  </span>
                </Label>
                <Switch
                  id="save-unclear"
                  defaultChecked={true}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Analytics Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
