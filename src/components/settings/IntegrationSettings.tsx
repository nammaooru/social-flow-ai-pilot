
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CommonSettingsProps } from "@/pages/Settings";

export function IntegrationSettings({ onSettingChange }: CommonSettingsProps) {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Integration settings saved",
      description: "Your integration settings have been updated successfully.",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Integrations</h3>
        <p className="text-sm text-muted-foreground">
          Manage your application integrations.
        </p>
      </div>
      
      <div className="space-y-4">
        <p>Integration settings content will go here.</p>
      </div>
      
      <Button onClick={handleSave}>Save settings</Button>
    </div>
  );
}
