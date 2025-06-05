
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link, Plus, Settings, Zap, Database, MessageSquare, CreditCard, Package } from "lucide-react";
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

interface StorageConfig {
  type: "localStorage" | "supabase" | "mongodb" | "postgresql" | "mysql" | "redis";
  name: string;
  connectionString?: string;
  database?: string;
  collection?: string;
  table?: string;
}

interface SMSProvider {
  id: string;
  name: string;
  type: string;
  apiConfigs: {
    singleSMS?: { endpoint: string; apiKey: string; };
    bulkSMS?: { endpoint: string; apiKey: string; };
    internationalSMS?: { endpoint: string; apiKey: string; };
    balanceCheck?: { endpoint: string; apiKey: string; };
    dlrStatus?: { endpoint: string; apiKey: string; };
    statusErrorCodes?: { endpoint: string; apiKey: string; };
    embeddingCodes?: { endpoint: string; apiKey: string; };
    xmlAPI?: { endpoint: string; apiKey: string; };
    longcodeAPI?: { endpoint: string; apiKey: string; };
    missedcallAPI?: { endpoint: string; apiKey: string; };
    simpleVoiceAPI?: { endpoint: string; apiKey: string; };
    multipleVoiceAPI?: { endpoint: string; apiKey: string; };
    fullFeaturedVoiceAPI?: { endpoint: string; apiKey: string; };
    deliveryReports?: { endpoint: string; apiKey: string; };
    voiceMessageLogs?: { endpoint: string; apiKey: string; };
    getVoices?: { endpoint: string; apiKey: string; };
    voiceScheduleInfo?: { endpoint: string; apiKey: string; };
  };
  senderId?: string;
  customFields?: Record<string, string>;
}

interface CreditPlan {
  id: string;
  name: string;
  type: "SMS" | "Voice SMS" | "Missed call" | "Long code";
  credits: number;
  price: number;
  description?: string;
  validity?: string;
  features?: string[];
}

