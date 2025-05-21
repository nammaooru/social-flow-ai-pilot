
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CommonSettingsProps } from "@/pages/Settings";

interface ChatbotSettingsProps extends CommonSettingsProps {
  // No need to redefine role as it's already in CommonSettingsProps with the correct type
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
        <h3 className="text-lg font-medium">Chatbot</h3>
        <p className="text-sm text-muted-foreground">
          Configure your chatbot settings.
        </p>
      </div>
      
      <div className="space-y-4">
        {role && <p>Current role: {role}</p>}
        <p>Chatbot settings content will go here.</p>
      </div>
      
      <Button onClick={handleSave}>Save settings</Button>
    </div>
  );
}
