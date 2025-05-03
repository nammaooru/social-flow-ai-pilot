
import React from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function GlobalSettings() {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Global settings saved",
      description: "Your global settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Global Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure system-wide settings for the entire platform.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>
            Configure core system settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="max-users">Maximum Users per Account</Label>
            <Input
              id="max-users"
              type="number"
              defaultValue="25"
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of users allowed per account.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="max-social-accounts">Maximum Social Accounts</Label>
            <Input
              id="max-social-accounts"
              type="number"
              defaultValue="50"
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of social media accounts allowed per organization.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="max-scheduled-posts">Maximum Scheduled Posts</Label>
            <Input
              id="max-scheduled-posts"
              type="number"
              defaultValue="1000"
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of scheduled posts allowed in the queue.
            </p>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="enable-ai" className="flex flex-col space-y-1">
              <span>AI Features</span>
              <span className="font-normal text-sm text-muted-foreground">
                Enable AI-powered features across the platform.
              </span>
            </Label>
            <Switch
              id="enable-ai"
              defaultChecked={true}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save System Configuration</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Default Preferences</CardTitle>
          <CardDescription>
            Set default preferences for new accounts and users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="default-timezone">Default Timezone</Label>
            <Select defaultValue="UTC">
              <SelectTrigger id="default-timezone">
                <SelectValue placeholder="Select a timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                <SelectItem value="Europe/London">London (GMT)</SelectItem>
                <SelectItem value="Europe/Paris">Central European Time</SelectItem>
                <SelectItem value="Asia/Tokyo">Japan Standard Time</SelectItem>
                <SelectItem value="Australia/Sydney">Australian Eastern Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="default-language">Default Language</Label>
            <Select defaultValue="en">
              <SelectTrigger id="default-language">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
                <SelectItem value="zh">Chinese (Simplified)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="default-theme">Default Theme</Label>
            <Select defaultValue="light">
              <SelectTrigger id="default-theme">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System Preference</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
              <span>Email Notifications</span>
              <span className="font-normal text-sm text-muted-foreground">
                Enable email notifications by default for new users.
              </span>
            </Label>
            <Switch
              id="email-notifications"
              defaultChecked={true}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Default Preferences</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>API Rate Limits</CardTitle>
          <CardDescription>
            Configure rate limits for API usage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="free-tier">
              <AccordionTrigger>Free Tier Limits</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="free-requests-per-minute">Requests per Minute</Label>
                    <Input
                      id="free-requests-per-minute"
                      type="number"
                      defaultValue="60"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="free-requests-per-day">Requests per Day</Label>
                    <Input
                      id="free-requests-per-day"
                      type="number"
                      defaultValue="10000"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="pro-tier">
              <AccordionTrigger>Pro Tier Limits</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="pro-requests-per-minute">Requests per Minute</Label>
                    <Input
                      id="pro-requests-per-minute"
                      type="number"
                      defaultValue="300"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pro-requests-per-day">Requests per Day</Label>
                    <Input
                      id="pro-requests-per-day"
                      type="number"
                      defaultValue="50000"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="enterprise-tier">
              <AccordionTrigger>Enterprise Tier Limits</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="enterprise-requests-per-minute">Requests per Minute</Label>
                    <Input
                      id="enterprise-requests-per-minute"
                      type="number"
                      defaultValue="1000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="enterprise-requests-per-day">Requests per Day</Label>
                    <Input
                      id="enterprise-requests-per-day"
                      type="number"
                      defaultValue="Unlimited"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Rate Limits</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
