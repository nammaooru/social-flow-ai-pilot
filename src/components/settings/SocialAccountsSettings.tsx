
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { CommonSettingsProps } from "./SettingsComponentTypes";
import { Button } from "@/components/ui/button";

interface SocialAccountsSettingsProps extends CommonSettingsProps {}

export function SocialAccountsSettings({ onSettingChange }: SocialAccountsSettingsProps) {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Social accounts settings saved",
      description: "Your social accounts settings have been updated successfully.",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Social Accounts</h3>
        <p className="text-sm text-muted-foreground">
          Connect and manage your social media accounts.
        </p>
      </div>
      
      <Button onClick={handleSave}>Save Settings</Button>
    </div>
  );
}
