import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CommonSettingsProps } from "@/pages/Settings";
import { Loader2, CheckCircle, AlertCircle, Link, Plus, Eye, EyeOff } from "lucide-react";
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

interface NewAccountForm {
  platform: string;
  accountName: string;
  username: string;
  password: string;
  email: string;
  description: string;
}

const platformIcons = {
  Instagram: <Instagram className="h-5 w-5 text-white" />,
  X: <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>,
  Facebook: <Facebook className="h-5 w-5 text-white" />,
  LinkedIn: <Linkedin className="h-5 w-5 text-white" />,
  TikTok: <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>,
  YouTube: <Youtube className="h-5 w-5 text-white" />
};

export function SocialAccountsSettings({
  onSettingChange
}: CommonSettingsProps) {
  const { toast } = useToast();
  const [isConnectingAll, setIsConnectingAll] = useState(false);
  const [showAddNewAccount, setShowAddNewAccount] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [newAccountForm, setNewAccountForm] = useState<NewAccountForm>({
    platform: "",
    accountName: "",
    username: "",
    password: "",
    email: "",
    description: ""
  });

  const [accounts, setAccounts] = useState<SocialAccount[]>([{
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
  }, {
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
  }, {
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
  }, {
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
  }, {
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
  }, {
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
  }]);
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

  const handleAddNewAccount = async () => {
    if (!newAccountForm.platform || !newAccountForm.accountName || !newAccountForm.username || !newAccountForm.password) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields (Platform, Account Name, Username, and Password).",
        variant: "destructive"
      });
      return;
    }

    setIsAddingAccount(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newAccount: SocialAccount = {
        id: Date.now().toString(),
        platform: newAccountForm.platform,
        username: newAccountForm.username,
        connected: true,
        followers: Math.floor(Math.random() * 10000) + 1000,
        posts: Math.floor(Math.random() * 100) + 10,
        lastSync: "Just now",
        color: getColorForPlatform(newAccountForm.platform),
        syncInProgress: false,
        icon: platformIcons[newAccountForm.platform as keyof typeof platformIcons]
      };

      setAccounts(prev => [...prev, newAccount]);
      setShowAddNewAccount(false);
      setNewAccountForm({
        platform: "",
        accountName: "",
        username: "",
        password: "",
        email: "",
        description: ""
      });

      toast({
        title: "Account added successfully",
        description: `${newAccountForm.platform} account "${newAccountForm.accountName}" has been connected.`
      });

      if (onSettingChange) {
        onSettingChange();
      }
    } catch (error) {
      toast({
        title: "Failed to add account",
        description: "There was an error connecting your account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAddingAccount(false);
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
        setAccounts(prev => prev.map(acc => acc.id === account.id ? {
          ...acc,
          connected: true,
          followers: Math.floor(Math.random() * 10000) + 1000,
          posts: Math.floor(Math.random() * 100) + 10,
          lastSync: "Just now"
        } : acc));
        toast({
          title: `${account.platform} connected`,
          description: `Successfully connected to ${account.platform}`
        });
      }
      toast({
        title: "All accounts connected",
        description: "Successfully connected to all available social media platforms"
      });
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Some accounts could not be connected. Please try again.",
        variant: "destructive"
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
        setAccounts(prev => prev.map(acc => acc.id === accountId ? {
          ...acc,
          connected: false,
          followers: 0,
          posts: 0,
          lastSync: "Never"
        } : acc));
        toast({
          title: "Account disconnected",
          description: `${account.platform} has been disconnected successfully.`
        });
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAccounts(prev => prev.map(acc => acc.id === accountId ? {
          ...acc,
          connected: true,
          followers: Math.floor(Math.random() * 10000) + 1000,
          posts: Math.floor(Math.random() * 100) + 10,
          lastSync: "Just now"
        } : acc));
        toast({
          title: "Account connected",
          description: `${account.platform} has been connected successfully.`
        });
      }
      if (onSettingChange) {
        onSettingChange();
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: `Failed to ${account.connected ? 'disconnect' : 'connect'} ${account.platform}. Please try again.`,
        variant: "destructive"
      });
    }
  };

  const handleSync = async (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account || !account.connected) return;
    setAccounts(prev => prev.map(acc => acc.id === accountId ? {
      ...acc,
      syncInProgress: true
    } : acc));
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAccounts(prev => prev.map(acc => acc.id === accountId ? {
        ...acc,
        syncInProgress: false,
        followers: acc.followers + Math.floor(Math.random() * 100),
        posts: acc.posts + Math.floor(Math.random() * 5),
        lastSync: "Just now"
      } : acc));
      toast({
        title: "Sync completed",
        description: `${account.platform} data has been synchronized successfully.`
      });
    } catch (error) {
      setAccounts(prev => prev.map(acc => acc.id === accountId ? {
        ...acc,
        syncInProgress: false
      } : acc));
      toast({
        title: "Sync failed",
        description: `Failed to sync ${account.platform} data. Please try again.`,
        variant: "destructive"
      });
    }
  };

  const handleSyncAll = async () => {
    const connectedAccounts = accounts.filter(acc => acc.connected);
    if (connectedAccounts.length === 0) {
      toast({
        title: "No accounts to sync",
        description: "Please connect at least one account to sync data.",
        variant: "destructive"
      });
      return;
    }
    setAccounts(prev => prev.map(acc => acc.connected ? {
      ...acc,
      syncInProgress: true
    } : acc));
    try {
      for (const account of connectedAccounts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAccounts(prev => prev.map(acc => acc.id === account.id ? {
          ...acc,
          syncInProgress: false,
          followers: acc.followers + Math.floor(Math.random() * 100),
          posts: acc.posts + Math.floor(Math.random() * 5),
          lastSync: "Just now"
        } : acc));
      }
      toast({
        title: "All accounts synced",
        description: "Successfully synchronized data from all connected accounts."
      });
    } catch (error) {
      setAccounts(prev => prev.map(acc => ({
        ...acc,
        syncInProgress: false
      })));
      toast({
        title: "Sync failed",
        description: "Some accounts could not be synchronized. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSettingChange = (field: string, value: boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    toast({
      title: "Setting updated",
      description: `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} has been updated.`
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
        <p className="text-muted-foreground mt-2">
          Connect and manage your social media presence from one powerful dashboard
        </p>
      </div>
      
      {/* Stats Cards with improved styling */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-900/50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Connected Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{connectedAccounts.length}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">out of {accounts.length} platforms</p>
            <Progress value={(connectedAccounts.length / accounts.length) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/50 dark:to-green-900/50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Total Followers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{totalFollowers.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">across all platforms</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950/50 dark:to-amber-900/50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">{totalPosts.toLocaleString()}</div>
            <p className="text-xs text-orange-600 dark:text-orange-400">managed content</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Add My Account Section */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-rose-950/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-purple-900 dark:text-purple-100">Quick Connect</CardTitle>
              <CardDescription className="text-purple-600 dark:text-purple-300">
                Connect your personal accounts to these platforms instantly
              </CardDescription>
            </div>
            <Button 
              onClick={() => setShowAddNewAccount(true)} 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Social Account
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {availablePlatforms.map(platform => (
              <Button
                key={platform}
                onClick={() => handleAddAccount(platform)}
                variant="outline"
                className="h-20 flex flex-col items-center gap-2 hover:scale-105 transition-transform border-2 hover:border-purple-300 hover:shadow-lg"
              >
                <div className={`p-2 rounded-full ${getColorForPlatform(platform)}`}>
                  {platformIcons[platform as keyof typeof platformIcons]}
                </div>
                <span className="text-xs font-medium">{platform}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Connected Platforms Section */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Connected Platforms</CardTitle>
              <CardDescription>Manage your social media platform connections</CardDescription>
            </div>
            <div className="flex gap-3">
              {disconnectedAccounts.length > 0 && (
                <Button 
                  onClick={handleConnectAll} 
                  disabled={isConnectingAll} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                >
                  {isConnectingAll ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
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
                className="border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Sync All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {accounts.map(account => (
              <Card key={account.id} className="border-2 hover:shadow-lg transition-shadow bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
                        <AvatarFallback className={account.color}>
                          {account.icon}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-lg">{account.platform}</p>
                        <p className="text-sm text-muted-foreground">{account.username}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      {account.connected && (
                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-600">
                            {account.followers.toLocaleString()} followers
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Last sync: {account.lastSync}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={account.connected ? "default" : "outline"}
                          className={account.connected ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                        >
                          {account.connected ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Connected
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Disconnected
                            </>
                          )}
                        </Badge>
                        
                        {account.connected && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleSync(account.id)} 
                            disabled={account.syncInProgress}
                            className="border-2"
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
                          className={account.connected ? "border-2" : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"}
                        >
                          {account.connected ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Sync Settings Section */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Sync Settings</CardTitle>
          <CardDescription>Configure how your accounts sync and share data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ... keep existing code (sync settings) */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Auto Sync</label>
              <p className="text-sm text-muted-foreground">
                Automatically sync account data at regular intervals
              </p>
            </div>
            <Switch checked={settings.autoSync} onCheckedChange={checked => handleSettingChange("autoSync", checked)} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Sync Interval</label>
              <p className="text-sm text-muted-foreground">
                How often to automatically sync data
              </p>
            </div>
            <Select value={settings.syncInterval} onValueChange={value => handleSettingChange("syncInterval", value)} disabled={!settings.autoSync}>
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
            <Switch checked={settings.realTimeSync} onCheckedChange={checked => handleSettingChange("realTimeSync", checked)} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Cross-Platform Posting</label>
              <p className="text-sm text-muted-foreground">
                Enable posting to multiple platforms simultaneously
              </p>
            </div>
            <Switch checked={settings.crossPost} onCheckedChange={checked => handleSettingChange("crossPost", checked)} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Analytics Collection</label>
              <p className="text-sm text-muted-foreground">
                Collect detailed analytics from connected platforms
              </p>
            </div>
            <Switch checked={settings.analytics} onCheckedChange={checked => handleSettingChange("analytics", checked)} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Sync Notifications</label>
              <p className="text-sm text-muted-foreground">
                Receive notifications when sync completes or fails
              </p>
            </div>
            <Switch checked={settings.syncNotifications} onCheckedChange={checked => handleSettingChange("syncNotifications", checked)} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Data Retention</label>
              <p className="text-sm text-muted-foreground">
                How long to keep synchronized data
              </p>
            </div>
            <Select value={settings.dataRetention} onValueChange={value => handleSettingChange("dataRetention", value)}>
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
            <Switch checked={settings.syncErrors} onCheckedChange={checked => handleSettingChange("syncErrors", checked)} />
          </div>
        </CardContent>
      </Card>

      {/* Add New Account Dialog */}
      <Dialog open={showAddNewAccount} onOpenChange={setShowAddNewAccount}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Add New Social Account
            </DialogTitle>
            <DialogDescription>
              Connect a new social media account by providing the required details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="platform" className="text-sm font-medium">Platform *</Label>
              <Select 
                value={newAccountForm.platform} 
                onValueChange={(value) => setNewAccountForm(prev => ({ ...prev, platform: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  {availablePlatforms.map(platform => (
                    <SelectItem key={platform} value={platform}>
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${getColorForPlatform(platform)}`}>
                          {platformIcons[platform as keyof typeof platformIcons]}
                        </div>
                        {platform}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountName" className="text-sm font-medium">Account Name *</Label>
              <Input
                id="accountName"
                placeholder="e.g., My Business Account"
                value={newAccountForm.accountName}
                onChange={(e) => setNewAccountForm(prev => ({ ...prev, accountName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">Username/Handle *</Label>
              <Input
                id="username"
                placeholder="e.g., @yourbrand"
                value={newAccountForm.username}
                onChange={(e) => setNewAccountForm(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="account@example.com"
                value={newAccountForm.email}
                onChange={(e) => setNewAccountForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={newAccountForm.password}
                  onChange={(e) => setNewAccountForm(prev => ({ ...prev, password: e.target.value }))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add a description for this account..."
                value={newAccountForm.description}
                onChange={(e) => setNewAccountForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddNewAccount(false)}
              disabled={isAddingAccount}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddNewAccount}
              disabled={isAddingAccount}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isAddingAccount ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Adding Account...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
