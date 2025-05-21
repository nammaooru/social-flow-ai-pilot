
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CommonSettingsProps } from "@/pages/Settings";

interface SecuritySettingsProps extends CommonSettingsProps {
  // No need to redefine role as it's already in CommonSettingsProps with the correct type
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
        <h3 className="text-lg font-medium">Security</h3>
        <p className="text-sm text-muted-foreground">
          Configure your security settings.
        </p>
      </div>
      
      <div className="space-y-4">
        {role && <p>Current role: {role}</p>}
        <p>Security settings content will go here.</p>
      </div>
      
      <Button onClick={handleSave}>Save settings</Button>
    </div>
  );
}
