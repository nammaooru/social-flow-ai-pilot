
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Instagram, Twitter, Facebook, Link, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface IntegrationSettingsProps {
  onSettingChange?: () => void;
}

interface IntegrationCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

function IntegrationCard({
  name,
  description,
  icon,
  isConnected,
  onConnect,
  onDisconnect,
}: IntegrationCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle className="text-base">{name}</CardTitle>
          {isConnected && (
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
              <span className="flex items-center">
                <CheckCircle className="mr-1 h-3 w-3" />
                Connected
              </span>
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter>
        {isConnected ? (
          <Button variant="outline" onClick={onDisconnect}>
            Disconnect
          </Button>
        ) : (
          <Button onClick={onConnect}>Connect</Button>
        )}
      </CardFooter>
    </Card>
  );
}

export function IntegrationSettings({ onSettingChange }: IntegrationSettingsProps) {
  const { toast } = useToast();
  const [integrations, setIntegrations] = React.useState({
    instagram: false,
    twitter: true,
    facebook: false,
  });

  const handleConnect = (platform: keyof typeof integrations) => {
    setIntegrations({
      ...integrations,
      [platform]: true,
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
    
    toast({
      title: "Integration connected",
      description: `Your ${platform} account has been successfully connected.`,
    });
  };

  const handleDisconnect = (platform: keyof typeof integrations) => {
    setIntegrations({
      ...integrations,
      [platform]: false,
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
    
    toast({
      title: "Integration disconnected",
      description: `Your ${platform} account has been disconnected.`,
    });
  };

  const handleGenerateApiKey = () => {
    if (onSettingChange) {
      onSettingChange();
    }
    
    toast({
      title: "Feature coming soon",
      description: "API key generation will be available soon.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Social Media Integrations</h3>
        <p className="text-sm text-muted-foreground">
          Connect your social media accounts to schedule and publish content.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <IntegrationCard
          name="Instagram"
          description="Connect your Instagram account to schedule and publish posts."
          icon={<Instagram className="h-5 w-5 text-pink-500" />}
          isConnected={integrations.instagram}
          onConnect={() => handleConnect("instagram")}
          onDisconnect={() => handleDisconnect("instagram")}
        />
        
        <IntegrationCard
          name="Twitter"
          description="Connect your Twitter account to schedule and publish tweets."
          icon={<Twitter className="h-5 w-5 text-blue-400" />}
          isConnected={integrations.twitter}
          onConnect={() => handleConnect("twitter")}
          onDisconnect={() => handleDisconnect("twitter")}
        />
        
        <IntegrationCard
          name="Facebook"
          description="Connect your Facebook page to schedule and publish posts."
          icon={<Facebook className="h-5 w-5 text-blue-600" />}
          isConnected={integrations.facebook}
          onConnect={() => handleConnect("facebook")}
          onDisconnect={() => handleDisconnect("facebook")}
        />
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium">API Keys</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Manage API keys for third-party integrations.
        </p>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generate API Key</CardTitle>
            <CardDescription>
              Create an API key to integrate with our platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Developer API</p>
                <p className="text-sm text-muted-foreground">
                  Access our API to create custom integrations.
                </p>
              </div>
              <Button
                variant="outline"
                className="flex items-center"
                onClick={handleGenerateApiKey}
              >
                <Link className="mr-2 h-4 w-4" />
                Generate key
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
