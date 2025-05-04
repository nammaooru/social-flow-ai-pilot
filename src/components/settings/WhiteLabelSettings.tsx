
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { CommonSettingsProps } from "./SettingsComponentTypes";
import { Button } from "@/components/ui/button";

export function WhiteLabelSettings({ onSettingChange }: CommonSettingsProps) {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "White label settings saved",
      description: "Your white label settings have been updated successfully.",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">White Label Settings</h3>
        <p className="text-sm text-muted-foreground">
          Customize the appearance and branding of your white-labeled solution.
        </p>
      </div>
      
      <Button onClick={handleSave}>Save Settings</Button>
    </div>
  );
}
