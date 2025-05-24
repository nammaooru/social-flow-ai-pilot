
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Key, Smartphone, AlertTriangle, Eye } from "lucide-react";
import { CommonSettingsProps } from "@/pages/Settings";

interface SecuritySettingsProps extends CommonSettingsProps {
  // No need to redefine role as it's already in CommonSettingsProps with the correct type
}

export function SecuritySettings({ role, onSettingChange }: SecuritySettingsProps) {
  const { toast } = useToast();
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    passwordLastChanged: "30 days ago",
    loginNotifications: true,
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
    toast({
      title: "2FA Setup",
      description: "Two-factor authentication setup initiated.",
    });
  };
  
  const handleTerminateSession = (sessionId: string) => {
    toast({
      title: "Session terminated",
      description: "The selected session has been ended.",
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
              <CardDescription>Configure additional security options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="loginNotifications">Login Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone signs into your account
                  </p>
                </div>
                <Switch
                  id="loginNotifications"
                  checked={security.loginNotifications}
                  onCheckedChange={(checked) => handleInputChange("loginNotifications", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="2fa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Authenticator App</p>
                    <p className="text-sm text-muted-foreground">
                      {security.twoFactorEnabled ? "Enabled" : "Not configured"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {security.twoFactorEnabled && (
                    <Badge variant="default">Active</Badge>
                  )}
                  <Button 
                    variant={security.twoFactorEnabled ? "outline" : "default"}
                    onClick={handleEnable2FA}
                  >
                    {security.twoFactorEnabled ? "Manage" : "Setup"}
                  </Button>
                </div>
              </div>
              
              {!security.twoFactorEnabled && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Why enable 2FA?</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Protect your account from unauthorized access</li>
                    <li>• Required for accessing sensitive features</li>
                    <li>• Industry standard security practice</li>
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
                      {session.current && <Badge variant="default">Current</Badge>}
                      {!session.current && (
                        <Button 
                          variant="outline" 
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
