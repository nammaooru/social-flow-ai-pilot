
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, MessageCircle, Book, ExternalLink, Clock } from "lucide-react";
import { CommonSettingsProps } from "@/pages/Settings";

interface SupportSettingsProps extends CommonSettingsProps {
  // No need to redefine role as it's already in CommonSettingsProps with the correct type
}

export function SupportSettings({ role, onSettingChange }: SupportSettingsProps) {
  const { toast } = useToast();
  const [supportForm, setSupportForm] = useState({
    subject: "",
    category: "",
    priority: "",
    description: ""
  });
  
  const [tickets] = useState([
    { id: "TKT-001", subject: "Integration issue", status: "Open", priority: "High", created: "2024-02-15" },
    { id: "TKT-002", subject: "Account settings", status: "Resolved", priority: "Medium", created: "2024-02-10" },
    { id: "TKT-003", subject: "Billing question", status: "In Progress", priority: "Low", created: "2024-02-08" }
  ]);
  
  const handleSubmitTicket = () => {
    if (!supportForm.subject || !supportForm.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Support ticket created",
      description: "Your support request has been submitted successfully. We'll get back to you soon.",
    });
    
    setSupportForm({ subject: "", category: "", priority: "", description: "" });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  const handleInputChange = (field: string, value: string) => {
    setSupportForm(prev => ({ ...prev, [field]: value }));
  };
  
  const handleStartChat = () => {
    toast({
      title: "Chat initiated",
      description: "Connecting you to our support team...",
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Support</h3>
        <p className="text-sm text-muted-foreground">
          Get help with your account, access documentation, and contact our support team.
        </p>
        {role && <Badge variant="outline" className="mt-2">Current role: {role}</Badge>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">&lt; 2h</div>
            <p className="text-xs text-muted-foreground">average first response</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">active support requests</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Support Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Pro</div>
            <p className="text-xs text-muted-foreground">priority support included</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="create" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create">Create Ticket</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Create Support Ticket
              </CardTitle>
              <CardDescription>Submit a detailed support request to our team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={supportForm.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={supportForm.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                  >
                    <option value="">Select category</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing</option>
                    <option value="account">Account</option>
                    <option value="feature">Feature Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={supportForm.priority}
                  onChange={(e) => handleInputChange("priority", e.target.value)}
                >
                  <option value="">Select priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  className="w-full h-32 p-3 border rounded-md"
                  placeholder="Please provide detailed information about your issue, including steps to reproduce if applicable..."
                  value={supportForm.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>
              
              <Button onClick={handleSubmitTicket} className="w-full">
                Submit Support Ticket
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Support Tickets
              </CardTitle>
              <CardDescription>Track your support requests and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{ticket.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {ticket.id} • Created: {ticket.created}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={
                        ticket.priority === "High" ? "destructive" :
                        ticket.priority === "Medium" ? "default" : "secondary"
                      }>
                        {ticket.priority}
                      </Badge>
                      <Badge variant={
                        ticket.status === "Open" ? "destructive" :
                        ticket.status === "In Progress" ? "default" : "secondary"
                      }>
                        {ticket.status}
                      </Badge>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Live Chat Support
              </CardTitle>
              <CardDescription>Get instant help from our support team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Chat with Support</h3>
                <p className="text-muted-foreground mb-4">
                  Our support team is available 24/7 to help you with any questions or issues.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Support team is online</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Average response time: &lt; 30 seconds
                  </p>
                </div>
                <Button onClick={handleStartChat} className="mt-4">
                  Start Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Help Resources
              </CardTitle>
              <CardDescription>Find answers in our documentation and guides</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Getting Started Guide</p>
                    <p className="text-sm text-muted-foreground">
                      Learn the basics of using our platform
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">API Documentation</p>
                    <p className="text-sm text-muted-foreground">
                      Complete API reference and examples
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Video Tutorials</p>
                    <p className="text-sm text-muted-foreground">
                      Step-by-step video guides
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">FAQ</p>
                    <p className="text-sm text-muted-foreground">
                      Frequently asked questions and answers
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Community Forum</p>
                    <p className="text-sm text-muted-foreground">
                      Connect with other users and share knowledge
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
