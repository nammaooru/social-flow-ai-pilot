
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CommonSettingsProps } from "@/pages/Settings";
import { Loader2, CheckCircle, AlertCircle, Link } from "lucide-react";

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
  syncInProgress?: boolean;
}

export function SocialAccountsSettings({ onSettingChange }: CommonSettingsProps) {
  const { toast } = useToast();
  const [isConnectingAll, setIsConnectingAll] = useState(false);
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    {
      id: "1",
      platform: "Instagram",
      username: "@yourbrand",
      connected: true,
      followers: 15420,
      posts: 234,
      lastSync: "2 minutes ago",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      syncInProgress: false
    },
    {
      id: "2",
      platform: "Twitter",
      username: "@yourbrand",
      connected: true,
      followers: 8750,
      posts: 567,
      lastSync: "5 minutes ago",
      color: "bg-blue-500",
      syncInProgress: false
    },
    {
      id: "3",
      platform: "Facebook",
      username: "Your Brand Page",
      connected: false,
      followers: 0,
      posts: 0,
      lastSync: "Never",
      color: "bg-blue-600",
      syncInProgress: false
    },
    {
      id: "4",
      platform: "LinkedIn",
      username: "Your Company",
      connected: true,
      followers: 2340,
      posts: 89,
      lastSync: "1 hour ago",
      color: "bg-blue-700",
      syncInProgress: false
    },
    {
      id: "5",
      platform: "TikTok",
      username: "@yourbrand",
      connected: false,
      followers: 0,
      posts: 0,
      lastSync: "Never",
      color: "bg-black",
      syncInProgress: false
    },
    {
      id: "6",
      platform: "YouTube",
      username: "Your Brand Channel",
      connected: true,
      followers: 5670,
      posts: 45,
      lastSync: "30 minutes ago",
      color: "bg-red-600",
      syncInProgress: false
    }
  ]);
  
  const [settings, setSettings] = useState({
    autoSync: true,
    syncInterval: "15",
    crossPost: false,
    analytics: true,
    realTimeSync: false,
    syncNotifications: true,
    dataRetention: "90",
    syncErrors: true
  });
  
  const handleConnectAll = async () => {
    setIsConnectingAll(true);
    
    try {
      // Simulate connecting to each disconnected account
      const disconnectedAccounts = accounts.filter(acc => !acc.connected);
      
      for (const account of disconnectedAccounts) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setAccounts(prev => prev.map(acc => 
          acc.id === account.id 
            ? { 
                ...acc, 
                connected: true, 
                followers: Math.floor(Math.random() * 10000) + 1000,
                posts: Math.floor(Math.random() * 100) + 10,
                lastSync: "Just now"
              }
            : acc
        ));
        
        toast({
          title: `${account.platform} connected`,
          description: `Successfully connected to ${account.platform}`,
        });
      }
      
      toast({
        title: "All accounts connected",
        description: "Successfully connected to all available social media platforms",
      });
      
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Some accounts could not be connected. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnectingAll(false);
      if (onSettingChange) {
        onSettingChange();
      }
    }
  };
  
  const handleConnect = async (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return;
    
    try {
      if (account.connected) {
        // Disconnect account
        setAccounts(prev => prev.map(acc => 
          acc.id === accountId 
            ? { ...acc, connected: false, followers: 0, posts: 0, lastSync: "Never" }
            : acc
        ));
        
        toast({
          title: "Account disconnected",
          description: `${account.platform} has been disconnected successfully.`,
        });
      } else {
        // Connect account - simulate OAuth flow
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setAccounts(prev => prev.map(acc => 
          acc.id === accountId 
            ? { 
                ...acc, 
                connected: true, 
                followers: Math.floor(Math.random() * 10000) + 1000,
                posts: Math.floor(Math.random() * 100) + 10,
                lastSync: "Just now"
              }
            : acc
        ));
        
        toast({
          title: "Account connected",
          description: `${account.platform} has been connected successfully.`,
        });
      }
      
      if (onSettingChange) {
        onSettingChange();
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: `Failed to ${account.connected ? 'disconnect' : 'connect'} ${account.platform}. Please try again.`,
        variant: "destructive",
      });
    }
  };
  
  const handleSync = async (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account || !account.connected) return;
    
    // Set sync in progress
    setAccounts(prev => prev.map(acc => 
      acc.id === accountId ? { ...acc, syncInProgress: true } : acc
    ));
    
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update account data
      setAccounts(prev => prev.map(acc => 
        acc.id === accountId 
          ? { 
              ...acc, 
              syncInProgress: false,
              followers: acc.followers + Math.floor(Math.random() * 100),
              posts: acc.posts + Math.floor(Math.random() * 5),
              lastSync: "Just now"
            }
          : acc
      ));
      
      toast({
        title: "Sync completed",
        description: `${account.platform} data has been synchronized successfully.`,
      });
      
    } catch (error) {
      setAccounts(prev => prev.map(acc => 
        acc.id === accountId ? { ...acc, syncInProgress: false } : acc
      ));
      
      toast({
        title: "Sync failed",
        description: `Failed to sync ${account.platform} data. Please try again.`,
        variant: "destructive",
      });
    }
  };
  
  const handleSyncAll = async () => {
    const connectedAccounts = accounts.filter(acc => acc.connected);
    
    if (connectedAccounts.length === 0) {
      toast({
        title: "No accounts to sync",
        description: "Please connect at least one account to sync data.",
        variant: "destructive",
      });
      return;
    }
    
    // Start sync for all connected accounts
    setAccounts(prev => prev.map(acc => 
      acc.connected ? { ...acc, syncInProgress: true } : acc
    ));
    
    try {
      // Simulate syncing all accounts
      for (const account of connectedAccounts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setAccounts(prev => prev.map(acc => 
          acc.id === account.id 
            ? { 
                ...acc, 
                syncInProgress: false,
                followers: acc.followers + Math.floor(Math.random() * 100),
                posts: acc.posts + Math.floor(Math.random() * 5),
                lastSync: "Just now"
              }
            : acc
        ));
      }
      
      toast({
        title: "All accounts synced",
        description: "Successfully synchronized data from all connected accounts.",
      });
      
    } catch (error) {
      setAccounts(prev => prev.map(acc => ({ ...acc, syncInProgress: false })));
      
      toast({
        title: "Sync failed",
        description: "Some accounts could not be synchronized. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSettingChange = (field: string, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    
    toast({
      title: "Setting updated",
      description: `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} has been updated.`,
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  const connectedAccounts = accounts.filter(acc => acc.connected);
  const totalFollowers = connectedAccounts.reduce((sum, acc) => sum + acc.followers, 0);
  const totalPosts = connectedAccounts.reduce((sum, acc) => sum + acc.posts, 0);
  const disconnectedAccounts = accounts.filter(acc => !acc.connected);
  
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Connected Platforms</CardTitle>
              <CardDescription>Manage your social media platform connections</CardDescription>
            </div>
            <div className="flex gap-2">
              {disconnectedAccounts.length > 0 && (
                <Button
                  onClick={handleConnectAll}
                  disabled={isConnectingAll}
                  className="flex items-center gap-2"
                >
                  {isConnectingAll ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Link className="h-4 w-4" />
                      Connect All
                    </>
                  )}
                </Button>
              )}
              <Button
                onClick={handleSyncAll}
                variant="outline"
                disabled={connectedAccounts.length === 0}
              >
                Sync All
              </Button>
            </div>
          </div>
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
                        disabled={account.syncInProgress}
                      >
                        {account.syncInProgress ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            Syncing
                          </>
                        ) : (
                          'Sync'
                        )}
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
        <CardContent className="space-y-6">
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
              <label className="text-sm font-medium">Sync Interval</label>
              <p className="text-sm text-muted-foreground">
                How often to automatically sync data
              </p>
            </div>
            <Select
              value={settings.syncInterval}
              onValueChange={(value) => handleSettingChange("syncInterval", value)}
              disabled={!settings.autoSync}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="360">6 hours</SelectItem>
                <SelectItem value="1440">24 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Real-time Sync</label>
              <p className="text-sm text-muted-foreground">
                Sync data immediately when changes occur
              </p>
            </div>
            <Switch
              checked={settings.realTimeSync}
              onCheckedChange={(checked) => handleSettingChange("realTimeSync", checked)}
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
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Sync Notifications</label>
              <p className="text-sm text-muted-foreground">
                Receive notifications when sync completes or fails
              </p>
            </div>
            <Switch
              checked={settings.syncNotifications}
              onCheckedChange={(checked) => handleSettingChange("syncNotifications", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Data Retention</label>
              <p className="text-sm text-muted-foreground">
                How long to keep synchronized data
              </p>
            </div>
            <Select
              value={settings.dataRetention}
              onValueChange={(value) => handleSettingChange("dataRetention", value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="180">6 months</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
                <SelectItem value="forever">Forever</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Sync Error Alerts</label>
              <p className="text-sm text-muted-foreground">
                Get notified when sync errors occur
              </p>
            </div>
            <Switch
              checked={settings.syncErrors}
              onCheckedChange={(checked) => handleSettingChange("syncErrors", checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
