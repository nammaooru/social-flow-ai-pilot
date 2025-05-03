
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { IntegrationSettings } from "@/components/settings/IntegrationSettings";
import { UsersSettings } from "@/components/settings/UsersSettings";
import { WhiteLabelSettings } from "@/components/settings/WhiteLabelSettings";
import { BillingSettings } from "@/components/settings/BillingSettings";
import { AnalyticsSettings } from "@/components/settings/AnalyticsSettings";
import { GlobalSettings } from "@/components/settings/GlobalSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { SocialAccountsSettings } from "@/components/settings/SocialAccountsSettings";
import { SupportSettings } from "@/components/settings/SupportSettings";
import { ApiKeysSettings } from "@/components/settings/ApiKeysSettings";
import { ChatbotSettings } from "@/components/settings/ChatbotSettings";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  User, Users, WhiteLabel, CreditCard, Paintbrush, BarChart3, 
  Globe, Shield, Share2, Bell, HelpCircle, Key, MessageSquare, 
  Link
} from "lucide-react";

// Role types for view switching
type UserRole = "Super Admin" | "White Label" | "Admin" | "User";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedRole, setSelectedRole] = useState<UserRole>("User");
  const { toast } = useToast();
  
  // Define which settings are available to which roles
  const roleAccess: Record<UserRole, string[]> = {
    "Super Admin": [
      "profile", "users", "white-label", "billing", "appearance", "analytics", 
      "global-settings", "security", "social-accounts", "notifications", 
      "support", "api-keys", "chatbot", "integrations"
    ],
    "White Label": [
      "profile", "users", "billing", "appearance", "analytics", 
      "security", "social-accounts", "notifications", "support", "chatbot", "integrations"
    ],
    "Admin": [
      "profile", "users", "appearance", "analytics", "security", 
      "social-accounts", "notifications", "support", "chatbot", "integrations"
    ],
    "User": [
      "profile", "appearance", "security", "social-accounts", "notifications"
    ]
  };

  // Function to switch roles (demo only)
  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    // Reset to first available tab for this role
    setActiveTab(roleAccess[role][0]);
    
    toast({
      title: "View changed",
      description: `Now viewing as ${role}`,
    });
  };

  const settingsMenu = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "users", label: "Users", icon: <Users size={18} /> },
    { id: "white-label", label: "White Label", icon: <WhiteLabel size={18} /> },
    { id: "billing", label: "Billing", icon: <CreditCard size={18} /> },
    { id: "appearance", label: "Appearance", icon: <Paintbrush size={18} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
    { id: "global-settings", label: "Global Settings", icon: <Globe size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
    { id: "social-accounts", label: "Social Accounts", icon: <Share2 size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "support", label: "Support", icon: <HelpCircle size={18} /> },
    { id: "api-keys", label: "API Keys", icon: <Key size={18} /> },
    { id: "chatbot", label: "Chatbot", icon: <MessageSquare size={18} /> },
    { id: "integrations", label: "Integrations", icon: <Link size={18} /> },
  ];
  
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="flex flex-col items-end">
          <div className="text-sm text-muted-foreground mb-2">View as role (Demo):</div>
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm"
              variant={selectedRole === "Super Admin" ? "default" : "outline"} 
              onClick={() => handleRoleChange("Super Admin")}
            >
              Super Admin
            </Button>
            <Button 
              size="sm"
              variant={selectedRole === "White Label" ? "default" : "outline"} 
              onClick={() => handleRoleChange("White Label")}
            >
              White Label
            </Button>
            <Button 
              size="sm"
              variant={selectedRole === "Admin" ? "default" : "outline"} 
              onClick={() => handleRoleChange("Admin")}
            >
              Admin
            </Button>
            <Button 
              size="sm"
              variant={selectedRole === "User" ? "default" : "outline"} 
              onClick={() => handleRoleChange("User")}
            >
              User
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 bg-card rounded-lg border shadow-sm p-4">
          <div className="space-y-1">
            {settingsMenu
              .filter(item => roleAccess[selectedRole].includes(item.id))
              .map(item => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 ${activeTab === item.id ? "bg-secondary" : ""}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Button>
              ))
            }
          </div>
        </div>
        
        <div className="md:w-3/4 bg-card rounded-lg border shadow-sm p-6">
          <TabsContent value="profile" className="mt-0" hidden={activeTab !== "profile"}>
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="users" className="mt-0" hidden={activeTab !== "users"}>
            <UsersSettings role={selectedRole} />
          </TabsContent>
          
          <TabsContent value="white-label" className="mt-0" hidden={activeTab !== "white-label"}>
            <WhiteLabelSettings />
          </TabsContent>
          
          <TabsContent value="billing" className="mt-0" hidden={activeTab !== "billing"}>
            <BillingSettings role={selectedRole} />
          </TabsContent>
          
          <TabsContent value="appearance" className="mt-0" hidden={activeTab !== "appearance"}>
            <AppearanceSettings />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-0" hidden={activeTab !== "analytics"}>
            <AnalyticsSettings role={selectedRole} />
          </TabsContent>
          
          <TabsContent value="global-settings" className="mt-0" hidden={activeTab !== "global-settings"}>
            <GlobalSettings />
          </TabsContent>
          
          <TabsContent value="security" className="mt-0" hidden={activeTab !== "security"}>
            <SecuritySettings role={selectedRole} />
          </TabsContent>
          
          <TabsContent value="social-accounts" className="mt-0" hidden={activeTab !== "social-accounts"}>
            <SocialAccountsSettings />
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-0" hidden={activeTab !== "notifications"}>
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="support" className="mt-0" hidden={activeTab !== "support"}>
            <SupportSettings role={selectedRole} />
          </TabsContent>
          
          <TabsContent value="api-keys" className="mt-0" hidden={activeTab !== "api-keys"}>
            <ApiKeysSettings />
          </TabsContent>
          
          <TabsContent value="chatbot" className="mt-0" hidden={activeTab !== "chatbot"}>
            <ChatbotSettings role={selectedRole} />
          </TabsContent>
          
          <TabsContent value="integrations" className="mt-0" hidden={activeTab !== "integrations"}>
            <IntegrationSettings />
          </TabsContent>
        </div>
      </div>
    </div>
  );
};

export default Settings;
