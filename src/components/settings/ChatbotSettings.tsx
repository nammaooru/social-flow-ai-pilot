
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { CommonSettingsProps } from "./SettingsComponentTypes";
import { Button } from "@/components/ui/button";

interface ChatbotSettingsProps extends CommonSettingsProps {
  role: string;
}

export function ChatbotSettings({ role, onSettingChange }: ChatbotSettingsProps) {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Chatbot settings saved",
      description: "Your chatbot settings have been updated successfully.",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Chatbot Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your chatbot's behavior and appearance.
        </p>
      </div>
      
      <Button onClick={handleSave}>Save Settings</Button>
    </div>
  );
}
