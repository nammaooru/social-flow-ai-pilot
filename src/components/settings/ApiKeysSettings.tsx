
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Key, Copy, Eye, EyeOff, Plus, RefreshCw, Trash2 } from "lucide-react";

// Mock API keys data
const mockApiKeys = [
  {
    id: "key_1",
    name: "Production API Key",
    prefix: "pk_live_",
    lastChars: "3f8g",
    created: "2023-03-15",
    lastUsed: "2023-05-02",
    status: "active"
  },
  {
    id: "key_2",
    name: "Development API Key",
    prefix: "pk_test_",
    lastChars: "9d2h",
    created: "2023-04-01",
    lastUsed: "2023-05-01",
    status: "active"
  },
  {
    id: "key_3",
    name: "Staging Environment",
    prefix: "pk_test_",
    lastChars: "7c4j",
    created: "2023-02-10",
    lastUsed: "2023-04-15",
    status: "inactive"
  },
];

export function ApiKeysSettings() {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyType, setNewKeyType] = useState(true); // true = live, false = test
  const [isCreateKeyDialogOpen, setIsCreateKeyDialogOpen] = useState(false);
  const [generatedKey, setGeneratedKey] = useState("");
  const [showGeneratedKey, setShowGeneratedKey] = useState(false);
  
  const handleCopyKey = () => {
    // In a real app, this would copy the key to clipboard
    navigator.clipboard.writeText(generatedKey);
    toast({
      title: "API key copied",
      description: "The API key has been copied to your clipboard.",
    });
  };
  
  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a name for your API key.",
        variant: "destructive"
      });
      return;
    }

    // Generate a fake API key
    const keyPrefix = newKeyType ? "pk_live_" : "pk_test_";
    const keyBody = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15);
    const fullKey = keyPrefix + keyBody;
    
    setGeneratedKey(fullKey);
    
    // In a real app, this would send the request to an API
    const newKey = {
      id: `key_${apiKeys.length + 1}`,
      name: newKeyName,
      prefix: keyPrefix,
      lastChars: keyBody.slice(-4),
      created: new Date().toISOString().split("T")[0],
      lastUsed: "Never",
      status: "active"
    };
    
    setApiKeys([...apiKeys, newKey]);
    
    // Reset form
    setNewKeyName("");
    setNewKeyType(true);
  };
  
  const handleRevokeKey = (keyId: string) => {
    // In a real app, this would call an API to revoke the key
    setApiKeys(apiKeys.map(key => 
      key.id === keyId ? { ...key, status: "inactive" } : key
    ));
    
    toast({
      title: "API key revoked",
      description: "The API key has been revoked and can no longer be used.",
    });
  };
  
  const handleRegenerateKey = (keyId: string) => {
    // In a real app, this would call an API to regenerate the key
    toast({
      title: "API key regenerated",
      description: "The API key has been regenerated. Please update your applications.",
    });
  };
  
  const handleDeleteKey = (keyId: string) => {
    // In a real app, this would call an API to delete the key
    setApiKeys(apiKeys.filter(key => key.id !== keyId));
    
    toast({
      title: "API key deleted",
      description: "The API key has been permanently deleted.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">API Keys</h3>
        <p className="text-sm text-muted-foreground">
          Manage API keys for integrating with external applications.
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-md font-medium">Your API Keys</h4>
          <p className="text-sm text-muted-foreground">
            Use these keys to authenticate your API requests.
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateKeyDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create New Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Create a new API key to authenticate your applications.
              </DialogDescription>
            </DialogHeader>
            
            {!generatedKey ? (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="key-name">API Key Name</Label>
                  <Input
                    id="key-name"
                    placeholder="e.g., Production Backend"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Give your API key a memorable name to identify its use.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Key Type</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="key-type"
                      checked={newKeyType}
                      onCheckedChange={setNewKeyType}
                    />
                    <Label htmlFor="key-type">
                      {newKeyType ? "Live Key" : "Test Key"}
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Test keys can be used for development without affecting production data.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="generated-key">Your New API Key</Label>
                  <div className="flex">
                    <div className="relative flex-1">
                      <Input
                        id="generated-key"
                        type={showGeneratedKey ? "text" : "password"}
                        value={generatedKey}
                        readOnly
                        className="pr-10 font-mono"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0"
                        onClick={() => setShowGeneratedKey(!showGeneratedKey)}
                      >
                        {showGeneratedKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <Button variant="outline" onClick={handleCopyKey} className="ml-2">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm font-medium text-destructive">
                    Make sure to copy your API key now. You won't be able to see it again!
                  </p>
                </div>
              </div>
            )}
            
            <DialogFooter>
              {!generatedKey ? (
                <Button onClick={handleCreateKey}>Create Key</Button>
              ) : (
                <Button onClick={() => {
                  setIsCreateKeyDialogOpen(false);
                  setGeneratedKey("");
                  setShowGeneratedKey(false);
                }}>
                  Done
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No API keys found.
                  </TableCell>
                </TableRow>
              ) : (
                apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">{apiKey.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 font-mono text-sm">
                        <Key className="h-3 w-3 text-muted-foreground" />
                        {apiKey.prefix}•••••••{apiKey.lastChars}
                      </div>
                    </TableCell>
                    <TableCell>{apiKey.created}</TableCell>
                    <TableCell>{apiKey.lastUsed}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          apiKey.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {apiKey.status === "active" ? "Active" : "Revoked"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {apiKey.status === "active" ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRegenerateKey(apiKey.id)}
                            >
                              <RefreshCw className="mr-2 h-3 w-3" />
                              Regenerate
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRevokeKey(apiKey.id)}
                            >
                              <Trash2 className="mr-2 h-3 w-3 text-red-500" />
                              Revoke
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteKey(apiKey.id)}
                          >
                            <Trash2 className="mr-2 h-3 w-3 text-red-500" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>
            Learn how to use our API to integrate with your applications.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Our RESTful API allows you to programmatically access and manage your social media content,
            analytics, and automations. Use the documentation to learn how to make authenticated requests
            and understand the available endpoints.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              API Reference
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Code className="mr-2 h-4 w-4" />
              Code Examples
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <BookOpen className="mr-2 h-4 w-4" />
              Integration Guides
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <HelpCircle className="mr-2 h-4 w-4" />
              API Support
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>
            Configure webhooks to receive real-time notifications for events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => {
            toast({
              title: "Feature coming soon",
              description: "Webhook configuration will be available soon.",
            });
          }}>
            Configure Webhooks
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
