
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { CommonSettingsProps } from "./SettingsComponentTypes";
import { Button } from "@/components/ui/button";

interface UsersSettingsProps extends CommonSettingsProps {
  role: string;
}

export function UsersSettings({ role, onSettingChange }: UsersSettingsProps) {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Users settings saved",
      description: "Your users settings have been updated successfully.",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Users Management</h3>
        <p className="text-sm text-muted-foreground">
          Manage users and permissions for your organization.
        </p>
      </div>
      
      <Button onClick={handleSave}>Save Settings</Button>
    </div>
  );
}
