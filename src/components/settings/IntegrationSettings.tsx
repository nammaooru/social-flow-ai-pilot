
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link, Plus, Settings, Zap } from "lucide-react";
import { CommonSettingsProps } from "@/pages/Settings";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  connected: boolean;
  status: "active" | "inactive" | "error";
  lastSync: string;
  icon: string;
  settings?: any;
}

export function IntegrationSettings({ onSettingChange }: CommonSettingsProps) {
  const { toast } = useToast();
  const [isWebhookDialogOpen, setIsWebhookDialogOpen] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookEvents, setWebhookEvents] = useState<string[]>([]);
  
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "1",
      name: "Google Analytics",
      description: "Track website and social media analytics",
      category: "Analytics",
      connected: true,
      status: "active",
      lastSync: "2 hours ago",
      icon: "📊"
    },
    {
      id: "2",
      name: "Slack",
      description: "Get notifications in your Slack workspace",
      category: "Communication",
      connected: true,
      status: "active",
      lastSync: "5 minutes ago",
      icon: "💬"
    },
    {
      id: "3",
      name: "Zapier",
      description: "Connect to 5000+ apps with automation",
      category: "Automation",
      connected: false,
      status: "inactive",
      lastSync: "Never",
      icon: "⚡"
    },
    {
      id: "4",
      name: "Mailchimp",
      description: "Sync subscribers and send email campaigns",
      category: "Email Marketing",
      connected: true,
      status: "error",
      lastSync: "1 day ago",
      icon: "📧"
    },
    {
      id: "5",
      name: "Canva",
      description: "Create and edit designs directly",
      category: "Design",
      connected: false,
      status: "inactive",
      lastSync: "Never",
      icon: "🎨"
    },
    {
      id: "6",
      name: "Shopify",
      description: "Sync products and promote your store",
      category: "E-commerce",
      connected: false,
      status: "inactive",
      lastSync: "Never",
      icon: "🛍️"
    }
  ]);
  
  const [webhooks] = useState([
    { id: "1", url: "https://api.example.com/webhook", events: ["post.published", "comment.created"], status: "active" },
    { id: "2", url: "https://hooks.slack.com/services/...", events: ["post.failed"], status: "active" }
  ]);
  
  const availableEvents = [
    { id: "post.published", label: "Post Published", description: "When a post is successfully published" },
    { id: "post.failed", label: "Post Failed", description: "When a post fails to publish" },
    { id: "comment.created", label: "New Comment", description: "When someone comments on your post" },
    { id: "follower.gained", label: "New Follower", description: "When you gain a new follower" },
    { id: "mention.received", label: "Mention Received", description: "When you're mentioned in a post" }
  ];
  
  const handleConnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, connected: !integration.connected, status: integration.connected ? "inactive" : "active" }
        : integration
    ));
    
    const integration = integrations.find(int => int.id === integrationId);
    toast({
      title: integration?.connected ? "Integration disconnected" : "Integration connected",
      description: `${integration?.name} has been ${integration?.connected ? "disconnected" : "connected"} successfully.`,
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  const handleCreateWebhook = () => {
    if (!webhookUrl || webhookEvents.length === 0) {
      toast({
        title: "Missing information",
        description: "Please provide a URL and select at least one event.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Webhook created",
      description: "Your webhook has been configured successfully.",
    });
    
    setWebhookUrl("");
    setWebhookEvents([]);
    setIsWebhookDialogOpen(false);
  };
  
  const handleEventToggle = (eventId: string) => {
    setWebhookEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(e => e !== eventId)
        : [...prev, eventId]
    );
  };
  
  const connectedCount = integrations.filter(int => int.connected).length;
  const categories = [...new Set(integrations.map(int => int.category))];
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Integrations</h3>
        <p className="text-sm text-muted-foreground">
          Connect your favorite tools and services to enhance your social media management workflow.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Connected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedCount}</div>
            <p className="text-xs text-muted-foreground">out of {integrations.length} available</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">integration categories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Webhooks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{webhooks.length}</div>
            <p className="text-xs text-muted-foreground">active webhooks</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="available" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="connected">Connected</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Available Integrations
              </CardTitle>
              <CardDescription>Browse and connect to available services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {categories.map(category => (
                  <div key={category} className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      {category}
                    </h4>
                    <div className="grid gap-3">
                      {integrations
                        .filter(integration => integration.category === category)
                        .map((integration) => (
                          <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{integration.icon}</div>
                              <div>
                                <p className="font-medium">{integration.name}</p>
                                <p className="text-sm text-muted-foreground">{integration.description}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              {integration.connected && (
                                <div className="text-right">
                                  <Badge variant={integration.status === "active" ? "default" : integration.status === "error" ? "destructive" : "secondary"}>
                                    {integration.status}
                                  </Badge>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Last sync: {integration.lastSync}
                                  </p>
                                </div>
                              )}
                              
                              <Button
                                variant={integration.connected ? "outline" : "default"}
                                size="sm"
                                onClick={() => handleConnect(integration.id)}
                              >
                                {integration.connected ? "Disconnect" : "Connect"}
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="connected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Connected Integrations
              </CardTitle>
              <CardDescription>Manage your active integrations and their settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.filter(int => int.connected).map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{integration.icon}</div>
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        <p className="text-sm text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge variant={integration.status === "active" ? "default" : integration.status === "error" ? "destructive" : "secondary"}>
                          {integration.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last sync: {integration.lastSync}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleConnect(integration.id)}
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {integrations.filter(int => int.connected).length === 0 && (
                  <div className="text-center p-8 text-muted-foreground">
                    <Link className="mx-auto h-12 w-12 mb-4" />
                    <p>No integrations connected yet.</p>
                    <p className="text-sm">Connect your first integration from the Available tab.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Webhooks
                  </CardTitle>
                  <CardDescription>Configure webhooks to receive real-time notifications</CardDescription>
                </div>
                <Dialog open={isWebhookDialogOpen} onOpenChange={setIsWebhookDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Webhook
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Webhook</DialogTitle>
                      <DialogDescription>
                        Configure a webhook to receive notifications about events
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="webhookUrl">Webhook URL</Label>
                        <Input
                          id="webhookUrl"
                          placeholder="https://your-domain.com/webhook"
                          value={webhookUrl}
                          onChange={(e) => setWebhookUrl(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Events</Label>
                        <div className="space-y-2">
                          {availableEvents.map((event) => (
                            <div key={event.id} className="flex items-start space-x-2">
                              <input
                                type="checkbox"
                                id={event.id}
                                checked={webhookEvents.includes(event.id)}
                                onChange={() => handleEventToggle(event.id)}
                                className="mt-1"
                              />
                              <div>
                                <Label htmlFor={event.id} className="text-sm font-medium">
                                  {event.label}
                                </Label>
                                <p className="text-xs text-muted-foreground">{event.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsWebhookDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateWebhook}>Create Webhook</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium font-mono text-sm">{webhook.url}</p>
                      <p className="text-xs text-muted-foreground">
                        Events: {webhook.events.join(", ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={webhook.status === "active" ? "default" : "secondary"}>
                        {webhook.status}
                      </Badge>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                ))}
                
                {webhooks.length === 0 && (
                  <div className="text-center p-8 text-muted-foreground">
                    <Zap className="mx-auto h-12 w-12 mb-4" />
                    <p>No webhooks configured.</p>
                    <p className="text-sm">Add your first webhook to receive real-time notifications.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
