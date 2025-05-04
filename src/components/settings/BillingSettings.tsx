
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { CommonSettingsProps } from "./SettingsComponentTypes";
import { Button } from "@/components/ui/button";

interface BillingSettingsProps extends CommonSettingsProps {
  role: string;
}

export function BillingSettings({ role, onSettingChange }: BillingSettingsProps) {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Billing settings saved",
      description: "Your billing settings have been updated successfully.",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and payment information.
        </p>
      </div>
      
      <Button onClick={handleSave}>Save Settings</Button>
    </div>
  );
}
