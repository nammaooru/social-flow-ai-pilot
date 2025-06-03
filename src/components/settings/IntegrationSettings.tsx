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
import { Link, Plus, Settings, Zap, Database, MessageSquare, CreditCard, Phone, PhoneCall } from "lucide-react";
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
  config: Record<string, string>;
  isActive: boolean;
  testResults?: string;
}

interface SMSPlan {
  id: string;
  name: string;
  description: string;
  features: {
    smsCredits: number;
    voiceSmsCredits: number;
    missedCallCredits: number;
    longCodeCredits: number;
    additionalFeatures: string[];
  };
  pricing: {
    amount: number;
    currency: string;
    billingPeriod: string;
  };
  isActive: boolean;
}

interface UserSubscription {
  planId: string;
  planName: string;
  subscribedAt: string;
  expiresAt: string;
  usage: {
    smsUsed: number;
    voiceSmsUsed: number;
    missedCallUsed: number;
    longCodeUsed: number;
  };
  limits: {
    smsCredits: number;
    voiceSmsCredits: number;
    missedCallCredits: number;
    longCodeCredits: number;
  };
}

export function IntegrationSettings({ onSettingChange, role }: CommonSettingsProps) {
  const { toast } = useToast();
  const [isWebhookDialogOpen, setIsWebhookDialogOpen] = useState(false);
  const [isStorageDialogOpen, setIsStorageDialogOpen] = useState(false);
  const [isSMSDialogOpen, setIsSMSDialogOpen] = useState(false);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isStorageConfigureOpen, setIsStorageConfigureOpen] = useState(false);
  const [isIntegrationSettingsOpen, setIsIntegrationSettingsOpen] = useState(false);
  const [isProviderConfigureOpen, setIsProviderConfigureOpen] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState<StorageConfig | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<SMSProvider | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookEvents, setWebhookEvents] = useState<string[]>([]);
  
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

  const [newStorageConfig, setNewStorageConfig] = useState<Partial<StorageConfig>>({
    type: "localStorage",
    name: ""
  });

  // SMS Providers state
  const [smsProviders, setSmsProviders] = useState<SMSProvider[]>([
    {
      id: "1",
      name: "Twilio",
      type: "twilio",
      config: {
        accountSid: "AC*********************",
        authToken: "*********************",
        senderId: "+1234567890"
      },
      isActive: true
    },
    {
      id: "2",
      name: "SMSGatewayHub",
      type: "smsgatewayhub",
      config: {
        apiKey: "sgw_**********************",
        senderId: "BRAND",
        route: "promotional"
      },
      isActive: true
    }
  ]);

  // SMS Plans state
  const [smsPlans, setSmsPlans] = useState<SMSPlan[]>([
    {
      id: "1",
      name: "Basic SMS Plan",
      description: "Perfect for small businesses",
      features: {
        smsCredits: 1000,
        voiceSmsCredits: 100,
        missedCallCredits: 50,
        longCodeCredits: 25,
        additionalFeatures: ["DLR Status", "Balance Check", "Simple Voice API"]
      },
      pricing: {
        amount: 29.99,
        currency: "USD",
        billingPeriod: "monthly"
      },
      isActive: true
    },
    {
      id: "2",
      name: "Professional SMS Plan",
      description: "Advanced features for growing businesses",
      features: {
        smsCredits: 5000,
        voiceSmsCredits: 500,
        missedCallCredits: 250,
        longCodeCredits: 100,
        additionalFeatures: ["All Basic features", "Bulk SMS API", "International SMS", "XML API", "Multiple Voice API"]
      },
      pricing: {
        amount: 99.99,
        currency: "USD",
        billingPeriod: "monthly"
      },
      isActive: true
    }
  ]);

  // User subscription state
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>({
    planId: "1",
    planName: "Basic SMS Plan",
    subscribedAt: "2024-01-15",
    expiresAt: "2024-02-15",
    usage: {
      smsUsed: 250,
      voiceSmsUsed: 15,
      missedCallUsed: 8,
      longCodeUsed: 3
    },
    limits: {
      smsCredits: 1000,
      voiceSmsCredits: 100,
      missedCallCredits: 50,
      longCodeCredits: 25
    }
  });

  const [newSMSProvider, setNewSMSProvider] = useState<Partial<SMSProvider>>({
    name: "",
    type: "twilio",
    config: {}
  });

  const [newSMSPlan, setNewSMSPlan] = useState<Partial<SMSPlan>>({
    name: "",
    description: "",
    features: {
      smsCredits: 0,
      voiceSmsCredits: 0,
      missedCallCredits: 0,
      longCodeCredits: 0,
      additionalFeatures: []
    },
    pricing: {
      amount: 0,
      currency: "USD",
      billingPeriod: "monthly"
    }
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
      fields: [
        { key: "accountSid", label: "Account SID", type: "password" },
        { key: "authToken", label: "Auth Token", type: "password" },
        { key: "senderId", label: "Sender ID", type: "text" }
      ]
    },
    { 
      value: "smsgatewayhub", 
      label: "SMSGatewayHub", 
      fields: [
        { key: "apiKey", label: "API Key", type: "password" },
        { key: "senderId", label: "Sender ID", type: "text" },
        { key: "route", label: "Route (promotional/transactional)", type: "text" },
        { key: "singleSmsApi", label: "Single SMS API Endpoint", type: "text" },
        { key: "bulkSmsApi", label: "Bulk SMS API Endpoint", type: "text" },
        { key: "internationalSmsApi", label: "International SMS API Endpoint", type: "text" },
        { key: "balanceCheckApi", label: "Balance Check API", type: "text" },
        { key: "dlrStatusApi", label: "DLR Status API", type: "text" },
        { key: "xmlApi", label: "XML API Endpoint", type: "text" },
        { key: "longCodeApi", label: "Long Code API", type: "text" },
        { key: "missedCallApi", label: "Missed Call API", type: "text" },
        { key: "simpleVoiceApi", label: "Simple Voice API", type: "text" },
        { key: "multipleVoiceApi", label: "Multiple Voice API", type: "text" },
        { key: "featuredVoiceApi", label: "Fully Featured Voice API", type: "text" }
      ]
    },
    { 
      value: "vonage", 
      label: "Vonage (Nexmo)", 
      fields: [
        { key: "apiKey", label: "API Key", type: "password" },
        { key: "apiSecret", label: "API Secret", type: "password" },
        { key: "senderId", label: "Sender ID", type: "text" }
      ]
    },
    { 
      value: "aws-sns", 
      label: "AWS SNS", 
      fields: [
        { key: "accessKeyId", label: "Access Key ID", type: "password" },
        { key: "secretAccessKey", label: "Secret Access Key", type: "password" },
        { key: "region", label: "Region", type: "text" }
      ]
    },
    { 
      value: "custom", 
      label: "Custom Provider", 
      fields: [
        { key: "providerName", label: "Provider Name", type: "text" },
        { key: "apiKey", label: "API Key", type: "password" },
        { key: "apiSecret", label: "API Secret", type: "password" },
        { key: "webhookUrl", label: "Webhook URL", type: "text" },
        { key: "senderId", label: "Sender ID", type: "text" }
      ]
    }
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

  // SMS Provider handlers
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
      config: newSMSProvider.config || {},
      isActive: true
    };

    setSmsProviders(prev => [...prev, provider]);
    
    toast({
      title: "SMS provider added",
      description: `${newSMSProvider.name} has been configured successfully.`,
    });
    
    setNewSMSProvider({ name: "", type: "twilio", config: {} });
    setIsSMSDialogOpen(false);

    if (onSettingChange) {
      onSettingChange();
    }
  };

  const handleConfigureProvider = (provider: SMSProvider) => {
    setSelectedProvider(provider);
    setIsProviderConfigureOpen(true);
  };

  const handleTestProvider = async (provider: SMSProvider) => {
    toast({
      title: "Testing SMS provider",
      description: "Sending test SMS...",
    });

    // Simulate API test
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate
      
      setSmsProviders(prev => prev.map(p => 
        p.id === provider.id 
          ? { ...p, testResults: success ? "Test successful" : "Test failed - Check configuration" }
          : p
      ));

      toast({
        title: success ? "Test successful" : "Test failed",
        description: success ? "SMS provider is working correctly" : "Please check your configuration",
        variant: success ? "default" : "destructive"
      });
    }, 2000);
  };

  const handleUpdateProvider = () => {
    if (!selectedProvider) return;

    setSmsProviders(prev => prev.map(provider => 
      provider.id === selectedProvider.id ? selectedProvider : provider
    ));

    toast({
      title: "Provider updated",
      description: `${selectedProvider.name} has been updated successfully.`,
    });

    setIsProviderConfigureOpen(false);
    setSelectedProvider(null);

    if (onSettingChange) {
      onSettingChange();
    }
  };

  // SMS Plan handlers
  const handleCreateSMSPlan = () => {
    if (!newSMSPlan.name || !newSMSPlan.pricing?.amount) {
      toast({
        title: "Missing information",
        description: "Please provide plan name and pricing details.",
        variant: "destructive"
      });
      return;
    }

    const plan: SMSPlan = {
      id: Date.now().toString(),
      name: newSMSPlan.name!,
      description: newSMSPlan.description || "",
      features: newSMSPlan.features!,
      pricing: newSMSPlan.pricing!,
      isActive: true
    };

    setSmsPlans(prev => [...prev, plan]);
    
    toast({
      title: "SMS plan created",
      description: `${newSMSPlan.name} has been created successfully.`,
    });
    
    setNewSMSPlan({
      name: "",
      description: "",
      features: {
        smsCredits: 0,
        voiceSmsCredits: 0,
        missedCallCredits: 0,
        longCodeCredits: 0,
        additionalFeatures: []
      },
      pricing: {
        amount: 0,
        currency: "USD",
        billingPeriod: "monthly"
      }
    });
    setIsPlanDialogOpen(false);

    if (onSettingChange) {
      onSettingChange();
    }
  };

  const handleSubscribeToPlan = (planId: string) => {
    const plan = smsPlans.find(p => p.id === planId);
    if (!plan) return;

    toast({
      title: "Redirecting to payment",
      description: "Opening payment gateway...",
    });

    // Simulate payment gateway redirect
    setTimeout(() => {
      setUserSubscription({
        planId: plan.id,
        planName: plan.name,
        subscribedAt: new Date().toISOString().split('T')[0],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usage: {
          smsUsed: 0,
          voiceSmsUsed: 0,
          missedCallUsed: 0,
          longCodeUsed: 0
        },
        limits: plan.features
      });

      toast({
        title: "Subscription successful",
        description: `You are now subscribed to ${plan.name}`,
      });
    }, 2000);
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
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.length}</div>
            <p className="text-xs text-muted-foreground">total integrations</p>
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
          {role === "Super Admin" ? (
            <div className="space-y-4">
              {/* SMS Providers Management */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        SMS Providers Management
                      </CardTitle>
                      <CardDescription>Configure SMS providers for the platform</CardDescription>
                    </div>
                    <Dialog open={isSMSDialogOpen} onOpenChange={setIsSMSDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Add SMS Provider
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add SMS Provider</DialogTitle>
                          <DialogDescription>
                            Configure a new SMS provider for marketing campaigns
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="providerName">Provider Name</Label>
                            <Input
                              id="providerName"
                              placeholder="Enter provider name"
                              value={newSMSProvider.name || ""}
                              onChange={(e) => setNewSMSProvider(prev => ({ ...prev, name: e.target.value }))}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>SMS Provider Type</Label>
                            <Select 
                              value={newSMSProvider.type} 
                              onValueChange={(value) => setNewSMSProvider(prev => ({ ...prev, type: value, config: {} }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select SMS provider type" />
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

                          {newSMSProvider.type && (
                            <div className="space-y-4">
                              <h4 className="font-medium">Provider Configuration</h4>
                              {smsProviderTypes
                                .find(p => p.value === newSMSProvider.type)
                                ?.fields.map((field) => (
                                  <div key={field.key} className="space-y-2">
                                    <Label htmlFor={field.key}>{field.label}</Label>
                                    <Input
                                      id={field.key}
                                      type={field.type}
                                      placeholder={`Enter ${field.label}`}
                                      value={newSMSProvider.config?.[field.key] || ""}
                                      onChange={(e) => setNewSMSProvider(prev => ({ 
                                        ...prev, 
                                        config: { ...prev.config, [field.key]: e.target.value }
                                      }))}
                                    />
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsSMSDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateSMSProvider}>Add Provider</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
                              {provider.testResults && (
                                <span className={provider.testResults.includes("successful") ? "text-green-600" : "text-red-600"}>
                                  {provider.testResults}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={provider.isActive ? "default" : "secondary"}>
                            {provider.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleConfigureProvider(provider)}
                          >
                            Configure
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleTestProvider(provider)}
                          >
                            Test
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* SMS Plans Management */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        SMS Plans Management
                      </CardTitle>
                      <CardDescription>Create and manage SMS credit plans</CardDescription>
                    </div>
                    <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Create Plan
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Create SMS Plan</DialogTitle>
                          <DialogDescription>
                            Create a new SMS credit plan for users
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="planName">Plan Name</Label>
                              <Input
                                id="planName"
                                placeholder="e.g., Basic SMS Plan"
                                value={newSMSPlan.name || ""}
                                onChange={(e) => setNewSMSPlan(prev => ({ ...prev, name: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="planAmount">Price ($)</Label>
                              <Input
                                id="planAmount"
                                type="number"
                                placeholder="29.99"
                                value={newSMSPlan.pricing?.amount || ""}
                                onChange={(e) => setNewSMSPlan(prev => ({ 
                                  ...prev, 
                                  pricing: { ...prev.pricing!, amount: parseFloat(e.target.value) || 0 }
                                }))}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="planDescription">Description</Label>
                            <Textarea
                              id="planDescription"
                              placeholder="Plan description..."
                              value={newSMSPlan.description || ""}
                              onChange={(e) => setNewSMSPlan(prev => ({ ...prev, description: e.target.value }))}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="smsCredits">SMS Credits</Label>
                              <Input
                                id="smsCredits"
                                type="number"
                                placeholder="1000"
                                value={newSMSPlan.features?.smsCredits || ""}
                                onChange={(e) => setNewSMSPlan(prev => ({ 
                                  ...prev, 
                                  features: { ...prev.features!, smsCredits: parseInt(e.target.value) || 0 }
                                }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="voiceSmsCredits">Voice SMS Credits</Label>
                              <Input
                                id="voiceSmsCredits"
                                type="number"
                                placeholder="100"
                                value={newSMSPlan.features?.voiceSmsCredits || ""}
                                onChange={(e) => setNewSMSPlan(prev => ({ 
                                  ...prev, 
                                  features: { ...prev.features!, voiceSmsCredits: parseInt(e.target.value) || 0 }
                                }))}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="missedCallCredits">Missed Call Credits</Label>
                              <Input
                                id="missedCallCredits"
                                type="number"
                                placeholder="50"
                                value={newSMSPlan.features?.missedCallCredits || ""}
                                onChange={(e) => setNewSMSPlan(prev => ({ 
                                  ...prev, 
                                  features: { ...prev.features!, missedCallCredits: parseInt(e.target.value) || 0 }
                                }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="longCodeCredits">Long Code Credits</Label>
                              <Input
                                id="longCodeCredits"
                                type="number"
                                placeholder="25"
                                value={newSMSPlan.features?.longCodeCredits || ""}
                                onChange={(e) => setNewSMSPlan(prev => ({ 
                                  ...prev, 
                                  features: { ...prev.features!, longCodeCredits: parseInt(e.target.value) || 0 }
                                }))}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Billing Period</Label>
                            <Select 
                              value={newSMSPlan.pricing?.billingPeriod} 
                              onValueChange={(value) => setNewSMSPlan(prev => ({ 
                                ...prev, 
                                pricing: { ...prev.pricing!, billingPeriod: value }
                              }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select billing period" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsPlanDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateSMSPlan}>Create Plan</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {smsPlans.map((plan) => (
                      <div key={plan.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{plan.name}</h4>
                            <p className="text-sm text-muted-foreground">{plan.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${plan.pricing.amount}/{plan.pricing.billingPeriod}</p>
                            <Badge variant={plan.isActive ? "default" : "secondary"}>
                              {plan.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="font-medium">SMS Credits</p>
                            <p className="text-muted-foreground">{plan.features.smsCredits}</p>
                          </div>
                          <div>
                            <p className="font-medium">Voice SMS</p>
                            <p className="text-muted-foreground">{plan.features.voiceSmsCredits}</p>
                          </div>
                          <div>
                            <p className="font-medium">Missed Call</p>
                            <p className="text-muted-foreground">{plan.features.missedCallCredits}</p>
                          </div>
                          <div>
                            <p className="font-medium">Long Code</p>
                            <p className="text-muted-foreground">{plan.features.longCodeCredits}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* SMS Marketing for White Label and Admin */
            <div className="space-y-4">
              {/* Current Subscription */}
              {userSubscription && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Current SMS Subscription
                    </CardTitle>
                    <CardDescription>Your active SMS marketing plan and usage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-green-900">{userSubscription.planName}</h4>
                          <p className="text-sm text-green-700">
                            Active until {new Date(userSubscription.expiresAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="default" className="bg-green-600">Active</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-4 w-4" />
                            <p className="font-medium text-sm">SMS Credits</p>
                          </div>
                          <p className="text-2xl font-bold">{userSubscription.limits.smsCredits - userSubscription.usage.smsUsed}</p>
                          <p className="text-xs text-muted-foreground">
                            {userSubscription.usage.smsUsed} used of {userSubscription.limits.smsCredits}
                          </p>
                        </div>

                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Phone className="h-4 w-4" />
                            <p className="font-medium text-sm">Voice SMS</p>
                          </div>
                          <p className="text-2xl font-bold">{userSubscription.limits.voiceSmsCredits - userSubscription.usage.voiceSmsUsed}</p>
                          <p className="text-xs text-muted-foreground">
                            {userSubscription.usage.voiceSmsUsed} used of {userSubscription.limits.voiceSmsCredits}
                          </p>
                        </div>

                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <PhoneCall className="h-4 w-4" />
                            <p className="font-medium text-sm">Missed Call</p>
                          </div>
                          <p className="text-2xl font-bold">{userSubscription.limits.missedCallCredits - userSubscription.usage.missedCallUsed}</p>
                          <p className="text-xs text-muted-foreground">
                            {userSubscription.usage.missedCallUsed} used of {userSubscription.limits.missedCallCredits}
                          </p>
                        </div>

                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Settings className="h-4 w-4" />
                            <p className="font-medium text-sm">Long Code</p>
                          </div>
                          <p className="text-2xl font-bold">{userSubscription.limits.longCodeCredits - userSubscription.usage.longCodeUsed}</p>
                          <p className="text-xs text-muted-foreground">
                            {userSubscription.usage.longCodeUsed} used of {userSubscription.limits.longCodeCredits}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Available Plans */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Available SMS Plans
                  </CardTitle>
                  <CardDescription>Choose a plan that fits your SMS marketing needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {smsPlans.filter(plan => plan.isActive).map((plan) => (
                      <div key={plan.id} className={`p-4 border rounded-lg ${userSubscription?.planId === plan.id ? 'border-green-500 bg-green-50' : ''}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{plan.name}</h4>
                            <p className="text-sm text-muted-foreground">{plan.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">${plan.pricing.amount}</p>
                            <p className="text-sm text-muted-foreground">/{plan.pricing.billingPeriod}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                          <div>
                            <p className="font-medium">SMS Credits</p>
                            <p className="text-muted-foreground">{plan.features.smsCredits.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-medium">Voice SMS</p>
                            <p className="text-muted-foreground">{plan.features.voiceSmsCredits.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-medium">Missed Call</p>
                            <p className="text-muted-foreground">{plan.features.missedCallCredits.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-medium">Long Code</p>
                            <p className="text-muted-foreground">{plan.features.longCodeCredits.toLocaleString()}</p>
                          </div>
                        </div>

                        {plan.features.additionalFeatures.length > 0 && (
                          <div className="mb-4">
                            <p className="font-medium text-sm mb-2">Features:</p>
                            <div className="flex flex-wrap gap-1">
                              {plan.features.additionalFeatures.map((feature, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {userSubscription?.planId === plan.id ? (
                          <Badge variant="default" className="w-full justify-center bg-green-600">
                            Current Plan
                          </Badge>
                        ) : (
                          <div className="flex gap-2">
                            <Button 
                              className="flex-1" 
                              onClick={() => handleSubscribeToPlan(plan.id)}
                            >
                              Subscribe - Stripe
                            </Button>
                            <Button 
                              variant="outline" 
                              className="flex-1" 
                              onClick={() => handleSubscribeToPlan(plan.id)}
                            >
                              Pay with UPI
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      
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

      {/* SMS Provider Configuration Dialog */}
      <Dialog open={isProviderConfigureOpen} onOpenChange={setIsProviderConfigureOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configure {selectedProvider?.name}</DialogTitle>
            <DialogDescription>
              Update SMS provider settings and API configuration
            </DialogDescription>
          </DialogHeader>
          {selectedProvider && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editProviderName">Provider Name</Label>
                <Input
                  id="editProviderName"
                  value={selectedProvider.name}
                  onChange={(e) => setSelectedProvider(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">API Configuration</h4>
                {smsProviderTypes
                  .find(p => p.value === selectedProvider.type)
                  ?.fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={`edit_${field.key}`}>{field.label}</Label>
                      <Input
                        id={`edit_${field.key}`}
                        type={field.type}
                        value={selectedProvider.config[field.key] || ""}
                        onChange={(e) => setSelectedProvider(prev => prev ? {
                          ...prev,
                          config: { ...prev.config, [field.key]: e.target.value }
                        } : null)}
                      />
                    </div>
                  ))}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="providerActive"
                  checked={selectedProvider.isActive}
                  onCheckedChange={(checked) => setSelectedProvider(prev => prev ? { ...prev, isActive: checked } : null)}
                />
                <Label htmlFor="providerActive">Active</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProviderConfigureOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProvider}>Update Provider</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
