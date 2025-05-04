
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CommonSettingsProps } from "@/pages/Settings";

export function SocialAccountsSettings({ onSettingChange }: CommonSettingsProps) {
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
          Manage your connected social accounts.
        </p>
      </div>
      
      <div className="space-y-4">
        <p>Social accounts settings content will go here.</p>
      </div>
      
      <Button onClick={handleSave}>Save settings</Button>
    </div>
  );
}
