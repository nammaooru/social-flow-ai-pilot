import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { CommonSettingsProps } from "@/pages/Settings";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Youtube, 
  MessageCircle,
  Mail,
  Phone,
  Globe,
  Settings,
  Plus,
  Trash2,
  Edit,
  Check,
  X
} from "lucide-react";

interface SMSProvider {
  id: string;
  name: string;
  type: 'builtin' | 'custom';
  enabled: boolean;
  apiKeys?: Record<string, string>;
}

interface SMSPlan {
  id: string;
  name: string;
  smsCredits: number;
  voiceSmsCredits: number;
  missedCallCredits: number;
  longCodeCredits: number;
  price: number;
  features: string[];
}

export const IntegrationSettings = ({ onSettingChange, role = "User" }: CommonSettingsProps) => {
  const [activeSection, setActiveSection] = useState("social");
  const [smsProviders, setSmsProviders] = useState<SMSProvider[]>([
    { id: '1', name: 'Twilio', type: 'builtin', enabled: true },
    { id: '2', name: 'AWS SNS', type: 'builtin', enabled: false },
    { id: '3', name: 'MessageBird', type: 'builtin', enabled: false },
    { id: '4', name: 'SMSGatewayHub', type: 'builtin', enabled: false }
  ]);
  const [smsPlans, setSmsPlans] = useState<SMSPlan[]>([]);
  const [isAddProviderOpen, setIsAddProviderOpen] = useState(false);
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [newProvider, setNewProvider] = useState<{ name: string; type: 'builtin' | 'custom' }>({ name: '', type: 'custom' });
  const [newPlan, setNewPlan] = useState({
    name: '',
    smsCredits: 0,
    voiceSmsCredits: 0,
    missedCallCredits: 0,
    longCodeCredits: 0,
    price: 0,
    features: [] as string[]
  });
  
  const { toast } = useToast();

  const socialMediaIntegrations = [
    { id: "facebook", label: "Facebook", icon: <Facebook className="h-4 w-4" />, enabled: true },
    { id: "instagram", label: "Instagram", icon: <Instagram className="h-4 w-4" />, enabled: false },
    { id: "twitter", label: "Twitter", icon: <Twitter className="h-4 w-4" />, enabled: false },
    { id: "linkedin", label: "LinkedIn", icon: <Linkedin className="h-4 w-4" />, enabled: false },
    { id: "youtube", label: "YouTube", icon: <Youtube className="h-4 w-4" />, enabled: false },
  ];

  const emailMarketingIntegrations = [
    { id: "mailchimp", label: "Mailchimp", icon: <Mail className="h-4 w-4" />, enabled: true },
    { id: "sendgrid", label: "SendGrid", icon: <Mail className="h-4 w-4" />, enabled: false },
    { id: "activecampaign", label: "ActiveCampaign", icon: <Mail className="h-4 w-4" />, enabled: false },
  ];

  const automationIntegrations = [
    { id: "zapier", label: "Zapier", icon: <Settings className="h-4 w-4" />, enabled: true },
    { id: "ifttt", label: "IFTTT", icon: <Settings className="h-4 w-4" />, enabled: false },
  ];

  const [socialIntegrations, setSocialIntegrations] = useState(socialMediaIntegrations);
  const [emailIntegrations, setEmailIntegrations] = useState(emailMarketingIntegrations);
  const [automation, setAutomation] = useState(automationIntegrations);

  const handleIntegrationToggle = (id: string, type: 'social' | 'email' | 'automation') => {
    let updatedIntegrations;
    switch (type) {
      case 'social':
        updatedIntegrations = socialIntegrations.map(integration =>
          integration.id === id ? { ...integration, enabled: !integration.enabled } : integration
        );
        setSocialIntegrations(updatedIntegrations);
        break;
      case 'email':
        updatedIntegrations = emailIntegrations.map(integration =>
          integration.id === id ? { ...integration, enabled: !integration.enabled } : integration
        );
        setEmailIntegrations(updatedIntegrations);
        break;
      case 'automation':
        updatedIntegrations = automation.map(integration =>
          integration.id === id ? { ...integration, enabled: !integration.enabled } : integration
        );
        setAutomation(updatedIntegrations);
        break;
      default:
        return;
    }
    onSettingChange?.();
    toast({
      title: "Integration Updated",
      description: "Integration status has been updated successfully.",
    });
  };

  const handleSMSProviderToggle = (providerId: string) => {
    setSmsProviders(prev => prev.map(provider => 
      provider.id === providerId 
        ? { ...provider, enabled: !provider.enabled }
        : provider
    ));
    onSettingChange?.();
    toast({
      title: "SMS Provider Updated",
      description: "SMS provider status has been updated successfully.",
    });
  };

  const handleAddSMSProvider = () => {
    if (!newProvider.name.trim()) return;
    
    const provider: SMSProvider = {
      id: Date.now().toString(),
      name: newProvider.name,
      type: newProvider.type,
      enabled: false,
      apiKeys: {}
    };
    
    setSmsProviders(prev => [...prev, provider]);
    setNewProvider({ name: '', type: 'custom' });
    setIsAddProviderOpen(false);
    onSettingChange?.();
    
    toast({
      title: "SMS Provider Added",
      description: `${provider.name} has been added successfully.`,
    });
  };

  const handleRemoveSMSProvider = (providerId: string) => {
    setSmsProviders(prev => prev.filter(provider => provider.id !== providerId));
    onSettingChange?.();
    toast({
      title: "SMS Provider Removed",
      description: "SMS provider has been removed successfully.",
    });
  };

  const handleAddSMSPlan = () => {
    if (!newPlan.name.trim()) return;
    
    const plan: SMSPlan = {
      id: Date.now().toString(),
      ...newPlan
    };
    
    setSmsPlans(prev => [...prev, plan]);
    setNewPlan({
      name: '',
      smsCredits: 0,
      voiceSmsCredits: 0,
      missedCallCredits: 0,
      longCodeCredits: 0,
      price: 0,
      features: []
    });
    setIsAddPlanOpen(false);
    onSettingChange?.();
    
    toast({
      title: "SMS Plan Created",
      description: `${plan.name} plan has been created successfully.`,
    });
  };

  const handleRemoveSMSPlan = (planId: string) => {
    setSmsPlans(prev => prev.filter(plan => plan.id !== planId));
    onSettingChange?.();
    toast({
      title: "SMS Plan Removed",
      description: "SMS plan has been removed successfully.",
    });
  };

  const builtinSMSProviders = [
    'Twilio', 'AWS SNS', 'MessageBird', 'SMSGatewayHub', 'Vonage', 'Plivo', 'ClickSend'
  ];

  const renderSMSMarketing = () => {
    if (role !== "Super Admin") return null;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              SMS Providers Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">SMS Providers</h3>
              <Dialog open={isAddProviderOpen} onOpenChange={setIsAddProviderOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add SMS Provider
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add SMS Provider</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="provider-type">Provider Type</Label>
                      <Select 
                        value={newProvider.type} 
                        onValueChange={(value: 'builtin' | 'custom') => 
                          setNewProvider(prev => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="builtin">Built-in Provider</SelectItem>
                          <SelectItem value="custom">Custom Provider</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="provider-name">Provider Name</Label>
                      {newProvider.type === 'builtin' ? (
                        <Select 
                          value={newProvider.name} 
                          onValueChange={(value) => 
                            setNewProvider(prev => ({ ...prev, name: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a provider" />
                          </SelectTrigger>
                          <SelectContent>
                            {builtinSMSProviders.map(provider => (
                              <SelectItem key={provider} value={provider}>
                                {provider}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id="provider-name"
                          value={newProvider.name}
                          onChange={(e) => setNewProvider(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter custom provider name"
                        />
                      )}
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddProviderOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddSMSProvider}>
                        Add Provider
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid gap-4">
              {smsProviders.map((provider) => (
                <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">{provider.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {provider.type === 'builtin' ? 'Built-in Provider' : 'Custom Provider'}
                      </p>
                    </div>
                    <Badge variant={provider.enabled ? "default" : "secondary"}>
                      {provider.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Switch
                      checked={provider.enabled}
                      onCheckedChange={() => handleSMSProviderToggle(provider.id)}
                    />
                    {provider.type === 'custom' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSMSProvider(provider.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              SMS Plans Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">SMS Credit Plans</h3>
              <Dialog open={isAddPlanOpen} onOpenChange={setIsAddPlanOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create SMS Credit Plan</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="plan-name">Plan Name</Label>
                      <Input
                        id="plan-name"
                        value={newPlan.name}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter plan name"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sms-credits">SMS Credits</Label>
                        <Input
                          id="sms-credits"
                          type="number"
                          value={newPlan.smsCredits}
                          onChange={(e) => setNewPlan(prev => ({ ...prev, smsCredits: parseInt(e.target.value) || 0 }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="voice-sms-credits">Voice SMS Credits</Label>
                        <Input
                          id="voice-sms-credits"
                          type="number"
                          value={newPlan.voiceSmsCredits}
                          onChange={(e) => setNewPlan(prev => ({ ...prev, voiceSmsCredits: parseInt(e.target.value) || 0 }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="missed-call-credits">Missed Call Credits</Label>
                        <Input
                          id="missed-call-credits"
                          type="number"
                          value={newPlan.missedCallCredits}
                          onChange={(e) => setNewPlan(prev => ({ ...prev, missedCallCredits: parseInt(e.target.value) || 0 }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="long-code-credits">Long Code Credits</Label>
                        <Input
                          id="long-code-credits"
                          type="number"
                          value={newPlan.longCodeCredits}
                          onChange={(e) => setNewPlan(prev => ({ ...prev, longCodeCredits: parseInt(e.target.value) || 0 }))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="plan-price">Price ($)</Label>
                      <Input
                        id="plan-price"
                        type="number"
                        step="0.01"
                        value={newPlan.price}
                        onChange={(e) => setNewPlan(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="plan-features">Features (one per line)</Label>
                      <Textarea
                        id="plan-features"
                        value={newPlan.features.join('\n')}
                        onChange={(e) => setNewPlan(prev => ({ 
                          ...prev, 
                          features: e.target.value.split('\n').filter(f => f.trim()) 
                        }))}
                        placeholder="Enter plan features, one per line"
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddPlanOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddSMSPlan}>
                        Create Plan
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid gap-4">
              {smsPlans.map((plan) => (
                <div key={plan.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{plan.name}</h4>
                      <p className="text-2xl font-bold text-green-600">${plan.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSMSPlan(plan.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="text-sm">
                      <span className="font-medium">SMS Credits:</span> {plan.smsCredits.toLocaleString()}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Voice SMS:</span> {plan.voiceSmsCredits.toLocaleString()}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Missed Call:</span> {plan.missedCallCredits.toLocaleString()}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Long Code:</span> {plan.longCodeCredits.toLocaleString()}
                    </div>
                  </div>
                  
                  {plan.features.length > 0 && (
                    <div className="mt-3">
                      <h5 className="font-medium text-sm mb-2">Features:</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
              
              {smsPlans.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No SMS plans created yet. Create your first plan to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const sections = [
    { id: "social", label: "Social Media", icon: <Globe className="h-4 w-4" /> },
    { id: "email", label: "Email Marketing", icon: <Mail className="h-4 w-4" /> },
    ...(role === "Super Admin" ? [{ id: "sms", label: "SMS Marketing", icon: <Phone className="h-4 w-4" /> }] : []),
    { id: "automation", label: "Automation", icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Integrations</h2>
        <p className="text-muted-foreground">
          Connect and manage your third-party integrations and services.
        </p>
      </div>

      <div className="flex gap-4 border-b">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? "default" : "ghost"}
            onClick={() => setActiveSection(section.id)}
            className="flex items-center gap-2"
          >
            {section.icon}
            {section.label}
          </Button>
        ))}
      </div>

      {activeSection === "social" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Social Media Integrations</h3>
          <p className="text-muted-foreground">
            Connect your social media accounts to automate posting and engagement.
          </p>
          <div className="grid gap-4">
            {socialIntegrations.map((integration) => (
              <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {integration.icon}
                  <h4 className="font-medium">{integration.label}</h4>
                </div>
                <Switch
                  checked={integration.enabled}
                  onCheckedChange={() => handleIntegrationToggle(integration.id, 'social')}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === "email" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Email Marketing Integrations</h3>
          <p className="text-muted-foreground">
            Connect your email marketing tools to manage campaigns and subscribers.
          </p>
          <div className="grid gap-4">
            {emailIntegrations.map((integration) => (
              <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {integration.icon}
                  <h4 className="font-medium">{integration.label}</h4>
                </div>
                <Switch
                  checked={integration.enabled}
                  onCheckedChange={() => handleIntegrationToggle(integration.id, 'email')}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === "sms" && renderSMSMarketing()}

      {activeSection === "automation" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Automation Integrations</h3>
          <p className="text-muted-foreground">
            Connect your automation tools to streamline workflows and tasks.
          </p>
          <div className="grid gap-4">
            {automation.map((integration) => (
              <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {integration.icon}
                  <h4 className="font-medium">{integration.label}</h4>
                </div>
                <Switch
                  checked={integration.enabled}
                  onCheckedChange={() => handleIntegrationToggle(integration.id, 'automation')}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
