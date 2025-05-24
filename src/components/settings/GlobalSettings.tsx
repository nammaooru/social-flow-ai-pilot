
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Settings, Database, Shield } from "lucide-react";
import { CommonSettingsProps } from "@/pages/Settings";

export function GlobalSettings({ onSettingChange }: CommonSettingsProps) {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: "Social Media Manager",
    siteDescription: "Comprehensive social media management platform",
    timezone: "UTC",
    dateFormat: "MM/dd/yyyy",
    language: "en",
    maintenance: false,
    registrationEnabled: true,
    emailVerification: true,
    twoFactorRequired: false,
    sessionTimeout: "24",
    dataRetention: "365",
    backupFrequency: "daily",
    logLevel: "info"
  });
  
  const handleSave = () => {
    toast({
      title: "Global settings saved",
      description: "Your global configuration has been updated successfully.",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Global Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure system-wide settings and preferences for your platform.
        </p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Site Configuration
              </CardTitle>
              <CardDescription>Basic site information and localization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange("siteName", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Input
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleInputChange("timezone", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={settings.dateFormat} onValueChange={(value) => handleInputChange("dateFormat", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/dd/yyyy">MM/dd/yyyy</SelectItem>
                      <SelectItem value="dd/MM/yyyy">dd/MM/yyyy</SelectItem>
                      <SelectItem value="yyyy-MM-dd">yyyy-MM-dd</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Default Language</Label>
                <Select value={settings.language} onValueChange={(value) => handleInputChange("language", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Site Status</CardTitle>
              <CardDescription>Control site availability and access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable site access for maintenance
                  </p>
                </div>
                <Switch
                  id="maintenance"
                  checked={settings.maintenance}
                  onCheckedChange={(checked) => handleInputChange("maintenance", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="registrationEnabled">Allow Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable new user registrations
                  </p>
                </div>
                <Switch
                  id="registrationEnabled"
                  checked={settings.registrationEnabled}
                  onCheckedChange={(checked) => handleInputChange("registrationEnabled", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Authentication Settings
              </CardTitle>
              <CardDescription>Configure security and authentication options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailVerification">Email Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Require email verification for new accounts
                  </p>
                </div>
                <Switch
                  id="emailVerification"
                  checked={settings.emailVerification}
                  onCheckedChange={(checked) => handleInputChange("emailVerification", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="twoFactorRequired">Require 2FA</Label>
                  <p className="text-sm text-muted-foreground">
                    Force two-factor authentication for all users
                  </p>
                </div>
                <Switch
                  id="twoFactorRequired"
                  checked={settings.twoFactorRequired}
                  onCheckedChange={(checked) => handleInputChange("twoFactorRequired", checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                <Select value={settings.sessionTimeout} onValueChange={(value) => handleInputChange("sessionTimeout", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="8">8 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="168">1 week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Configuration
              </CardTitle>
              <CardDescription>Configure system performance and logging</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logLevel">Log Level</Label>
                <Select value={settings.logLevel} onValueChange={(value) => handleInputChange("logLevel", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>Configure data retention and backup settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dataRetention">Data Retention (days)</Label>
                <Select value={settings.dataRetention} onValueChange={(value) => handleInputChange("dataRetention", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="0">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backupFrequency">Backup Frequency</Label>
                <Select value={settings.backupFrequency} onValueChange={(value) => handleInputChange("backupFrequency", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
