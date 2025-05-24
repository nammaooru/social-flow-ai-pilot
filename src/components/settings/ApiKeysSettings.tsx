
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Key, Plus, Copy, Eye, EyeOff, MoreHorizontal } from "lucide-react";
import { CommonSettingsProps } from "@/pages/Settings";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  created: string;
  lastUsed: string;
  status: "active" | "inactive";
}

export function ApiKeysSettings({ onSettingChange }: CommonSettingsProps) {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>([]);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Production API",
      key: "sk_live_abc123def456ghi789",
      permissions: ["read", "write"],
      created: "2024-01-15",
      lastUsed: "2 hours ago",
      status: "active"
    },
    {
      id: "2", 
      name: "Development API",
      key: "sk_test_xyz789uvw456rst123",
      permissions: ["read"],
      created: "2024-02-01",
      lastUsed: "1 day ago",
      status: "active"
    },
    {
      id: "3",
      name: "Analytics Integration",
      key: "sk_live_qwe456asd789zxc123",
      permissions: ["analytics"],
      created: "2024-01-20",
      lastUsed: "Never",
      status: "inactive"
    }
  ]);
  
  const permissions = [
    { id: "read", label: "Read", description: "Read access to all resources" },
    { id: "write", label: "Write", description: "Create and update resources" },
    { id: "delete", label: "Delete", description: "Delete resources" },
    { id: "analytics", label: "Analytics", description: "Access analytics data" }
  ];
  
  const handleCreateKey = () => {
    if (!newKeyName) {
      toast({
        title: "Missing information",
        description: "Please provide a name for the API key.",
        variant: "destructive"
      });
      return;
    }
    
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `sk_live_${Math.random().toString(36).substr(2, 20)}`,
      permissions: newKeyPermissions,
      created: new Date().toISOString().split('T')[0],
      lastUsed: "Never",
      status: "active"
    };
    
    setApiKeys(prev => [...prev, newKey]);
    setNewKeyName("");
    setNewKeyPermissions([]);
    setIsCreateDialogOpen(false);
    
    toast({
      title: "API key created",
      description: "Your new API key has been generated successfully.",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Copied",
      description: "API key copied to clipboard.",
    });
  };
  
  const handleToggleVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };
  
  const handleRevokeKey = (keyId: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === keyId ? { ...key, status: "inactive" as const } : key
    ));
    
    toast({
      title: "API key revoked",
      description: "The API key has been deactivated.",
    });
  };
  
  const handlePermissionToggle = (permission: string) => {
    setNewKeyPermissions(prev => 
      prev.includes(permission) 
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };
  
  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.slice(0, 8) + "•".repeat(key.length - 12) + key.slice(-4);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">API Keys</h3>
        <p className="text-sm text-muted-foreground">
          Manage your API keys for integration with external services and applications.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiKeys.length}</div>
            <p className="text-xs text-muted-foreground">API keys created</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiKeys.filter(k => k.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">currently active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h</div>
            <p className="text-xs text-muted-foreground">ago</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>Create and manage API keys for your applications</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create API Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription>
                    Generate a new API key for your application
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="keyName">Key Name</Label>
                    <Input
                      id="keyName"
                      placeholder="e.g., Production API"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Permissions</Label>
                    <div className="space-y-2">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={permission.id}
                            checked={newKeyPermissions.includes(permission.id)}
                            onChange={() => handlePermissionToggle(permission.id)}
                            className="rounded"
                          />
                          <div>
                            <Label htmlFor={permission.id} className="text-sm font-medium">
                              {permission.label}
                            </Label>
                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateKey}>Create Key</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-medium">{apiKey.name}</p>
                    <Badge variant={apiKey.status === "active" ? "default" : "secondary"}>
                      {apiKey.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                      {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleVisibility(apiKey.id)}
                    >
                      {visibleKeys.has(apiKey.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyKey(apiKey.key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Permissions: {apiKey.permissions.join(", ")}</span>
                    <span>Created: {apiKey.created}</span>
                    <span>Last used: {apiKey.lastUsed}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {apiKey.status === "active" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeKey(apiKey.id)}
                    >
                      Revoke
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Security Best Practices</CardTitle>
          <CardDescription>Keep your API keys secure</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-500">•</span>
              Never share your API keys in public repositories or client-side code
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">•</span>
              Rotate your API keys regularly, especially for production environments
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">•</span>
              Use different keys for different environments (development, staging, production)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">•</span>
              Revoke unused or compromised keys immediately
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">•</span>
              Limit permissions to only what's necessary for each integration
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
