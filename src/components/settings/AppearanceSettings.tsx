
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun, Monitor } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AppearanceSettingsProps {
  onSettingChange?: () => void;
}

export function AppearanceSettings({ onSettingChange }: AppearanceSettingsProps) {
  const { toast } = useToast();
  const [theme, setTheme] = React.useState("system");
  
  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  const handleSave = () => {
    toast({
      title: "Appearance updated",
      description: `Theme preference set to ${theme}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of the application.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Theme Preference</CardTitle>
          <CardDescription>Select your preferred theme mode.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            defaultValue={theme}
            onValueChange={handleThemeChange}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem
                value="light"
                id="light"
                className="peer sr-only"
              />
              <Label
                htmlFor="light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Sun className="mb-3 h-6 w-6" />
                <span className="text-center">Light</span>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem
                value="dark"
                id="dark"
                className="peer sr-only"
              />
              <Label
                htmlFor="dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Moon className="mb-3 h-6 w-6" />
                <span className="text-center">Dark</span>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem
                value="system"
                id="system"
                className="peer sr-only"
              />
              <Label
                htmlFor="system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <Monitor className="mb-3 h-6 w-6" />
                <span className="text-center">System</span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save preferences</Button>
      </div>
    </div>
  );
}
