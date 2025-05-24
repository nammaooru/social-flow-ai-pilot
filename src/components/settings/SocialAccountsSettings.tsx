
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommonSettingsProps } from "@/pages/Settings";

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  connected: boolean;
  followers: number;
  posts: number;
  lastSync: string;
  avatar?: string;
  color: string;
}

export function SocialAccountsSettings({ onSettingChange }: CommonSettingsProps) {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    {
      id: "1",
      platform: "Instagram",
      username: "@yourbrand",
      connected: true,
      followers: 15420,
      posts: 234,
      lastSync: "2 minutes ago",
      color: "bg-gradient-to-r from-purple-500 to-pink-500"
    },
    {
      id: "2",
      platform: "Twitter",
      username: "@yourbrand",
      connected: true,
      followers: 8750,
      posts: 567,
      lastSync: "5 minutes ago",
      color: "bg-blue-500"
    },
    {
      id: "3",
      platform: "Facebook",
      username: "Your Brand Page",
      connected: false,
      followers: 0,
      posts: 0,
      lastSync: "Never",
      color: "bg-blue-600"
    },
    {
      id: "4",
      platform: "LinkedIn",
      username: "Your Company",
      connected: true,
      followers: 2340,
      posts: 89,
      lastSync: "1 hour ago",
      color: "bg-blue-700"
    },
    {
      id: "5",
      platform: "TikTok",
      username: "@yourbrand",
      connected: false,
      followers: 0,
      posts: 0,
      lastSync: "Never",
      color: "bg-black"
    },
    {
      id: "6",
      platform: "YouTube",
      username: "Your Brand Channel",
      connected: true,
      followers: 5670,
      posts: 45,
      lastSync: "30 minutes ago",
      color: "bg-red-600"
    }
  ]);
  
  const [settings, setSettings] = useState({
    autoSync: true,
    syncInterval: "15",
    crossPost: false,
    analytics: true
  });
  
  const handleConnect = (accountId: string) => {
    setAccounts(prev => prev.map(account => 
      account.id === accountId 
        ? { ...account, connected: !account.connected }
        : account
    ));
    
    const account = accounts.find(acc => acc.id === accountId);
    toast({
      title: account?.connected ? "Account disconnected" : "Account connected",
      description: `${account?.platform} has been ${account?.connected ? "disconnected" : "connected"} successfully.`,
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  const handleSync = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    toast({
      title: "Sync initiated",
      description: `Syncing ${account?.platform} data...`,
    });
  };
  
  const handleSettingChange = (field: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  const connectedAccounts = accounts.filter(acc => acc.connected);
  const totalFollowers = connectedAccounts.reduce((sum, acc) => sum + acc.followers, 0);
  const totalPosts = connectedAccounts.reduce((sum, acc) => sum + acc.posts, 0);
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Social Accounts</h3>
        <p className="text-sm text-muted-foreground">
          Connect and manage your social media accounts for seamless content management.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Connected Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedAccounts.length}</div>
            <p className="text-xs text-muted-foreground">out of {accounts.length} platforms</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFollowers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">across all platforms</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">managed content</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Connected Platforms</CardTitle>
          <CardDescription>Manage your social media platform connections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={account.color}>
                      {account.platform.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{account.platform}</p>
                    <p className="text-sm text-muted-foreground">{account.username}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {account.connected && (
                    <div className="text-right">
                      <p className="text-sm font-medium">{account.followers.toLocaleString()} followers</p>
                      <p className="text-xs text-muted-foreground">Last sync: {account.lastSync}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={account.connected ? "default" : "outline"}>
                      {account.connected ? "Connected" : "Disconnected"}
                    </Badge>
                    
                    {account.connected && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(account.id)}
                      >
                        Sync
                      </Button>
                    )}
                    
                    <Button
                      variant={account.connected ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleConnect(account.id)}
                    >
                      {account.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Sync Settings</CardTitle>
          <CardDescription>Configure how your accounts sync and share data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Auto Sync</label>
              <p className="text-sm text-muted-foreground">
                Automatically sync account data at regular intervals
              </p>
            </div>
            <Switch
              checked={settings.autoSync}
              onCheckedChange={(checked) => handleSettingChange("autoSync", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Cross-Platform Posting</label>
              <p className="text-sm text-muted-foreground">
                Enable posting to multiple platforms simultaneously
              </p>
            </div>
            <Switch
              checked={settings.crossPost}
              onCheckedChange={(checked) => handleSettingChange("crossPost", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Analytics Collection</label>
              <p className="text-sm text-muted-foreground">
                Collect detailed analytics from connected platforms
              </p>
            </div>
            <Switch
              checked={settings.analytics}
              onCheckedChange={(checked) => handleSettingChange("analytics", checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
