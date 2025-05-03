
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { IntegrationSettings } from "@/components/settings/IntegrationSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and set preferences.
        </p>
      </div>
      
      <div className="relative">
        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="mb-6 overflow-auto pb-1">
            <TabsList className="inline-flex h-auto w-auto min-w-full md:w-auto space-x-1 p-1 whitespace-nowrap">
              <TabsTrigger value="profile" className="py-2 px-3">
                Profile
              </TabsTrigger>
              <TabsTrigger value="account" className="py-2 px-3">
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications" className="py-2 px-3">
                Notifications
              </TabsTrigger>
              <TabsTrigger value="appearance" className="py-2 px-3">
                Appearance
              </TabsTrigger>
              <TabsTrigger value="integrations" className="py-2 px-3">
                Integrations
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <TabsContent value="profile" className="mt-0">
              <ProfileSettings />
            </TabsContent>
            
            <TabsContent value="account" className="mt-0">
              <AccountSettings />
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <NotificationSettings />
            </TabsContent>
            
            <TabsContent value="appearance" className="mt-0">
              <AppearanceSettings />
            </TabsContent>
            
            <TabsContent value="integrations" className="mt-0">
              <IntegrationSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
