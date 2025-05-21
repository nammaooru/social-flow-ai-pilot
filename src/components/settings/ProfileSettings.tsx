
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CommonSettingsProps } from "@/pages/Settings";

export function ProfileSettings({ onSettingChange }: CommonSettingsProps) {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Profile settings saved",
      description: "Your profile settings have been updated successfully.",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your personal profile information.
        </p>
      </div>
      
      <div className="space-y-4">
        <p>Profile settings content will go here.</p>
      </div>
      
      <Button onClick={handleSave}>Save settings</Button>
    </div>
  );
}
