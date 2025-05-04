
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { CommonSettingsProps } from "./SettingsComponentTypes";
import { Button } from "@/components/ui/button";

interface SecuritySettingsProps extends CommonSettingsProps {
  role: string;
}

export function SecuritySettings({ role, onSettingChange }: SecuritySettingsProps) {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Security settings saved",
      description: "Your security settings have been updated successfully.",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your account security settings.
        </p>
      </div>
      
      <Button onClick={handleSave}>Save Settings</Button>
    </div>
  );
}
