
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CommonSettingsProps } from "@/pages/Settings";
import { 
  MessageSquare, Plus, Settings, TestTube, Trash2, Edit, 
  Phone, Mic, PhoneCall, Hash, Star, 
  CreditCard, CheckCircle, XCircle
} from "lucide-react";

interface SMSProvider {
  id: string;
  name: string;
  type: 'builtin' | 'custom';
  status: 'active' | 'inactive';
  apiKey?: string;
  apiSecret?: string;
  senderId?: string;
  baseUrl?: string;
  username?: string;
  password?: string;
}

interface SMSPlan {
  id: string;
  name: string;
  description: string;
  smsCredits: number;
  voiceSmsCredits: number;
  missedCallCredits: number;
  longCodeCredits: number;
  price: number;
  currency: string;
  features: string[];
  validity: number; // days
  isActive: boolean;
}

const IntegrationSettings = ({ onSettingChange, role = "User" }: CommonSettingsProps) => {
  const { toast } = useToast();
  const [smsProviders, setSmsProviders] = useState<SMSProvider[]>([
    { id: '1', name: 'Twilio', type: 'builtin', status: 'active' },
    { id: '2', name: 'AWS SNS', type: 'builtin', status: 'inactive' },
  ]);
  const [smsPlans, setSmsPlans] = useState<SMSPlan[]>([]);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [editingProvider, setEditingProvider] = useState<SMSProvider | null>(null);
  const [editingPlan, setEditingPlan] = useState<SMSPlan | null>(null);

  const [newProvider, setNewProvider] = useState<Partial<SMSProvider>>({
    name: '',
    type: 'custom',
    status: 'active'
  });

  const [newPlan, setNewPlan] = useState<Partial<SMSPlan>>({
    name: '',
    description: '',
    smsCredits: 0,
    voiceSmsCredits: 0,
    missedCallCredits: 0,
    longCodeCredits: 0,
    price: 0,
    currency: 'USD',
    features: [],
    validity: 30,
    isActive: true
  });

  const builtinProviders = [
    'Twilio', 'AWS SNS', 'MessageBird', 'Nexmo/Vonage', 
    'ClickSend', 'Bulk SMS', 'smsgatewayhub'
  ];

  const handleAddProvider = () => {
    if (!newProvider.name) {
      toast({
        title: "Error",
        description: "Provider name is required",
        variant: "destructive"
      });
      return;
    }

    const provider: SMSProvider = {
      id: Date.now().toString(),
      name: newProvider.name,
      type: newProvider.type || 'custom',
      status: newProvider.status || 'active',
      apiKey: newProvider.apiKey,
      apiSecret: newProvider.apiSecret,
      senderId: newProvider.senderId,
      baseUrl: newProvider.baseUrl,
      username: newProvider.username,
      password: newProvider.password
    };

    setSmsProviders([...smsProviders, provider]);
    setNewProvider({ name: '', type: 'custom', status: 'active' });
    setShowAddProvider(false);
    onSettingChange?.();

    toast({
      title: "Provider Added",
      description: `${provider.name} has been added successfully`,
    });
  };

  const handleAddPlan = () => {
    if (!newPlan.name || !newPlan.price) {
      toast({
        title: "Error",
        description: "Plan name and price are required",
        variant: "destructive"
      });
      return;
    }

    const plan: SMSPlan = {
      id: Date.now().toString(),
      name: newPlan.name!,
      description: newPlan.description || '',
      smsCredits: newPlan.smsCredits || 0,
      voiceSmsCredits: newPlan.voiceSmsCredits || 0,
      missedCallCredits: newPlan.missedCallCredits || 0,
      longCodeCredits: newPlan.longCodeCredits || 0,
      price: newPlan.price!,
      currency: newPlan.currency || 'USD',
      features: newPlan.features || [],
      validity: newPlan.validity || 30,
      isActive: newPlan.isActive !== false
    };

    setSmsPlans([...smsPlans, plan]);
    setNewPlan({
      name: '', description: '', smsCredits: 0, voiceSmsCredits: 0,
      missedCallCredits: 0, longCodeCredits: 0, price: 0, currency: 'USD',
      features: [], validity: 30, isActive: true
    });
    setShowAddPlan(false);
    onSettingChange?.();

    toast({
      title: "Plan Created",
      description: `${plan.name} plan has been created successfully`,
    });
  };

  const handleTestProvider = (provider: SMSProvider) => {
    toast({
      title: "Testing Provider",
      description: `Testing connection to ${provider.name}...`,
    });
    
    // Simulate test
    setTimeout(() => {
      toast({
        title: "Test Successful",
        description: `${provider.name} is working correctly`,
      });
    }, 2000);
  };

  const handleConfigureProvider = (provider: SMSProvider) => {
    setEditingProvider(provider);
  };

  const renderProviderForm = (provider: Partial<SMSProvider>, isEdit = false) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="provider-name">Provider Name</Label>
          {provider.type === 'builtin' ? (
            <Select 
              value={provider.name} 
              onValueChange={(value) => 
                isEdit ? setEditingProvider({...editingProvider!, name: value}) : 
                setNewProvider({...newProvider, name: value})
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {builtinProviders.map(name => (
                  <SelectItem key={name} value={name}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="provider-name"
              value={provider.name || ''}
              onChange={(e) => 
                isEdit ? setEditingProvider({...editingProvider!, name: e.target.value}) :
                setNewProvider({...newProvider, name: e.target.value})
              }
              placeholder="Enter provider name"
            />
          )}
        </div>
        <div>
          <Label htmlFor="provider-type">Type</Label>
          <Select 
            value={provider.type} 
            onValueChange={(value: 'builtin' | 'custom') => 
              isEdit ? setEditingProvider({...editingProvider!, type: value}) :
              setNewProvider({...newProvider, type: value})
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="builtin">Built-in</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {provider.name === 'smsgatewayhub' || provider.type === 'custom' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={provider.apiKey || ''}
                onChange={(e) => 
                  isEdit ? setEditingProvider({...editingProvider!, apiKey: e.target.value}) :
                  setNewProvider({...newProvider, apiKey: e.target.value})
                }
                placeholder="Enter API key"
              />
            </div>
            <div>
              <Label htmlFor="api-secret">API Secret</Label>
              <Input
                id="api-secret"
                type="password"
                value={provider.apiSecret || ''}
                onChange={(e) => 
                  isEdit ? setEditingProvider({...editingProvider!, apiSecret: e.target.value}) :
                  setNewProvider({...newProvider, apiSecret: e.target.value})
                }
                placeholder="Enter API secret"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sender-id">Sender ID</Label>
              <Input
                id="sender-id"
                value={provider.senderId || ''}
                onChange={(e) => 
                  isEdit ? setEditingProvider({...editingProvider!, senderId: e.target.value}) :
                  setNewProvider({...newProvider, senderId: e.target.value})
                }
                placeholder="Enter sender ID"
              />
            </div>
            <div>
              <Label htmlFor="base-url">Base URL</Label>
              <Input
                id="base-url"
                value={provider.baseUrl || ''}
                onChange={(e) => 
                  isEdit ? setEditingProvider({...editingProvider!, baseUrl: e.target.value}) :
                  setNewProvider({...newProvider, baseUrl: e.target.value})
                }
                placeholder="https://api.provider.com"
              />
            </div>
          </div>
          {provider.name === 'smsgatewayhub' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={provider.username || ''}
                  onChange={(e) => 
                    isEdit ? setEditingProvider({...editingProvider!, username: e.target.value}) :
                    setNewProvider({...newProvider, username: e.target.value})
                  }
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={provider.password || ''}
                  onChange={(e) => 
                    isEdit ? setEditingProvider({...editingProvider!, password: e.target.value}) :
                    setNewProvider({...newProvider, password: e.target.value})
                  }
                  placeholder="Enter password"
                />
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );

  const renderPlanForm = (plan: Partial<SMSPlan>, isEdit = false) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="plan-name">Plan Name</Label>
          <Input
            id="plan-name"
            value={plan.name || ''}
            onChange={(e) => 
              isEdit ? setEditingPlan({...editingPlan!, name: e.target.value}) :
              setNewPlan({...newPlan, name: e.target.value})
            }
            placeholder="Enter plan name"
          />
        </div>
        <div>
          <Label htmlFor="plan-price">Price</Label>
          <div className="flex gap-2">
            <Input
              id="plan-price"
              type="number"
              value={plan.price || ''}
              onChange={(e) => 
                isEdit ? setEditingPlan({...editingPlan!, price: Number(e.target.value)}) :
                setNewPlan({...newPlan, price: Number(e.target.value)})
              }
              placeholder="0.00"
            />
            <Select 
              value={plan.currency} 
              onValueChange={(value) => 
                isEdit ? setEditingPlan({...editingPlan!, currency: value}) :
                setNewPlan({...newPlan, currency: value})
              }
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="INR">INR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="plan-description">Description</Label>
        <Textarea
          id="plan-description"
          value={plan.description || ''}
          onChange={(e) => 
            isEdit ? setEditingPlan({...editingPlan!, description: e.target.value}) :
            setNewPlan({...newPlan, description: e.target.value})
          }
          placeholder="Describe this plan..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sms-credits">SMS Credits</Label>
          <Input
            id="sms-credits"
            type="number"
            value={plan.smsCredits || ''}
            onChange={(e) => 
              isEdit ? setEditingPlan({...editingPlan!, smsCredits: Number(e.target.value)}) :
              setNewPlan({...newPlan, smsCredits: Number(e.target.value)})
            }
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="voice-sms-credits">Voice SMS Credits</Label>
          <Input
            id="voice-sms-credits"
            type="number"
            value={plan.voiceSmsCredits || ''}
            onChange={(e) => 
              isEdit ? setEditingPlan({...editingPlan!, voiceSmsCredits: Number(e.target.value)}) :
              setNewPlan({...newPlan, voiceSmsCredits: Number(e.target.value)})
            }
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="missed-call-credits">Missed Call Credits</Label>
          <Input
            id="missed-call-credits"
            type="number"
            value={plan.missedCallCredits || ''}
            onChange={(e) => 
              isEdit ? setEditingPlan({...editingPlan!, missedCallCredits: Number(e.target.value)}) :
              setNewPlan({...newPlan, missedCallCredits: Number(e.target.value)})
            }
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="long-code-credits">Long Code Credits</Label>
          <Input
            id="long-code-credits"
            type="number"
            value={plan.longCodeCredits || ''}
            onChange={(e) => 
              isEdit ? setEditingPlan({...editingPlan!, longCodeCredits: Number(e.target.value)}) :
              setNewPlan({...newPlan, longCodeCredits: Number(e.target.value)})
            }
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="validity">Validity (Days)</Label>
        <Input
          id="validity"
          type="number"
          value={plan.validity || ''}
          onChange={(e) => 
            isEdit ? setEditingPlan({...editingPlan!, validity: Number(e.target.value)}) :
            setNewPlan({...newPlan, validity: Number(e.target.value)})
          }
          placeholder="30"
        />
      </div>

      <div>
        <Label htmlFor="features">Features (one per line)</Label>
        <Textarea
          id="features"
          value={plan.features?.join('\n') || ''}
          onChange={(e) => 
            isEdit ? setEditingPlan({...editingPlan!, features: e.target.value.split('\n').filter(f => f.trim())}) :
            setNewPlan({...newPlan, features: e.target.value.split('\n').filter(f => f.trim())})
          }
          placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
          rows={4}
        />
      </div>
    </div>
  );

  if (role !== "Super Admin") {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Integrations</h3>
          <p className="text-sm text-muted-foreground">
            Connect and manage third-party integrations.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              SMS Marketing
            </CardTitle>
            <CardDescription>
              SMS marketing integrations and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              SMS marketing features are only available to Super Admin users.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Integrations</h3>
        <p className="text-sm text-muted-foreground">
          Connect and manage third-party integrations.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            SMS Marketing
          </CardTitle>
          <CardDescription>
            Manage SMS providers and create plans for SMS credits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="providers" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="providers">SMS Providers</TabsTrigger>
              <TabsTrigger value="plans">Plans & Credits</TabsTrigger>
            </TabsList>
            
            <TabsContent value="providers" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">SMS Providers</h4>
                <Dialog open={showAddProvider} onOpenChange={setShowAddProvider}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Provider
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add SMS Provider</DialogTitle>
                      <DialogDescription>
                        Configure a new SMS provider for your account
                      </DialogDescription>
                    </DialogHeader>
                    {renderProviderForm(newProvider)}
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowAddProvider(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddProvider}>Add Provider</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {smsProviders.map((provider) => (
                  <Card key={provider.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <h5 className="font-medium">{provider.name}</h5>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={provider.type === 'builtin' ? 'default' : 'secondary'}>
                                {provider.type}
                              </Badge>
                              <Badge variant={provider.status === 'active' ? 'default' : 'secondary'}>
                                {provider.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestProvider(provider)}
                            className="gap-2"
                          >
                            <TestTube className="h-4 w-4" />
                            Test
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleConfigureProvider(provider)}
                            className="gap-2"
                          >
                            <Settings className="h-4 w-4" />
                            Configure
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSmsProviders(smsProviders.filter(p => p.id !== provider.id));
                              onSettingChange?.();
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="plans" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">SMS Credit Plans</h4>
                <Dialog open={showAddPlan} onOpenChange={setShowAddPlan}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Plan
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create SMS Credit Plan</DialogTitle>
                      <DialogDescription>
                        Define a new plan with various credit types and features
                      </DialogDescription>
                    </DialogHeader>
                    {renderPlanForm(newPlan)}
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowAddPlan(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddPlan}>Create Plan</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {smsPlans.map((plan) => (
                  <Card key={plan.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium">{plan.name}</h5>
                            <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                              {plan.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-blue-500" />
                              <span className="text-sm">{plan.smsCredits} SMS</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mic className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{plan.voiceSmsCredits} Voice</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <PhoneCall className="h-4 w-4 text-orange-500" />
                              <span className="text-sm">{plan.missedCallCredits} Missed</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Hash className="h-4 w-4 text-purple-500" />
                              <span className="text-sm">{plan.longCodeCredits} Long Code</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="font-medium text-lg">{plan.currency} {plan.price}</span>
                            <span>Valid for {plan.validity} days</span>
                          </div>

                          {plan.features.length > 0 && (
                            <div className="mt-3">
                              <h6 className="text-sm font-medium mb-1">Features:</h6>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                {plan.features.map((feature, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingPlan(plan)}
                            className="gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSmsPlans(smsPlans.filter(p => p.id !== plan.id));
                              onSettingChange?.();
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {smsPlans.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No SMS plans created yet</p>
                  <p className="text-sm">Create your first plan to get started</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Provider Dialog */}
      <Dialog open={!!editingProvider} onOpenChange={() => setEditingProvider(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Configure {editingProvider?.name}</DialogTitle>
            <DialogDescription>
              Update provider settings and credentials
            </DialogDescription>
          </DialogHeader>
          {editingProvider && renderProviderForm(editingProvider, true)}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingProvider(null)}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (editingProvider) {
                setSmsProviders(smsProviders.map(p => 
                  p.id === editingProvider.id ? editingProvider : p
                ));
                setEditingProvider(null);
                onSettingChange?.();
                toast({
                  title: "Provider Updated",
                  description: `${editingProvider.name} has been updated successfully`,
                });
              }
            }}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Dialog */}
      <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {editingPlan?.name}</DialogTitle>
            <DialogDescription>
              Update plan details and credit allocations
            </DialogDescription>
          </DialogHeader>
          {editingPlan && renderPlanForm(editingPlan, true)}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingPlan(null)}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (editingPlan) {
                setSmsPlans(smsPlans.map(p => 
                  p.id === editingPlan.id ? editingPlan : p
                ));
                setEditingPlan(null);
                onSettingChange?.();
                toast({
                  title: "Plan Updated",
                  description: `${editingPlan.name} has been updated successfully`,
                });
              }
            }}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntegrationSettings;
