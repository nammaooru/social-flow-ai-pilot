
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Bot, Settings, Zap } from "lucide-react";
import { CommonSettingsProps } from "@/pages/Settings";

interface ChatbotSettingsProps extends CommonSettingsProps {
  // No need to redefine role as it's already in CommonSettingsProps with the correct type
}

export function ChatbotSettings({ role, onSettingChange }: ChatbotSettingsProps) {
  const { toast } = useToast();
  const [chatbotConfig, setChatbotConfig] = useState({
    enabled: true,
    name: "Social Assistant",
    greeting: "Hi! I'm here to help you with your social media management. How can I assist you today?",
    language: "en",
    responseTime: "fast",
    personality: "professional",
    autoResponse: true,
    learningMode: true,
    offlineMessage: "I'm currently offline. Please leave a message and I'll get back to you soon.",
    workingHours: {
      enabled: false,
      start: "09:00",
      end: "17:00",
      timezone: "UTC"
    }
  });
  
  const [responses] = useState([
    { id: "1", trigger: "pricing", response: "Our plans start at $19/month. Would you like to see our pricing page?", category: "billing" },
    { id: "2", trigger: "support", response: "I can help you with that! What specific issue are you experiencing?", category: "support" },
    { id: "3", trigger: "features", response: "We offer content scheduling, analytics, team collaboration, and more. What feature interests you most?", category: "features" }
  ]);
  
  const [analytics] = useState({
    totalConversations: 1247,
    avgResponseTime: "2.3s",
    satisfactionRate: 94,
    topQuestions: [
      { question: "How to schedule posts?", count: 156 },
      { question: "Pricing information", count: 134 },
      { question: "API documentation", count: 89 },
      { question: "Team management", count: 67 }
    ]
  });
  
  const handleSave = () => {
    toast({
      title: "Chatbot settings saved",
      description: "Your chatbot configuration has been updated successfully.",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  const handleConfigChange = (field: string, value: any) => {
    setChatbotConfig(prev => ({ ...prev, [field]: value }));
  };
  
  const handleWorkingHoursChange = (field: string, value: any) => {
    setChatbotConfig(prev => ({
      ...prev,
      workingHours: { ...prev.workingHours, [field]: value }
    }));
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Chatbot</h3>
        <p className="text-sm text-muted-foreground">
          Configure your AI-powered chatbot to provide automated customer support.
        </p>
        {role && <Badge variant="outline" className="mt-2">Current role: {role}</Badge>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalConversations}</div>
            <p className="text-xs text-muted-foreground">total conversations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">average response</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.satisfactionRate}%</div>
            <p className="text-xs text-muted-foreground">user satisfaction</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${chatbotConfig.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <div className="text-2xl font-bold">{chatbotConfig.enabled ? 'Online' : 'Offline'}</div>
            </div>
            <p className="text-xs text-muted-foreground">current status</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="responses">Responses</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Basic Configuration
              </CardTitle>
              <CardDescription>Configure basic chatbot settings and appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enabled">Enable Chatbot</Label>
                  <p className="text-sm text-muted-foreground">
                    Activate the chatbot on your website
                  </p>
                </div>
                <Switch
                  id="enabled"
                  checked={chatbotConfig.enabled}
                  onCheckedChange={(checked) => handleConfigChange("enabled", checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Chatbot Name</Label>
                <Input
                  id="name"
                  value={chatbotConfig.name}
                  onChange={(e) => handleConfigChange("name", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="greeting">Welcome Message</Label>
                <textarea
                  id="greeting"
                  className="w-full h-24 p-3 border rounded-md"
                  value={chatbotConfig.greeting}
                  onChange={(e) => handleConfigChange("greeting", e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={chatbotConfig.language} onValueChange={(value) => handleConfigChange("language", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="personality">Personality</Label>
                  <Select value={chatbotConfig.personality} onValueChange={(value) => handleConfigChange("personality", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Working Hours</CardTitle>
              <CardDescription>Set when your chatbot should be active</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="workingHoursEnabled">Enable Working Hours</Label>
                  <p className="text-sm text-muted-foreground">
                    Show offline message outside working hours
                  </p>
                </div>
                <Switch
                  id="workingHoursEnabled"
                  checked={chatbotConfig.workingHours.enabled}
                  onCheckedChange={(checked) => handleWorkingHoursChange("enabled", checked)}
                />
              </div>
              
              {chatbotConfig.workingHours.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={chatbotConfig.workingHours.start}
                      onChange={(e) => handleWorkingHoursChange("start", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={chatbotConfig.workingHours.end}
                      onChange={(e) => handleWorkingHoursChange("end", e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="offlineMessage">Offline Message</Label>
                <textarea
                  id="offlineMessage"
                  className="w-full h-20 p-3 border rounded-md"
                  value={chatbotConfig.offlineMessage}
                  onChange={(e) => handleConfigChange("offlineMessage", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="responses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Automated Responses
              </CardTitle>
              <CardDescription>Manage pre-configured responses for common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {responses.map((response) => (
                  <div key={response.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Trigger: "{response.trigger}"</p>
                      <Badge variant="outline">{response.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{response.response}</p>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full">
                  Add New Response
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="behavior" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Behavior Settings
              </CardTitle>
              <CardDescription>Configure how your chatbot behaves and learns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoResponse">Auto Response</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically respond to common questions
                  </p>
                </div>
                <Switch
                  id="autoResponse"
                  checked={chatbotConfig.autoResponse}
                  onCheckedChange={(checked) => handleConfigChange("autoResponse", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="learningMode">Learning Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Learn from conversations to improve responses
                  </p>
                </div>
                <Switch
                  id="learningMode"
                  checked={chatbotConfig.learningMode}
                  onCheckedChange={(checked) => handleConfigChange("learningMode", checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="responseTime">Response Speed</Label>
                <Select value={chatbotConfig.responseTime} onValueChange={(value) => handleConfigChange("responseTime", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="fast">Fast (1-2s)</SelectItem>
                    <SelectItem value="normal">Normal (2-3s)</SelectItem>
                    <SelectItem value="slow">Slow (3-5s)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Chatbot Analytics
              </CardTitle>
              <CardDescription>Monitor chatbot performance and user interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-medium">Most Asked Questions</h4>
                <div className="space-y-2">
                  {analytics.topQuestions.map((question, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{question.question}</span>
                      <Badge variant="secondary">{question.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
}
