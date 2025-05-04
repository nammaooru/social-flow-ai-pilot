
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Copy, CheckCheck, Save, ArrowRight, HelpCircle,
  Key as KeyIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import FileText from "@/components/settings/FileText";
import Code from "@/components/settings/Code";
import BookOpen from "@/components/settings/BookOpen";

export function ApiKeysSettings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("api-keys");
  const [showSecret, setShowSecret] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Mock data for API keys
  const [apiKeys, setApiKeys] = useState([
    { id: "1", name: "Production API Key", key: "sk_prod_a1b2c3d4e5f6g7h8i9j0", createdAt: "2023-04-12", lastUsed: "2023-05-01", enabled: true },
    { id: "2", name: "Development API Key", key: "sk_dev_9i8h7g6f5e4d3c2b1a0", createdAt: "2023-04-15", lastUsed: "2023-04-30", enabled: true },
    { id: "3", name: "Testing API Key", key: "sk_test_3k4l5j6h7g8f9d0s1a2", createdAt: "2023-04-18", lastUsed: "2023-04-28", enabled: false },
  ]);
  
  const [webhooks, setWebhooks] = useState([
    { id: "1", url: "https://example.com/webhook", events: ["post.created", "post.updated"], active: true, secretKey: "whsec_a1b2c3d4e5f6g7h8i9j0" },
    { id: "2", url: "https://test.example.com/notify", events: ["user.login", "user.logout"], active: false, secretKey: "whsec_9i8h7g6f5e4d3c2b1a0" },
  ]);
  
  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    
    toast({
      title: "API key copied",
      description: "The API key has been copied to your clipboard.",
    });
    
    setTimeout(() => {
      setCopiedKey(null);
    }, 3000);
  };
  
  const handleCreateApiKey = () => {
    toast({
      title: "API key created",
      description: "Your new API key has been created successfully.",
    });
  };
  
  const handleRevokeApiKey = (keyId: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== keyId));
    
    toast({
      title: "API key revoked",
      description: "The API key has been revoked and is no longer valid.",
    });
  };
  
  const toggleApiKeyStatus = (keyId: string) => {
    setApiKeys(apiKeys.map(key => {
      if (key.id === keyId) {
        return { ...key, enabled: !key.enabled };
      }
      return key;
    }));
    
    const key = apiKeys.find(k => k.id === keyId);
    if (key) {
      toast({
        title: key.enabled ? "API key disabled" : "API key enabled",
        description: `The API key "${key.name}" has been ${key.enabled ? "disabled" : "enabled"}.`,
      });
    }
  };
  
  const handleCreateWebhook = () => {
    toast({
      title: "Webhook created",
      description: "Your new webhook endpoint has been created successfully.",
    });
  };
  
  const toggleWebhookStatus = (webhookId: string) => {
    setWebhooks(webhooks.map(webhook => {
      if (webhook.id === webhookId) {
        return { ...webhook, active: !webhook.active };
      }
      return webhook;
    }));
    
    const webhook = webhooks.find(w => w.id === webhookId);
    if (webhook) {
      toast({
        title: webhook.active ? "Webhook disabled" : "Webhook enabled",
        description: `The webhook endpoint has been ${webhook.active ? "disabled" : "enabled"}.`,
      });
    }
  };
  
  const handleDeleteWebhook = (webhookId: string) => {
    setWebhooks(webhooks.filter(webhook => webhook.id !== webhookId));
    
    toast({
      title: "Webhook deleted",
      description: "The webhook endpoint has been deleted.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">API Keys & Webhooks</h3>
        <p className="text-sm text-muted-foreground">
          Manage API keys and webhook endpoints for integrating with our platform.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <KeyIcon className="h-4 w-4" />
            <span>API Keys</span>
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            <span>Webhooks</span>
          </TabsTrigger>
          <TabsTrigger value="documentation" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Documentation</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create API Key</CardTitle>
              <CardDescription>
                Generate a new API key for accessing our platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key-name">API Key Name</Label>
                <Input id="api-key-name" placeholder="e.g., Production API Key" />
                <p className="text-xs text-muted-foreground">
                  Choose a descriptive name to identify this API key later.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key-expiry">Expiration</Label>
                <Select defaultValue="never">
                  <SelectTrigger id="api-key-expiry">
                    <SelectValue placeholder="Select expiration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7 days</SelectItem>
                    <SelectItem value="30d">30 days</SelectItem>
                    <SelectItem value="90d">90 days</SelectItem>
                    <SelectItem value="365d">1 year</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key-permissions">Permissions</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="permission-read" className="flex items-center gap-2 text-sm">
                      <span>Read</span>
                      <span className="text-xs text-muted-foreground">(View data)</span>
                    </Label>
                    <Switch id="permission-read" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="permission-write" className="flex items-center gap-2 text-sm">
                      <span>Write</span>
                      <span className="text-xs text-muted-foreground">(Create and update data)</span>
                    </Label>
                    <Switch id="permission-write" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="permission-delete" className="flex items-center gap-2 text-sm">
                      <span>Delete</span>
                      <span className="text-xs text-muted-foreground">(Remove data)</span>
                    </Label>
                    <Switch id="permission-delete" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreateApiKey}>Create API Key</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Existing API Keys</CardTitle>
              <CardDescription>
                Manage your existing API keys.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{apiKey.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        Created on {apiKey.createdAt} • Last used {apiKey.lastUsed}
                      </p>
                    </div>
                    <div>
                      <Switch
                        checked={apiKey.enabled}
                        onCheckedChange={() => toggleApiKeyStatus(apiKey.id)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Input
                      type={showSecret ? "text" : "password"}
                      value={apiKey.key}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center"
                      onClick={() => handleCopyKey(apiKey.key)}
                    >
                      {copiedKey === apiKey.key ? (
                        <CheckCheck className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSecret(!showSecret)}
                    >
                      {showSecret ? "Hide" : "Show"} Key
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRevokeApiKey(apiKey.id)}
                    >
                      Revoke Key
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Webhook</CardTitle>
              <CardDescription>
                Configure webhook endpoints to receive events from our platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Endpoint URL</Label>
                <Input id="webhook-url" placeholder="https://example.com/webhook" />
                <p className="text-xs text-muted-foreground">
                  The URL where webhook events will be sent.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Events to receive</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="event-post-created" className="text-sm">
                      Post created
                    </Label>
                    <Switch id="event-post-created" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="event-post-updated" className="text-sm">
                      Post updated
                    </Label>
                    <Switch id="event-post-updated" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="event-post-deleted" className="text-sm">
                      Post deleted
                    </Label>
                    <Switch id="event-post-deleted" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="event-user-login" className="text-sm">
                      User login
                    </Label>
                    <Switch id="event-user-login" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="event-user-logout" className="text-sm">
                      User logout
                    </Label>
                    <Switch id="event-user-logout" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreateWebhook}>Create Webhook</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Existing Webhooks</CardTitle>
              <CardDescription>
                Manage your existing webhook endpoints.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{webhook.url}</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {webhook.events.map((event, index) => (
                          <span
                            key={index}
                            className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Switch
                        checked={webhook.active}
                        onCheckedChange={() => toggleWebhookStatus(webhook.id)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Webhook Secret</p>
                    <div className="flex items-center space-x-2">
                      <Input
                        type={showSecret ? "text" : "password"}
                        value={webhook.secretKey}
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center"
                        onClick={() => handleCopyKey(webhook.secretKey)}
                      >
                        {copiedKey === webhook.secretKey ? (
                          <CheckCheck className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSecret(!showSecret)}
                    >
                      {showSecret ? "Hide" : "Show"} Secret
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteWebhook(webhook.id)}
                    >
                      Delete Webhook
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documentation" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <CardTitle>API Documentation</CardTitle>
              </div>
              <CardDescription>
                Learn how to integrate with our platform using our API.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-base">Getting Started</h4>
                  <p className="text-sm text-muted-foreground">
                    Learn how to authenticate and make your first API request.
                  </p>
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    View Getting Started Guide
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium text-base">API Reference</h4>
                  <p className="text-sm text-muted-foreground">
                    Browse the complete API reference documentation.
                  </p>
                  <Button variant="outline" className="w-full justify-start">
                    <Code className="mr-2 h-4 w-4" />
                    View API Reference
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium text-base">Webhook Guide</h4>
                  <p className="text-sm text-muted-foreground">
                    Learn how to set up and use webhooks for real-time event notifications.
                  </p>
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    View Webhook Guide
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium text-base">Need Help?</h4>
                  <p className="text-sm text-muted-foreground">
                    Get in touch with our support team for assistance with API integration.
                  </p>
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <CardTitle>Code Examples</CardTitle>
              </div>
              <CardDescription>
                Ready-to-use code snippets for common API operations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Authentication</h4>
                  <div className="bg-muted p-4 rounded-md overflow-x-auto">
                    <pre className="text-xs">
                      <code>{`
const apiKey = 'sk_test_YOUR_API_KEY';

fetch('https://api.example.com/v1/posts', {
  method: 'GET',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
                      `}</code>
                    </pre>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Creating a Post</h4>
                  <div className="bg-muted p-4 rounded-md overflow-x-auto">
                    <pre className="text-xs">
                      <code>{`
const apiKey = 'sk_test_YOUR_API_KEY';

fetch('https://api.example.com/v1/posts', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'My New Post',
    content: 'This is the content of my new post.',
    platform: 'instagram',
    scheduleTime: '2023-05-15T10:00:00Z'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
                      `}</code>
                    </pre>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Handling Webhooks</h4>
                  <div className="bg-muted p-4 rounded-md overflow-x-auto">
                    <pre className="text-xs">
                      <code>{`
// Example webhook handler in Node.js with Express

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const event = req.body;
  
  // Handle different event types
  switch(event.type) {
    case 'post.created':
      console.log('Post created:', event.data);
      break;
    case 'post.updated':
      console.log('Post updated:', event.data);
      break;
    default:
      console.log('Unknown event type:', event.type);
  }
  
  // Return a 200 response to acknowledge receipt
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000');
});
                      `}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
