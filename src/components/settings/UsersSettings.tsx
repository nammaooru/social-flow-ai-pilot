
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface UsersSettingsProps {
  role?: string;
  onSettingChange?: () => void;
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
        <h3 className="text-lg font-medium">Users</h3>
        <p className="text-sm text-muted-foreground">
          Manage user access and permissions.
        </p>
      </div>
      
      <div className="space-y-4">
        {role && <p>Current role: {role}</p>}
        <p>Users settings content will go here.</p>
      </div>
      
      <Button onClick={handleSave}>Save settings</Button>
    </div>
  );
}
