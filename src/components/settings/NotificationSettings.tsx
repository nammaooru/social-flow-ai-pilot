
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Mail, Smartphone, MessageSquare } from "lucide-react";
import { CommonSettingsProps } from "@/pages/Settings";

export function NotificationSettings({ onSettingChange }: CommonSettingsProps) {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    // Email notifications
    emailEnabled: true,
    emailNewPosts: true,
    emailComments: true,
    emailMentions: true,
    emailFollowers: false,
    emailDigest: "weekly",
    
    // Push notifications
    pushEnabled: true,
    pushNewPosts: false,
    pushComments: true,
    pushMentions: true,
    pushFollowers: true,
    
    // SMS notifications
    smsEnabled: false,
    smsComments: false,
    smsMentions: false,
    smsEmergency: true,
    
    // In-app notifications
    inAppEnabled: true,
    inAppComments: true,
    inAppMentions: true,
    inAppFollowers: true,
    inAppUpdates: true,
    
    // Quiet hours
    quietHoursEnabled: true,
    quietStart: "22:00",
    quietEnd: "08:00",
    timezone: "America/New_York"
  });
  
  const handleSave = () => {
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated successfully.",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  const handleSettingChange = (field: string, value: boolean | string) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Configure your notification preferences across all channels and platforms.
        </p>
      </div>
      
      <Tabs defaultValue="email" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="push">Push</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>Configure which events trigger email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Enable Email Notifications</label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={notifications.emailEnabled}
                  onCheckedChange={(checked) => handleSettingChange("emailEnabled", checked)}
                />
              </div>
              
              {notifications.emailEnabled && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">New Posts</label>
                      <p className="text-sm text-muted-foreground">
                        When content is published successfully
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNewPosts}
                      onCheckedChange={(checked) => handleSettingChange("emailNewPosts", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Comments</label>
                      <p className="text-sm text-muted-foreground">
                        When someone comments on your posts
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailComments}
                      onCheckedChange={(checked) => handleSettingChange("emailComments", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Mentions</label>
                      <p className="text-sm text-muted-foreground">
                        When you're mentioned in posts or comments
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailMentions}
                      onCheckedChange={(checked) => handleSettingChange("emailMentions", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">New Followers</label>
                      <p className="text-sm text-muted-foreground">
                        When you gain new followers
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailFollowers}
                      onCheckedChange={(checked) => handleSettingChange("emailFollowers", checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Digest Frequency</label>
                    <Select value={notifications.emailDigest} onValueChange={(value) => handleSettingChange("emailDigest", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="push" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Push Notifications
              </CardTitle>
              <CardDescription>Configure browser and mobile push notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Enable Push Notifications</label>
                  <p className="text-sm text-muted-foreground">
                    Receive real-time push notifications
                  </p>
                </div>
                <Switch
                  checked={notifications.pushEnabled}
                  onCheckedChange={(checked) => handleSettingChange("pushEnabled", checked)}
                />
              </div>
              
              {notifications.pushEnabled && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">New Posts</label>
                      <p className="text-sm text-muted-foreground">
                        When content is published successfully
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushNewPosts}
                      onCheckedChange={(checked) => handleSettingChange("pushNewPosts", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Comments</label>
                      <p className="text-sm text-muted-foreground">
                        When someone comments on your posts
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushComments}
                      onCheckedChange={(checked) => handleSettingChange("pushComments", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Mentions</label>
                      <p className="text-sm text-muted-foreground">
                        When you're mentioned in posts or comments
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushMentions}
                      onCheckedChange={(checked) => handleSettingChange("pushMentions", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">New Followers</label>
                      <p className="text-sm text-muted-foreground">
                        When you gain new followers
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushFollowers}
                      onCheckedChange={(checked) => handleSettingChange("pushFollowers", checked)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                SMS Notifications
              </CardTitle>
              <CardDescription>Configure text message notifications for urgent events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Enable SMS Notifications</label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via text message
                  </p>
                </div>
                <Switch
                  checked={notifications.smsEnabled}
                  onCheckedChange={(checked) => handleSettingChange("smsEnabled", checked)}
                />
              </div>
              
              {notifications.smsEnabled && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Comments</label>
                      <p className="text-sm text-muted-foreground">
                        When someone comments on your posts
                      </p>
                    </div>
                    <Switch
                      checked={notifications.smsComments}
                      onCheckedChange={(checked) => handleSettingChange("smsComments", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Mentions</label>
                      <p className="text-sm text-muted-foreground">
                        When you're mentioned in posts or comments
                      </p>
                    </div>
                    <Switch
                      checked={notifications.smsMentions}
                      onCheckedChange={(checked) => handleSettingChange("smsMentions", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Emergency Alerts</label>
                      <p className="text-sm text-muted-foreground">
                        Critical system notifications
                      </p>
                    </div>
                    <Switch
                      checked={notifications.smsEmergency}
                      onCheckedChange={(checked) => handleSettingChange("smsEmergency", checked)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                General Preferences
              </CardTitle>
              <CardDescription>Configure general notification settings and quiet hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">In-App Notifications</label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications within the application
                  </p>
                </div>
                <Switch
                  checked={notifications.inAppEnabled}
                  onCheckedChange={(checked) => handleSettingChange("inAppEnabled", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Quiet Hours</label>
                  <p className="text-sm text-muted-foreground">
                    Disable notifications during specified hours
                  </p>
                </div>
                <Switch
                  checked={notifications.quietHoursEnabled}
                  onCheckedChange={(checked) => handleSettingChange("quietHoursEnabled", checked)}
                />
              </div>
              
              {notifications.quietHoursEnabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Time</label>
                    <Select value={notifications.quietStart} onValueChange={(value) => handleSettingChange("quietStart", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20:00">8:00 PM</SelectItem>
                        <SelectItem value="21:00">9:00 PM</SelectItem>
                        <SelectItem value="22:00">10:00 PM</SelectItem>
                        <SelectItem value="23:00">11:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Time</label>
                    <Select value={notifications.quietEnd} onValueChange={(value) => handleSettingChange("quietEnd", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="06:00">6:00 AM</SelectItem>
                        <SelectItem value="07:00">7:00 AM</SelectItem>
                        <SelectItem value="08:00">8:00 AM</SelectItem>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
}
