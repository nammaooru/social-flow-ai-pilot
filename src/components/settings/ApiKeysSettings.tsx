
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CommonSettingsProps } from "@/pages/Settings";

export function ApiKeysSettings({ onSettingChange }: CommonSettingsProps) {
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
          Manage your API keys for integration with external services.
        </p>
      </div>
      
      <div className="space-y-4">
        <p>API keys settings content will go here.</p>
      </div>
      
      <Button onClick={handleSave}>Save settings</Button>
    </div>
  );
}