export function IntegrationSettings({ onSettingChange }: CommonSettingsProps) {
  const { toast } = useToast();
  const [isWebhookDialogOpen, setIsWebhookDialogOpen] = useState(false);
  const [isStorageDialogOpen, setIsStorageDialogOpen] = useState(false);
  const [isSMSDialogOpen, setIsSMSDialogOpen] = useState(false);
  const [isStorageConfigureOpen, setIsStorageConfigureOpen] = useState(false);
  const [isIntegrationSettingsOpen, setIsIntegrationSettingsOpen] = useState(false);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState<StorageConfig | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookEvents, setWebhookEvents] = useState<string[]>([]);
  
  // Current user role (this would come from your auth context)
  const currentUserRole = "Super Admin"; // This should be dynamic based on actual user role
  
  const [storageConfigs, setStorageConfigs] = useState<StorageConfig[]>([
    {
      type: "localStorage",
      name: "Browser Local Storage",
    },
    {
      type: "supabase",
      name: "Admin Supabase Database",
      database: "admin_data"
    }
  ]);

  const [smsProviders, setSmsProviders] = useState<SMSProvider[]>([
    {
      id: "1",
      name: "Twilio",
      type: "twilio",
      apiConfigs: {
        singleSMS: { endpoint: "https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json", apiKey: "AC*********************" }
      },
      senderId: "+1234567890"
    }
  ]);

  const [creditPlans, setCreditPlans] = useState<CreditPlan[]>([
    {
      id: "1",
      name: "Basic SMS Plan",
      type: "SMS",
      credits: 1000,
      price: 10,
      description: "1000 SMS credits",
      validity: "30 days",
      features: ["Single SMS", "Bulk SMS", "DLR Status"]
    }
  ]);

  const [newStorageConfig, setNewStorageConfig] = useState<Partial<StorageConfig>>({
    type: "localStorage",
    name: ""
  });

  const [newSMSProvider, setNewSMSProvider] = useState<Partial<SMSProvider>>({
    name: "Twilio",
    type: "twilio",
    apiConfigs: {}
  });

  const [newCreditPlan, setNewCreditPlan] = useState<Partial<CreditPlan>>({
    type: "SMS",
    credits: 0,
    price: 0
  });
  
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
      id: "4",
      name: "Mailchimp",
      description: "Sync subscribers and send email campaigns",
      category: "Email Marketing",
      connected: true,
      status: "error",
      lastSync: "1 day ago",
      icon: "📧",
      settings: {
        apiKey: "mc-**********************",
        listId: "list_123456",
        webhookUrl: "https://api.mailchimp.com/webhook"
      }
    },
    {
      id: "6",
      name: "Shopify",
      description: "Sync products and promote your store",
      category: "E-commerce",
      connected: false,
      status: "inactive",
      lastSync: "Never",
      icon: "🛍️",
      settings: {
        shopDomain: "",
        accessToken: "",
        webhookSecret: ""
      }
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

  const storageTypes = [
    { value: "localStorage", label: "Local Storage", description: "Store data in browser local storage" },
    { value: "supabase", label: "Supabase Database", description: "Store data in Supabase PostgreSQL" },
    { value: "mongodb", label: "MongoDB", description: "Store data in MongoDB database" },
    { value: "postgresql", label: "PostgreSQL", description: "Store data in PostgreSQL database" },
    { value: "mysql", label: "MySQL", description: "Store data in MySQL database" },
    { value: "redis", label: "Redis", description: "Store data in Redis cache" }
  ];

  const smsProviderTypes = [
    { 
      value: "twilio", 
      label: "Twilio", 
      apis: ["singleSMS", "bulkSMS", "voiceAPI", "deliveryReports"] 
    },
    { 
      value: "nexmo", 
      label: "Vonage (Nexmo)", 
      apis: ["singleSMS", "bulkSMS", "internationalSMS", "deliveryReports"] 
    },
    { 
      value: "aws-sns", 
      label: "AWS SNS", 
      apis: ["singleSMS", "bulkSMS"] 
    },
    { 
      value: "textmagic", 
      label: "TextMagic", 
      apis: ["singleSMS", "bulkSMS", "deliveryReports"] 
    },
    { 
      value: "clicksend", 
      label: "ClickSend", 
      apis: ["singleSMS", "bulkSMS", "voiceAPI", "deliveryReports"] 
    },
    {
      value: "smsgatewayhub",
      label: "SMSGatewayHub",
      apis: ["singleSMS", "bulkSMS", "internationalSMS", "balanceCheck", "dlrStatus", "statusErrorCodes", "embeddingCodes", "xmlAPI", "longcodeAPI", "missedcallAPI", "simpleVoiceAPI", "multipleVoiceAPI", "fullFeaturedVoiceAPI", "deliveryReports", "voiceMessageLogs", "getVoices", "voiceScheduleInfo"]
    },
    { 
      value: "custom", 
      label: "Custom Provider", 
      apis: ["singleSMS", "bulkSMS", "internationalSMS", "balanceCheck", "dlrStatus", "statusErrorCodes", "embeddingCodes", "xmlAPI", "longcodeAPI", "missedcallAPI", "simpleVoiceAPI", "multipleVoiceAPI", "fullFeaturedVoiceAPI", "deliveryReports", "voiceMessageLogs", "getVoices", "voiceScheduleInfo"] 
    }
  ];

  const apiOptions = [
    { key: "singleSMS", label: "Single SMS API", description: "Send individual SMS messages" },
    { key: "bulkSMS", label: "Bulk SMS API", description: "Send SMS to multiple recipients" },
    { key: "internationalSMS", label: "International SMS API", description: "Send SMS internationally" },
    { key: "balanceCheck", label: "Balance Check API", description: "Check account balance" },
    { key: "dlrStatus", label: "DLR Status API", description: "Delivery receipt status" },
    { key: "statusErrorCodes", label: "Status/Error Codes API", description: "Get status and error codes" },
    { key: "embeddingCodes", label: "Embedding Codes API", description: "Embedding codes functionality" },
    { key: "xmlAPI", label: "XML API", description: "XML-based API access" },
    { key: "longcodeAPI", label: "Long code API", description: "Long code SMS functionality" },
    { key: "missedcallAPI", label: "Missed call API", description: "Missed call services" },
    { key: "simpleVoiceAPI", label: "Simple Voice API", description: "Basic voice messaging" },
    { key: "multipleVoiceAPI", label: "Multiple Voice API", description: "Multiple voice messaging" },
    { key: "fullFeaturedVoiceAPI", label: "Fully Featured Voice API", description: "Complete voice functionality" },
    { key: "deliveryReports", label: "Delivery Reports API", description: "SMS delivery reports" },
    { key: "voiceMessageLogs", label: "Voice Message Logs API", description: "Voice message logging" },
    { key: "getVoices", label: "Get Voices API", description: "Available voice options" },
    { key: "voiceScheduleInfo", label: "Voice Schedule Info API", description: "Voice message scheduling" }
  ];

  const creditTypes = [
    { value: "SMS", label: "SMS Credits" },
    { value: "Voice SMS", label: "Voice SMS Credits" },
    { value: "Missed call", label: "Missed call Credits" },
    { value: "Long code", label: "Long code Credits" }
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

  const handleConfigureIntegration = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIsIntegrationSettingsOpen(true);
  };

  const handleUpdateIntegrationSettings = () => {
    if (!selectedIntegration) return;

    setIntegrations(prev => prev.map(integration => 
      integration.id === selectedIntegration.id 
        ? { ...integration, settings: selectedIntegration.settings }
        : integration
    ));

    toast({
      title: "Settings updated",
      description: `${selectedIntegration.name} settings have been updated successfully.`,
    });

    setIsIntegrationSettingsOpen(false);
    setSelectedIntegration(null);

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

  const handleCreateStorageConfig = () => {
    if (!newStorageConfig.name || !newStorageConfig.type) {
      toast({
        title: "Missing information",
        description: "Please provide a name and select storage type.",
        variant: "destructive"
      });
      return;
    }

    const config: StorageConfig = {
      type: newStorageConfig.type as StorageConfig['type'],
      name: newStorageConfig.name,
      ...newStorageConfig
    };

    setStorageConfigs(prev => [...prev, config]);
    
    toast({
      title: "Storage configuration added",
      description: `${newStorageConfig.name} has been configured successfully.`,
    });
    
    setNewStorageConfig({ type: "localStorage", name: "" });
    setIsStorageDialogOpen(false);

    if (onSettingChange) {
      onSettingChange();
    }
  };

  const handleConfigureStorage = (config: StorageConfig) => {
    setSelectedStorage(config);
    setIsStorageConfigureOpen(true);
  };

  const handleUpdateStorageConfig = () => {
    if (!selectedStorage) return;

    setStorageConfigs(prev => prev.map(config => 
      config.name === selectedStorage.name ? selectedStorage : config
    ));

    toast({
      title: "Storage configuration updated",
      description: `${selectedStorage.name} has been updated successfully.`,
    });

    setIsStorageConfigureOpen(false);
    setSelectedStorage(null);

    if (onSettingChange) {
      onSettingChange();
    }
  };

  const handleCreateSMSProvider = () => {
    if (!newSMSProvider.name || !newSMSProvider.type) {
      toast({
        title: "Missing information",
        description: "Please provide provider details.",
        variant: "destructive"
      });
      return;
    }

    const provider: SMSProvider = {
      id: Date.now().toString(),
      name: newSMSProvider.name!,
      type: newSMSProvider.type!,
      apiConfigs: newSMSProvider.apiConfigs || {},
      ...newSMSProvider
    };

    setSmsProviders(prev => [...prev, provider]);
    
    toast({
      title: "SMS provider added",
      description: `${newSMSProvider.name} has been configured successfully.`,
    });
    
    setNewSMSProvider({ name: "Twilio", type: "twilio", apiConfigs: {} });
    setIsSMSDialogOpen(false);

    if (onSettingChange) {
      onSettingChange();
    }
  };

  const handleCreateCreditPlan = () => {
    if (!newCreditPlan.name || !newCreditPlan.type || !newCreditPlan.credits || !newCreditPlan.price) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const plan: CreditPlan = {
      id: Date.now().toString(),
      name: newCreditPlan.name!,
      type: newCreditPlan.type!,
      credits: newCreditPlan.credits!,
      price: newCreditPlan.price!,
      ...newCreditPlan
    };

    setCreditPlans(prev => [...prev, plan]);
    
    toast({
      title: "Credit plan created",
      description: `${newCreditPlan.name} has been created successfully.`,
    });
    
    setNewCreditPlan({ type: "SMS", credits: 0, price: 0 });
    setIsPlanDialogOpen(false);

    if (onSettingChange) {
      onSettingChange();
    }
  };

  const updateAPIConfig = (apiKey: string, endpoint: string, apiKeyValue: string) => {
    setNewSMSProvider(prev => ({
      ...prev,
      apiConfigs: {
        ...prev.apiConfigs,
        [apiKey]: { endpoint, apiKey: apiKeyValue }
      }
    }));
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
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.length}</div>
            <p className="text-xs text-muted-foreground">integrations available</p>
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

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storageConfigs.length}</div>
            <p className="text-xs text-muted-foreground">storage configs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">SMS Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{smsProviders.length}</div>
            <p className="text-xs text-muted-foreground">SMS providers</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="available" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="sms">SMS Marketing</TabsTrigger>
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
                              
                              <div className="flex gap-2">
                                {integration.connected && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleConfigureIntegration(integration)}
                                  >
                                    Configure
                                  </Button>
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
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
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

        <TabsContent value="storage" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Storage Configuration
                  </CardTitle>
                  <CardDescription>Configure where to store conversation messages and admin details</CardDescription>
                </div>
                <Dialog open={isStorageDialogOpen} onOpenChange={setIsStorageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Storage
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Storage Configuration</DialogTitle>
                      <DialogDescription>
                        Configure a new storage option for your data
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="storageName">Configuration Name</Label>
                        <Input
                          id="storageName"
                          placeholder="e.g., Main Database"
                          value={newStorageConfig.name || ""}
                          onChange={(e) => setNewStorageConfig(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Storage Type</Label>
                        <Select 
                          value={newStorageConfig.type} 
                          onValueChange={(value) => setNewStorageConfig(prev => ({ ...prev, type: value as StorageConfig['type'] }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select storage type" />
                          </SelectTrigger>
                          <SelectContent>
                            {storageTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div>
                                  <div className="font-medium">{type.label}</div>
                                  <div className="text-xs text-muted-foreground">{type.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {newStorageConfig.type !== "localStorage" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="connectionString">Connection String</Label>
                            <Input
                              id="connectionString"
                              type="password"
                              placeholder="Connection string or URL"
                              value={newStorageConfig.connectionString || ""}
                              onChange={(e) => setNewStorageConfig(prev => ({ ...prev, connectionString: e.target.value }))}
                            />
                          </div>

                          {newStorageConfig.type === "mongodb" && (
                            <div className="space-y-2">
                              <Label htmlFor="collection">Collection Name</Label>
                              <Input
                                id="collection"
                                placeholder="e.g., conversations"
                                value={newStorageConfig.collection || ""}
                                onChange={(e) => setNewStorageConfig(prev => ({ ...prev, collection: e.target.value }))}
                              />
                            </div>
                          )}

                          {(newStorageConfig.type === "postgresql" || newStorageConfig.type === "mysql" || newStorageConfig.type === "supabase") && (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor="database">Database Name</Label>
                                <Input
                                  id="database"
                                  placeholder="Database name"
                                  value={newStorageConfig.database || ""}
                                  onChange={(e) => setNewStorageConfig(prev => ({ ...prev, database: e.target.value }))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="table">Table Name</Label>
                                <Input
                                  id="table"
                                  placeholder="e.g., conversations"
                                  value={newStorageConfig.table || ""}
                                  onChange={(e) => setNewStorageConfig(prev => ({ ...prev, table: e.target.value }))}
                                />
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsStorageDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateStorageConfig}>Add Storage</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {storageConfigs.map((config, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{config.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{config.type}</Badge>
                          {config.database && <span>DB: {config.database}</span>}
                          {config.collection && <span>Collection: {config.collection}</span>}
                          {config.table && <span>Table: {config.table}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Active</Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleConfigureStorage(config)}
                      >
                        Configure
                      </Button>
                    </div>
                  </div>
                ))}
                
                {storageConfigs.length === 0 && (
                  <div className="text-center p-8 text-muted-foreground">
                    <Database className="mx-auto h-12 w-12 mb-4" />
                    <p>No storage configurations.</p>
                    <p className="text-sm">Add your first storage configuration to get started.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sms" className="space-y-4">
          <Tabs defaultValue="providers" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="providers">SMS Providers</TabsTrigger>
              {currentUserRole === "Super Admin" && (
                <TabsTrigger value="plans">Credit Plans</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="providers" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        SMS Marketing Providers
                      </CardTitle>
                      <CardDescription>Configure SMS providers for marketing campaigns</CardDescription>
                    </div>
                    {currentUserRole === "Super Admin" && (
                      <Dialog open={isSMSDialogOpen} onOpenChange={setIsSMSDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add SMS Provider
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Add SMS Provider</DialogTitle>
                            <DialogDescription>
                              Configure a new SMS provider for marketing campaigns
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>SMS Provider</Label>
                              <Select 
                                value={newSMSProvider.type} 
                                onValueChange={(value) => setNewSMSProvider(prev => ({ ...prev, type: value, name: smsProviderTypes.find(p => p.value === value)?.label }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select SMS provider" />
                                </SelectTrigger>
                                <SelectContent>
                                  {smsProviderTypes.map((provider) => (
                                    <SelectItem key={provider.value} value={provider.value}>
                                      {provider.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {newSMSProvider.type === "custom" && (
                              <div className="space-y-2">
                                <Label htmlFor="customProviderName">Custom Provider Name</Label>
                                <Input
                                  id="customProviderName"
                                  placeholder="Enter custom provider name"
                                  value={newSMSProvider.name || ""}
                                  onChange={(e) => setNewSMSProvider(prev => ({ ...prev, name: e.target.value }))}
                                />
                              </div>
                            )}

                            <div className="space-y-2">
                              <Label htmlFor="senderId">Sender ID / Phone Number</Label>
                              <Input
                                id="senderId"
                                placeholder="e.g., +1234567890 or BRAND"
                                value={newSMSProvider.senderId || ""}
                                onChange={(e) => setNewSMSProvider(prev => ({ ...prev, senderId: e.target.value }))}
                              />
                            </div>

                            <div className="space-y-4">
                              <Label className="text-base font-medium">API Configuration</Label>
                              <div className="grid gap-4">
                                {apiOptions.map((api) => {
                                  const selectedProvider = smsProviderTypes.find(p => p.value === newSMSProvider.type);
                                  if (!selectedProvider?.apis.includes(api.key)) return null;

                                  return (
                                    <div key={api.key} className="p-4 border rounded-lg space-y-3">
                                      <div>
                                        <h4 className="font-medium">{api.label}</h4>
                                        <p className="text-sm text-muted-foreground">{api.description}</p>
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-2">
                                          <Label htmlFor={`${api.key}-endpoint`}>API Endpoint</Label>
                                          <Input
                                            id={`${api.key}-endpoint`}
                                            placeholder="https://api.provider.com/endpoint"
                                            value={newSMSProvider.apiConfigs?.[api.key]?.endpoint || ""}
                                            onChange={(e) => updateAPIConfig(api.key, e.target.value, newSMSProvider.apiConfigs?.[api.key]?.apiKey || "")}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor={`${api.key}-key`}>API Key</Label>
                                          <Input
                                            id={`${api.key}-key`}
                                            type="password"
                                            placeholder="API Key"
                                            value={newSMSProvider.apiConfigs?.[api.key]?.apiKey || ""}
                                            onChange={(e) => updateAPIConfig(api.key, newSMSProvider.apiConfigs?.[api.key]?.endpoint || "", e.target.value)}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsSMSDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleCreateSMSProvider}>Add Provider</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {smsProviders.map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium">{provider.name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline">{provider.type}</Badge>
                              {provider.senderId && <span>Sender: {provider.senderId}</span>}
                              <span>APIs: {Object.keys(provider.apiConfigs).length}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default">Active</Badge>
                          <Button variant="outline" size="sm">Configure</Button>
                          <Button variant="outline" size="sm">Test</Button>
                        </div>
                      </div>
                    ))}
                    
                    {smsProviders.length === 0 && (
                      <div className="text-center p-8 text-muted-foreground">
                        <MessageSquare className="mx-auto h-12 w-12 mb-4" />
                        <p>No SMS providers configured.</p>
                        <p className="text-sm">Add your first SMS provider to get started with SMS marketing.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {currentUserRole === "Super Admin" && (
              <TabsContent value="plans" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Credit Plans Management
                        </CardTitle>
                        <CardDescription>Create and manage credit plans for SMS, Voice, Missed call, and Long code services</CardDescription>
                      </div>
                      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Create Plan
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Create Credit Plan</DialogTitle>
                            <DialogDescription>
                              Create a new credit plan for users to purchase
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="planName">Plan Name</Label>
                              <Input
                                id="planName"
                                placeholder="e.g., Premium SMS Plan"
                                value={newCreditPlan.name || ""}
                                onChange={(e) => setNewCreditPlan(prev => ({ ...prev, name: e.target.value }))}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Credit Type</Label>
                              <Select 
                                value={newCreditPlan.type} 
                                onValueChange={(value) => setNewCreditPlan(prev => ({ ...prev, type: value as CreditPlan['type'] }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select credit type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {creditTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label htmlFor="credits">Credits</Label>
                                <Input
                                  id="credits"
                                  type="number"
                                  placeholder="1000"
                                  value={newCreditPlan.credits || ""}
                                  onChange={(e) => setNewCreditPlan(prev => ({ ...prev, credits: parseInt(e.target.value) || 0 }))}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input
                                  id="price"
                                  type="number"
                                  step="0.01"
                                  placeholder="10.00"
                                  value={newCreditPlan.price || ""}
                                  onChange={(e) => setNewCreditPlan(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="planDescription">Description</Label>
                              <Textarea
                                id="planDescription"
                                placeholder="Plan description..."
                                value={newCreditPlan.description || ""}
                                onChange={(e) => setNewCreditPlan(prev => ({ ...prev, description: e.target.value }))}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="validity">Validity Period</Label>
                              <Input
                                id="validity"
                                placeholder="e.g., 30 days, 1 year"
                                value={newCreditPlan.validity || ""}
                                onChange={(e) => setNewCreditPlan(prev => ({ ...prev, validity: e.target.value }))}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsPlanDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleCreateCreditPlan}>Create Plan</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {creditPlans.map((plan) => (
                        <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium">{plan.name}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="outline">{plan.type}</Badge>
                                <span>{plan.credits} credits</span>
                                <span>${plan.price}</span>
                                {plan.validity && <span>Valid: {plan.validity}</span>}
                              </div>
                              {plan.description && (
                                <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="default">Active</Badge>
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">Disable</Button>
                          </div>
                        </div>
                      ))}
                      
                      {creditPlans.length === 0 && (
                        <div className="text-center p-8 text-muted-foreground">
                          <Package className="mx-auto h-12 w-12 mb-4" />
                          <p>No credit plans created.</p>
                          <p className="text-sm">Create your first credit plan to get started.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* Storage Configuration Dialog */}
      <Dialog open={isStorageConfigureOpen} onOpenChange={setIsStorageConfigureOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configure Storage</DialogTitle>
            <DialogDescription>
              Update storage configuration settings
            </DialogDescription>
          </DialogHeader>
          {selectedStorage && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editStorageName">Configuration Name</Label>
                <Input
                  id="editStorageName"
                  value={selectedStorage.name}
                  onChange={(e) => setSelectedStorage(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              
              {selectedStorage.type !== "localStorage" && (
                <div className="space-y-2">
                  <Label htmlFor="editConnectionString">Connection String</Label>
                  <Input
                    id="editConnectionString"
                    type="password"
                    value={selectedStorage.connectionString || ""}
                    onChange={(e) => setSelectedStorage(prev => prev ? { ...prev, connectionString: e.target.value } : null)}
                  />
                </div>
              )}

              {selectedStorage.type === "mongodb" && (
                <div className="space-y-2">
                  <Label htmlFor="editCollection">Collection Name</Label>
                  <Input
                    id="editCollection"
                    value={selectedStorage.collection || ""}
                    onChange={(e) => setSelectedStorage(prev => prev ? { ...prev, collection: e.target.value } : null)}
                  />
                </div>
              )}

              {(selectedStorage.type === "postgresql" || selectedStorage.type === "mysql" || selectedStorage.type === "supabase") && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="editDatabase">Database Name</Label>
                    <Input
                      id="editDatabase"
                      value={selectedStorage.database || ""}
                      onChange={(e) => setSelectedStorage(prev => prev ? { ...prev, database: e.target.value } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editTable">Table Name</Label>
                    <Input
                      id="editTable"
                      value={selectedStorage.table || ""}
                      onChange={(e) => setSelectedStorage(prev => prev ? { ...prev, table: e.target.value } : null)}
                    />
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStorageConfigureOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStorageConfig}>Update Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Integration Settings Dialog */}
      <Dialog open={isIntegrationSettingsOpen} onOpenChange={setIsIntegrationSettingsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configure {selectedIntegration?.name}</DialogTitle>
            <DialogDescription>
              Update integration settings and credentials
            </DialogDescription>
          </DialogHeader>
          {selectedIntegration && (
            <div className="space-y-4">
              {selectedIntegration.name === "Mailchimp" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="mailchimpApiKey">API Key</Label>
                    <Input
                      id="mailchimpApiKey"
                      type="password"
                      placeholder="Enter Mailchimp API Key"
                      value={selectedIntegration.settings?.apiKey || ""}
                      onChange={(e) => setSelectedIntegration(prev => prev ? {
                        ...prev,
                        settings: { ...prev.settings, apiKey: e.target.value }
                      } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mailchimpListId">List ID</Label>
                    <Input
                      id="mailchimpListId"
                      placeholder="Enter List ID"
                      value={selectedIntegration.settings?.listId || ""}
                      onChange={(e) => setSelectedIntegration(prev => prev ? {
                        ...prev,
                        settings: { ...prev.settings, listId: e.target.value }
                      } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mailchimpWebhook">Webhook URL</Label>
                    <Input
                      id="mailchimpWebhook"
                      placeholder="Enter Webhook URL"
                      value={selectedIntegration.settings?.webhookUrl || ""}
                      onChange={(e) => setSelectedIntegration(prev => prev ? {
                        ...prev,
                        settings: { ...prev.settings, webhookUrl: e.target.value }
                      } : null)}
                    />
                  </div>
                </>
              )}

              {selectedIntegration.name === "Shopify" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="shopifyDomain">Shop Domain</Label>
                    <Input
                      id="shopifyDomain"
                      placeholder="your-shop.myshopify.com"
                      value={selectedIntegration.settings?.shopDomain || ""}
                      onChange={(e) => setSelectedIntegration(prev => prev ? {
                        ...prev,
                        settings: { ...prev.settings, shopDomain: e.target.value }
                      } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shopifyAccessToken">Access Token</Label>
                    <Input
                      id="shopifyAccessToken"
                      type="password"
                      placeholder="Enter Access Token"
                      value={selectedIntegration.settings?.accessToken || ""}
                      onChange={(e) => setSelectedIntegration(prev => prev ? {
                        ...prev,
                        settings: { ...prev.settings, accessToken: e.target.value }
                      } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shopifyWebhookSecret">Webhook Secret</Label>
                    <Input
                      id="shopifyWebhookSecret"
                      type="password"
                      placeholder="Enter Webhook Secret"
                      value={selectedIntegration.settings?.webhookSecret || ""}
                      onChange={(e) => setSelectedIntegration(prev => prev ? {
                        ...prev,
                        settings: { ...prev.settings, webhookSecret: e.target.value }
                      } : null)}
                    />
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsIntegrationSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateIntegrationSettings}>Save Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
