
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
import { Loader2, CheckCircle, AlertCircle, Link, Plus, ExternalLink, Settings, Zap } from "lucide-react";
import { Instagram, Facebook, Linkedin, Youtube } from "lucide-react";

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
  icon: React.ReactNode;
}

const platformIcons = {
  Instagram: <Instagram className="h-5 w-5 text-white" />,
  X: (
    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Facebook: <Facebook className="h-5 w-5 text-white" />,
  LinkedIn: <Linkedin className="h-5 w-5 text-white" />,
  TikTok: (
    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  ),
  YouTube: <Youtube className="h-5 w-5 text-white" />
};

export function SocialAccountsSettings({ onSettingChange }: CommonSettingsProps) {
  const { toast } = useToast();
  const [isConnectingAll, setIsConnectingAll] = useState(false);
  const [showAddNewAccount, setShowAddNewAccount] = useState(false);
  const [connectingAccounts, setConnectingAccounts] = useState<Set<string>>(new Set());
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
      syncInProgress: false,
      icon: platformIcons.Instagram
    },
    {
      id: "2",
      platform: "X",
      username: "@yourbrand",
      connected: true,
      followers: 8750,
      posts: 567,
      lastSync: "5 minutes ago",
      color: "bg-black",
      syncInProgress: false,
      icon: platformIcons.X
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
      syncInProgress: false,
      icon: platformIcons.Facebook
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
      syncInProgress: false,
      icon: platformIcons.LinkedIn
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
      syncInProgress: false,
      icon: platformIcons.TikTok
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
      syncInProgress: false,
      icon: platformIcons.YouTube
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
  
  const handleAddNewAccount = () => {
    setShowAddNewAccount(!showAddNewAccount);
    
    if (!showAddNewAccount) {
      toast({
        title: "Add New Account",
        description: "Select a platform below to add your social media account.",
      });
    }
  };
  
  const handleAddAccount = async (platform: string) => {
    const accountId = `connecting-${platform}`;
    setConnectingAccounts(prev => new Set(prev).add(accountId));
    
    toast({
      title: "Connecting to " + platform,
      description: "You will be redirected to " + platform + " to authorize your account.",
    });
    
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Check if account already exists
      const existingAccount = accounts.find(acc => acc.platform === platform);
      
      if (existingAccount && !existingAccount.connected) {
        // Update existing disconnected account
        setAccounts(prev => prev.map(acc => 
          acc.platform === platform 
            ? {
                ...acc,
                connected: true,
                username: `@your${platform.toLowerCase()}`,
                followers: Math.floor(Math.random() * 10000) + 1000,
                posts: Math.floor(Math.random() * 100) + 10,
                lastSync: "Just now"
              }
            : acc
        ));
      } else if (!existingAccount) {
        // Add new account
        const newAccount: SocialAccount = {
          id: Date.now().toString(),
          platform,
          username: `@your${platform.toLowerCase()}`,
          connected: true,
          followers: Math.floor(Math.random() * 10000) + 1000,
          posts: Math.floor(Math.random() * 100) + 10,
          lastSync: "Just now",
          color: getColorForPlatform(platform),
          syncInProgress: false,
          icon: platformIcons[platform as keyof typeof platformIcons]
        };
        
        setAccounts(prev => [...prev, newAccount]);
      }
      
      toast({
        title: platform + " account connected!",
        description: `Successfully connected your ${platform} account. You can now manage your content from here.`,
      });
      
      if (onSettingChange) {
        onSettingChange();
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: `Failed to connect ${platform} account. Please try again or check your permissions.`,
        variant: "destructive",
      });
    } finally {
      setConnectingAccounts(prev => {
        const newSet = new Set(prev);
        newSet.delete(accountId);
        return newSet;
      });
    }
  };
  
  const getColorForPlatform = (platform: string) => {
    const colors: Record<string, string> = {
      Instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
      X: "bg-black",
      Facebook: "bg-blue-600",
      LinkedIn: "bg-blue-700",
      TikTok: "bg-black",
      YouTube: "bg-red-600"
    };
    return colors[platform] || "bg-gray-500";
  };
  
  const handleConnectAll = async () => {
    setIsConnectingAll(true);
    
    try {
      const disconnectedAccounts = accounts.filter(acc => !acc.connected);
      
      for (const account of disconnectedAccounts) {
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
    
    setAccounts(prev => prev.map(acc => 
      acc.id === accountId ? { ...acc, syncInProgress: true } : acc
    ));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
    
    setAccounts(prev => prev.map(acc => 
      acc.connected ? { ...acc, syncInProgress: true } : acc
    ));
    
    try {
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
  
  const availablePlatforms = ["Instagram", "X", "Facebook", "LinkedIn", "TikTok", "YouTube"];
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Social Media Hub
        </h3>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Connect, manage, and synchronize all your social media accounts from one powerful dashboard. 
          Streamline your content strategy across platforms.
        </p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Connected Accounts</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{connectedAccounts.length}</p>
                <p className="text-xs text-blue-500 dark:text-blue-400">of {accounts.length} platforms</p>
              </div>
              <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Link className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Total Reach</p>
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{totalFollowers.toLocaleString()}</p>
                <p className="text-xs text-emerald-500 dark:text-emerald-400">followers across platforms</p>
              </div>
              <div className="h-12 w-12 bg-emerald-500 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Content Created</p>
                <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{totalPosts.toLocaleString()}</p>
                <p className="text-xs text-amber-500 dark:text-amber-400">posts managed</p>
              </div>
              <div className="h-12 w-12 bg-amber-500 rounded-full flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Add New Account Section */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-violet-700 dark:text-violet-300">Connect Your Accounts</CardTitle>
              <CardDescription className="text-violet-600 dark:text-violet-400">
                Add your personal social media accounts to start managing all your content in one place
              </CardDescription>
            </div>
            <Button
              onClick={handleAddNewAccount}
              className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Account
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePlatforms.map((platform) => {
              const isConnecting = connectingAccounts.has(`connecting-${platform}`);
              const existingAccount = accounts.find(acc => acc.platform === platform);
              const isConnected = existingAccount?.connected;
              
              return (
                <div key={platform} className="group relative overflow-hidden rounded-xl border-2 border-transparent hover:border-violet-200 dark:hover:border-violet-800 bg-white dark:bg-gray-900 p-6 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-violet-100 dark:ring-violet-900">
                        <AvatarFallback className={getColorForPlatform(platform)}>
                          {platformIcons[platform as keyof typeof platformIcons]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{platform}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {isConnected ? "Connected" : "Not connected"}
                        </p>
                      </div>
                    </div>
                    
                    {isConnected && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  
                  <Button
                    onClick={() => handleAddAccount(platform)}
                    disabled={isConnecting || isConnected}
                    variant={isConnected ? "outline" : "default"}
                    size="sm"
                    className={`w-full ${
                      isConnected 
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950 dark:text-green-300 dark:border-green-800" 
                        : "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                    }`}
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : isConnected ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Connected
                      </>
                    ) : (
                      <>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Connect Account
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Connected Platforms */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Connected Platforms</CardTitle>
              <CardDescription>Manage your connected social media accounts and their sync status</CardDescription>
            </div>
            <div className="flex gap-3">
              {disconnectedAccounts.length > 0 && (
                <Button
                  onClick={handleConnectAll}
                  disabled={isConnectingAll}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                >
                  {isConnectingAll ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Link className="h-4 w-4 mr-2" />
                      Connect All
                    </>
                  )}
                </Button>
              )}
              <Button
                onClick={handleSyncAll}
                variant="outline"
                disabled={connectedAccounts.length === 0}
                className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950"
              >
                <Zap className="h-4 w-4 mr-2" />
                Sync All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {accounts.map((account) => (
              <div key={account.id} className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-all duration-300 hover:shadow-md hover:border-violet-200 dark:hover:border-violet-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 ring-2 ring-gray-100 dark:ring-gray-800">
                      <AvatarFallback className={account.color}>
                        {account.icon}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg">{account.platform}</p>
                      <p className="text-sm text-muted-foreground">{account.username}</p>
                      {account.connected && (
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            {account.followers.toLocaleString()} followers
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Last sync: {account.lastSync}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={account.connected ? "default" : "outline"}
                      className={account.connected 
                        ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800" 
                        : "border-gray-300 text-gray-600 dark:border-gray-700 dark:text-gray-400"
                      }
                    >
                      {account.connected ? "Connected" : "Disconnected"}
                    </Badge>
                    
                    {account.connected && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(account.id)}
                        disabled={account.syncInProgress}
                        className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950"
                      >
                        {account.syncInProgress ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Syncing
                          </>
                        ) : (
                          <>
                            <Zap className="h-3 w-3 mr-1" />
                            Sync
                          </>
                        )}
                      </Button>
                    )}
                    
                    <Button
                      variant={account.connected ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleConnect(account.id)}
                      className={account.connected 
                        ? "border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950" 
                        : "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
                      }
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
      
      {/* Sync Settings */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">Sync Settings</CardTitle>
          <CardDescription>Configure how your accounts sync and share data across platforms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-blue-700 dark:text-blue-300">Auto Sync</label>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Automatically sync account data at regular intervals
                  </p>
                </div>
                <Switch
                  checked={settings.autoSync}
                  onCheckedChange={(checked) => handleSettingChange("autoSync", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-950">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-green-700 dark:text-green-300">Real-time Sync</label>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Sync data immediately when changes occur
                  </p>
                </div>
                <Switch
                  checked={settings.realTimeSync}
                  onCheckedChange={(checked) => handleSettingChange("realTimeSync", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-purple-700 dark:text-purple-300">Cross-Platform Posting</label>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    Enable posting to multiple platforms simultaneously
                  </p>
                </div>
                <Switch
                  checked={settings.crossPost}
                  onCheckedChange={(checked) => handleSettingChange("crossPost", checked)}
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-amber-50 dark:bg-amber-950">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-amber-700 dark:text-amber-300">Analytics Collection</label>
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    Collect detailed analytics from connected platforms
                  </p>
                </div>
                <Switch
                  checked={settings.analytics}
                  onCheckedChange={(checked) => handleSettingChange("analytics", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-indigo-50 dark:bg-indigo-950">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Sync Notifications</label>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400">
                    Receive notifications when sync completes or fails
                  </p>
                </div>
                <Switch
                  checked={settings.syncNotifications}
                  onCheckedChange={(checked) => handleSettingChange("syncNotifications", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-red-50 dark:bg-red-950">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-red-700 dark:text-red-300">Sync Error Alerts</label>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Get notified when sync errors occur
                  </p>
                </div>
                <Switch
                  checked={settings.syncErrors}
                  onCheckedChange={(checked) => handleSettingChange("syncErrors", checked)}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sync Interval</label>
              <Select
                value={settings.syncInterval}
                onValueChange={(value) => handleSettingChange("syncInterval", value)}
                disabled={!settings.autoSync}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Every 5 minutes</SelectItem>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                  <SelectItem value="30">Every 30 minutes</SelectItem>
                  <SelectItem value="60">Every hour</SelectItem>
                  <SelectItem value="360">Every 6 hours</SelectItem>
                  <SelectItem value="1440">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Retention</label>
              <Select
                value={settings.dataRetention}
                onValueChange={(value) => handleSettingChange("dataRetention", value)}
              >
                <SelectTrigger className="w-full">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
