
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
  
  // Comprehensive world timezones
  const worldTimezones = [
    { value: "UTC", label: "UTC - Coordinated Universal Time" },
    { value: "America/New_York", label: "America/New York - Eastern Time (EST/EDT)" },
    { value: "America/Chicago", label: "America/Chicago - Central Time (CST/CDT)" },
    { value: "America/Denver", label: "America/Denver - Mountain Time (MST/MDT)" },
    { value: "America/Los_Angeles", label: "America/Los Angeles - Pacific Time (PST/PDT)" },
    { value: "America/Anchorage", label: "America/Anchorage - Alaska Time" },
    { value: "Pacific/Honolulu", label: "Pacific/Honolulu - Hawaii Time" },
    { value: "America/Toronto", label: "America/Toronto - Eastern Time (Canada)" },
    { value: "America/Vancouver", label: "America/Vancouver - Pacific Time (Canada)" },
    { value: "America/Sao_Paulo", label: "America/Sao Paulo - Brazil Time" },
    { value: "America/Argentina/Buenos_Aires", label: "America/Buenos Aires - Argentina Time" },
    { value: "America/Mexico_City", label: "America/Mexico City - Central Standard Time" },
    { value: "Europe/London", label: "Europe/London - Greenwich Mean Time (GMT/BST)" },
    { value: "Europe/Paris", label: "Europe/Paris - Central European Time (CET/CEST)" },
    { value: "Europe/Berlin", label: "Europe/Berlin - Central European Time (CET/CEST)" },
    { value: "Europe/Rome", label: "Europe/Rome - Central European Time (CET/CEST)" },
    { value: "Europe/Madrid", label: "Europe/Madrid - Central European Time (CET/CEST)" },
    { value: "Europe/Amsterdam", label: "Europe/Amsterdam - Central European Time (CET/CEST)" },
    { value: "Europe/Zurich", label: "Europe/Zurich - Central European Time (CET/CEST)" },
    { value: "Europe/Vienna", label: "Europe/Vienna - Central European Time (CET/CEST)" },
    { value: "Europe/Stockholm", label: "Europe/Stockholm - Central European Time (CET/CEST)" },
    { value: "Europe/Oslo", label: "Europe/Oslo - Central European Time (CET/CEST)" },
    { value: "Europe/Copenhagen", label: "Europe/Copenhagen - Central European Time (CET/CEST)" },
    { value: "Europe/Helsinki", label: "Europe/Helsinki - Eastern European Time (EET/EEST)" },
    { value: "Europe/Warsaw", label: "Europe/Warsaw - Central European Time (CET/CEST)" },
    { value: "Europe/Prague", label: "Europe/Prague - Central European Time (CET/CEST)" },
    { value: "Europe/Budapest", label: "Europe/Budapest - Central European Time (CET/CEST)" },
    { value: "Europe/Bucharest", label: "Europe/Bucharest - Eastern European Time (EET/EEST)" },
    { value: "Europe/Athens", label: "Europe/Athens - Eastern European Time (EET/EEST)" },
    { value: "Europe/Istanbul", label: "Europe/Istanbul - Turkey Time (TRT)" },
    { value: "Europe/Moscow", label: "Europe/Moscow - Moscow Standard Time (MSK)" },
    { value: "Europe/Kiev", label: "Europe/Kiev - Eastern European Time (EET/EEST)" },
    { value: "Asia/Tokyo", label: "Asia/Tokyo - Japan Standard Time (JST)" },
    { value: "Asia/Seoul", label: "Asia/Seoul - Korea Standard Time (KST)" },
    { value: "Asia/Shanghai", label: "Asia/Shanghai - China Standard Time (CST)" },
    { value: "Asia/Hong_Kong", label: "Asia/Hong Kong - Hong Kong Time (HKT)" },
    { value: "Asia/Singapore", label: "Asia/Singapore - Singapore Standard Time (SGT)" },
    { value: "Asia/Bangkok", label: "Asia/Bangkok - Indochina Time (ICT)" },
    { value: "Asia/Jakarta", label: "Asia/Jakarta - Western Indonesian Time (WIB)" },
    { value: "Asia/Manila", label: "Asia/Manila - Philippine Standard Time (PST)" },
    { value: "Asia/Kuala_Lumpur", label: "Asia/Kuala Lumpur - Malaysia Time (MYT)" },
    { value: "Asia/Kolkata", label: "Asia/Kolkata - India Standard Time (IST)" },
    { value: "Asia/Karachi", label: "Asia/Karachi - Pakistan Standard Time (PKT)" },
    { value: "Asia/Dhaka", label: "Asia/Dhaka - Bangladesh Standard Time (BST)" },
    { value: "Asia/Dubai", label: "Asia/Dubai - Gulf Standard Time (GST)" },
    { value: "Asia/Tehran", label: "Asia/Tehran - Iran Standard Time (IRST)" },
    { value: "Asia/Jerusalem", label: "Asia/Jerusalem - Israel Standard Time (IST)" },
    { value: "Asia/Riyadh", label: "Asia/Riyadh - Arabia Standard Time (AST)" },
    { value: "Africa/Cairo", label: "Africa/Cairo - Eastern European Time (EET)" },
    { value: "Africa/Lagos", label: "Africa/Lagos - West Africa Time (WAT)" },
    { value: "Africa/Johannesburg", label: "Africa/Johannesburg - South Africa Standard Time (SAST)" },
    { value: "Africa/Nairobi", label: "Africa/Nairobi - East Africa Time (EAT)" },
    { value: "Africa/Casablanca", label: "Africa/Casablanca - Western European Time (WET)" },
    { value: "Australia/Sydney", label: "Australia/Sydney - Australian Eastern Time (AEST/AEDT)" },
    { value: "Australia/Melbourne", label: "Australia/Melbourne - Australian Eastern Time (AEST/AEDT)" },
    { value: "Australia/Brisbane", label: "Australia/Brisbane - Australian Eastern Standard Time (AEST)" },
    { value: "Australia/Perth", label: "Australia/Perth - Australian Western Standard Time (AWST)" },
    { value: "Australia/Adelaide", label: "Australia/Adelaide - Australian Central Time (ACST/ACDT)" },
    { value: "Pacific/Auckland", label: "Pacific/Auckland - New Zealand Standard Time (NZST/NZDT)" },
    { value: "Pacific/Fiji", label: "Pacific/Fiji - Fiji Time (FJT)" },
    { value: "Pacific/Guam", label: "Pacific/Guam - Chamorro Standard Time (ChST)" }
  ];
  
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
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={settings.timezone} onValueChange={(value) => handleInputChange("timezone", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {worldTimezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="bn">Bengali</SelectItem>
                      <SelectItem value="te">Telugu</SelectItem>
                      <SelectItem value="mr">Marathi</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                      <SelectItem value="gu">Gujarati</SelectItem>
                      <SelectItem value="ur">Urdu</SelectItem>
                      <SelectItem value="kn">Kannada</SelectItem>
                      <SelectItem value="ml">Malayalam</SelectItem>
                      <SelectItem value="or">Odia</SelectItem>
                      <SelectItem value="pa">Punjabi</SelectItem>
                      <SelectItem value="as">Assamese</SelectItem>
                      <SelectItem value="mai">Maithili</SelectItem>
                      <SelectItem value="mag">Magahi</SelectItem>
                      <SelectItem value="bho">Bhojpuri</SelectItem>
                      <SelectItem value="ne">Nepali</SelectItem>
                      <SelectItem value="sa">Sanskrit</SelectItem>
                      <SelectItem value="ks">Kashmiri</SelectItem>
                      <SelectItem value="sd">Sindhi</SelectItem>
                      <SelectItem value="kok">Konkani</SelectItem>
                      <SelectItem value="doi">Dogri</SelectItem>
                      <SelectItem value="mni">Manipuri</SelectItem>
                      <SelectItem value="sat">Santali</SelectItem>
                      <SelectItem value="bpy">Bishnupriya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
