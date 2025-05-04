
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { CommonSettingsProps } from "./SettingsComponentTypes";
import { Button } from "@/components/ui/button";

interface ApiKeysSettingsProps extends CommonSettingsProps {}

export function ApiKeysSettings({ onSettingChange }: ApiKeysSettingsProps) {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "API keys updated",
      description: "Your API keys have been updated successfully.",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">API Keys</h3>
        <p className="text-sm text-muted-foreground">
          Manage your API keys and access tokens.
        </p>
      </div>
      
      <Button onClick={handleSave}>Save Settings</Button>
    </div>
  );
}
