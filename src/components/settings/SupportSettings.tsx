
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { CommonSettingsProps } from "./SettingsComponentTypes";
import { Button } from "@/components/ui/button";

interface SupportSettingsProps extends CommonSettingsProps {
  role: string;
}

export function SupportSettings({ role, onSettingChange }: SupportSettingsProps) {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Support settings saved",
      description: "Your support settings have been updated successfully.",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Support Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure support options and preferences.
        </p>
      </div>
      
      <Button onClick={handleSave}>Save Settings</Button>
    </div>
  );
}
