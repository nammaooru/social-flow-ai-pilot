import React from "react";
import { useToast } from "@/hooks/use-toast";
import { CommonSettingsProps } from "./SettingsComponentTypes";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface NotificationSettingsProps extends CommonSettingsProps {}

export function NotificationSettings({ onSettingChange }: NotificationSettingsProps) {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(false);
  const [weeklyDigest, setWeeklyDigest] = React.useState(true);
  const [commentNotifications, setCommentNotifications] = React.useState(true);
  const [mentionNotifications, setMentionNotifications] = React.useState(true);
  
  const handleSettingChange = (setter: React.Dispatch<React.SetStateAction<boolean>>, value: boolean) => {
    setter(value);
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  const handleSave = () => {
    toast({
      title: "Notification preferences saved",
      description: "Your notification settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you'll receive notifications and updates.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
            <span>Email notifications</span>
            <span className="font-normal text-sm text-muted-foreground">
              Receive important updates via email
            </span>
          </Label>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={(checked) => handleSettingChange(setEmailNotifications, checked)}
          />
        </div>
        
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
            <span>Push notifications</span>
            <span className="font-normal text-sm text-muted-foreground">
              Receive notifications on your device
            </span>
          </Label>
          <Switch
            id="push-notifications"
            checked={pushNotifications}
            onCheckedChange={(checked) => handleSettingChange(setPushNotifications, checked)}
          />
        </div>
        
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="weekly-digest" className="flex flex-col space-y-1">
            <span>Weekly digest</span>
            <span className="font-normal text-sm text-muted-foreground">
              Get a summary of your account activity
            </span>
          </Label>
          <Switch
            id="weekly-digest"
            checked={weeklyDigest}
            onCheckedChange={(checked) => handleSettingChange(setWeeklyDigest, checked)}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="comment-notifications" className="flex flex-col space-y-1">
            <span>Comments</span>
            <span className="font-normal text-sm text-muted-foreground">
              Get notified when someone comments on your posts
            </span>
          </Label>
          <Switch
            id="comment-notifications"
            checked={commentNotifications}
            onCheckedChange={(checked) => handleSettingChange(setCommentNotifications, checked)}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="mention-notifications" className="flex flex-col space-y-1">
            <span>Mentions</span>
            <span className="font-normal text-sm text-muted-foreground">
              Get notified when someone mentions you
            </span>
          </Label>
          <Switch
            id="mention-notifications"
            checked={mentionNotifications}
            onCheckedChange={(checked) => handleSettingChange(setMentionNotifications, checked)}
          />
        </div>
      </div>
      
      <Button onClick={handleSave}>Save preferences</Button>
    </div>
  );
}
