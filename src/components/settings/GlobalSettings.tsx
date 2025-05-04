
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CommonSettingsProps } from "@/pages/Settings";

export function GlobalSettings({ onSettingChange }: CommonSettingsProps) {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Global settings saved",
      description: "Your global settings have been updated successfully.",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Global Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure global application settings.
        </p>
      </div>
      
      <div className="space-y-4">
        <p>Global settings content will go here.</p>
      </div>
      
      <Button onClick={handleSave}>Save settings</Button>
    </div>
  );
}
