import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Key, Smartphone, AlertTriangle, Eye, MessageSquare, Phone, QrCode, Settings } from "lucide-react";
import { CommonSettingsProps } from "@/pages/Settings";

interface SecuritySettingsProps extends CommonSettingsProps {
  // No need to redefine role as it's already in CommonSettingsProps with the correct type
}

export function SecuritySettings({ role, onSettingChange }: SecuritySettingsProps) {
  const { toast } = useToast();
  
  // Mock profile data - in a real app, this would come from the user's profile
  const [profileData] = useState({
    phone: "+1 234 567 8900", // This would be fetched from Personal Information
    firstName: "John",
    lastName: "Doe"
  });
  
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    twoFactorMethod: "app", // "app", "sms", "whatsapp"
    passwordLastChanged: "30 days ago",
    loginNotifications: true,
    smsNotifications: true,
    whatsappNotifications: false,
    sessionTimeout: "24",
    ipWhitelist: "",
    apiKeyRotation: true
  });
  
  const [sessions] = useState([
    { id: "1", device: "Chrome on Windows", location: "New York, US", lastActive: "Current session", current: true },
    { id: "2", device: "Safari on iPhone", location: "New York, US", lastActive: "2 hours ago", current: false },
    { id: "3", device: "Firefox on Mac", location: "Los Angeles, US", lastActive: "1 day ago", current: false }
  ]);
  
  const [loginAttempts] = useState([
    { id: "1", time: "2024-02-15 10:30 AM", ip: "192.168.1.100", location: "New York, US", status: "Success" },
    { id: "2", time: "2024-02-15 09:15 AM", ip: "192.168.1.100", location: "New York, US", status: "Success" },
    { id: "3", time: "2024-02-14 08:45 PM", ip: "203.0.113.1", location: "Unknown", status: "Failed" }
  ]);
  
  const handleSave = () => {
    toast({
      title: "Security settings saved",
      description: "Your security configuration has been updated successfully.",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  const handleInputChange = (field: string, value: string | boolean) => {
    setSecurity(prev => ({ ...prev, [field]: value }));
  };
  
  const handleEnable2FA = () => {
    if (security.twoFactorMethod === "app") {
      toast({
        title: "Authenticator App Setup",
        description: "Scan the QR code with your authenticator app to complete setup.",
      });
    } else if (security.twoFactorMethod === "sms") {
      toast({
        title: "SMS 2FA Setup",
        description: "A verification code has been sent to your phone number.",
      });
    } else if (security.twoFactorMethod === "whatsapp") {
      toast({
        title: "WhatsApp 2FA Setup",
        description: "A verification code has been sent to your WhatsApp number.",
      });
    }
    
    setSecurity(prev => ({ ...prev, twoFactorEnabled: true }));
  };
  
  const handleDisable2FA = () => {
    setSecurity(prev => ({ ...prev, twoFactorEnabled: false }));
    toast({
      title: "2FA Disabled",
      description: "Two-factor authentication has been disabled for your account.",
    });
  };
  
  const handleTerminateSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    toast({
      title: "Session terminated",
      description: "The selected session has been ended successfully.",
    });
  };

  const handleTestNotification = (type: "sms" | "whatsapp") => {
    if (!profileData.phone) {
      toast({
        title: "Phone number required",
        description: "Please add a phone number in your Personal Information to test notifications.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `Test ${type.toUpperCase()} sent`,
      description: `A test message has been sent to ${profileData.phone}`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security</h3>
        <p className="text-sm text-muted-foreground">
          Configure your security settings and monitor account activity.
        </p>
        {role && <Badge variant="outline" className="mt-2">Current role: {role}</Badge>}
      </div>
      
      <Tabs defaultValue="password" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="2fa">Two-Factor Auth</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="password" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Password Security
              </CardTitle>
              <CardDescription>Manage your password and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    Password last changed: {security.passwordLastChanged}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" placeholder="Enter current password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="Enter new password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                </div>
              </div>
              
              <Button>Update Password</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Security Preferences</CardTitle>
              <CardDescription>Configure security notifications and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="loginNotifications">Email Login Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get email notifications when someone signs into your account
                  </p>
                </div>
                <Switch
                  id="loginNotifications"
                  checked={security.loginNotifications}
                  onCheckedChange={(checked) => handleInputChange("loginNotifications", checked)}
                />
              </div>

              {profileData.phone && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Phone Number:</strong> {profileData.phone}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    From your Personal Information. Update it in Profile settings if needed.
                  </p>
                </div>
              )}

              {!profileData.phone && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>No phone number set.</strong> Add a phone number in your Personal Information to enable SMS and WhatsApp notifications.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="smsNotifications" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    SMS Login Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get SMS alerts when someone signs into your account
                  </p>
                  {profileData.phone && (
                    <p className="text-xs text-muted-foreground">
                      Will be sent to: {profileData.phone}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestNotification("sms")}
                    disabled={!profileData.phone}
                  >
                    Test
                  </Button>
                  <Switch
                    id="smsNotifications"
                    checked={security.smsNotifications}
                    onCheckedChange={(checked) => handleInputChange("smsNotifications", checked)}
                    disabled={!profileData.phone}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="whatsappNotifications" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp Login Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get WhatsApp messages when someone signs into your account
                  </p>
                  {profileData.phone && (
                    <p className="text-xs text-muted-foreground">
                      Will be sent to: {profileData.phone}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestNotification("whatsapp")}
                    disabled={!profileData.phone}
                  >
                    Test
                  </Button>
                  <Switch
                    id="whatsappNotifications"
                    checked={security.whatsappNotifications}
                    onCheckedChange={(checked) => handleInputChange("whatsappNotifications", checked)}
                    disabled={!profileData.phone}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="2fa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!security.twoFactorEnabled ? (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="twoFactorMethod">Choose 2FA Method</Label>
                      <Select
                        value={security.twoFactorMethod}
                        onValueChange={(value) => handleInputChange("twoFactorMethod", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select 2FA method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="app">
                            <div className="flex items-center gap-2">
                              <QrCode className="h-4 w-4" />
                              Authenticator App
                            </div>
                          </SelectItem>
                          <SelectItem value="sms">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              SMS
                            </div>
                          </SelectItem>
                          <SelectItem value="whatsapp">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              WhatsApp
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {security.twoFactorMethod === "app" && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Authenticator App Setup</h4>
                        <p className="text-sm text-blue-800 mb-3">
                          1. Download an authenticator app like Google Authenticator or Authy
                        </p>
                        <p className="text-sm text-blue-800 mb-3">
                          2. Scan the QR code that will be displayed after clicking setup
                        </p>
                        <p className="text-sm text-blue-800">
                          3. Enter the verification code from your app
                        </p>
                      </div>
                    )}

                    {(security.twoFactorMethod === "sms" || security.twoFactorMethod === "whatsapp") && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">
                          {security.twoFactorMethod === "sms" ? "SMS" : "WhatsApp"} 2FA Setup
                        </h4>
                        {profileData.phone ? (
                          <p className="text-sm text-green-800">
                            Verification codes will be sent to: <strong>{profileData.phone}</strong>
                          </p>
                        ) : (
                          <p className="text-sm text-red-600">
                            Please add a phone number in your Personal Information first
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={handleEnable2FA}
                    disabled={(security.twoFactorMethod === "sms" || security.twoFactorMethod === "whatsapp") && !profileData.phone}
                    className="w-full"
                  >
                    Setup {security.twoFactorMethod === "app" ? "Authenticator App" : 
                           security.twoFactorMethod === "sms" ? "SMS 2FA" : "WhatsApp 2FA"}
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Two-Factor Authentication Enabled</p>
                        <p className="text-sm text-muted-foreground">
                          Method: {security.twoFactorMethod === "app" ? "Authenticator App" : 
                                   security.twoFactorMethod === "sms" ? "SMS" : "WhatsApp"}
                          {(security.twoFactorMethod === "sms" || security.twoFactorMethod === "whatsapp") && 
                           profileData.phone && ` (${profileData.phone})`}
                        </p>
                      </div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                    <Button variant="destructive" onClick={handleDisable2FA} className="flex-1">
                      Disable 2FA
                    </Button>
                  </div>
                </div>
              )}

              {!security.twoFactorEnabled && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Why enable 2FA?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Protect your account from unauthorized access</li>
                    <li>• Required for accessing sensitive features</li>
                    <li>• Industry standard security practice</li>
                    <li>• Multiple convenient options available</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Active Sessions
              </CardTitle>
              <CardDescription>Monitor and manage your active login sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{session.device}</p>
                      <p className="text-sm text-muted-foreground">{session.location}</p>
                      <p className="text-xs text-muted-foreground">{session.lastActive}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.current ? (
                        <Badge variant="default">Current</Badge>
                      ) : (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleTerminateSession(session.id)}
                        >
                          Terminate
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {sessions.length === 1 && (
                <div className="text-center py-4 text-muted-foreground">
                  <p>Only your current session is active</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Login Activity</CardTitle>
              <CardDescription>Recent login attempts and security events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loginAttempts.map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{attempt.time}</p>
                      <p className="text-sm text-muted-foreground">
                        {attempt.ip} • {attempt.location}
                      </p>
                    </div>
                    <Badge 
                      variant={attempt.status === "Success" ? "default" : "destructive"}
                    >
                      {attempt.status}
                    </Badge>
                  </div>
                ))}
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
