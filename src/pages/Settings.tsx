import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { IntegrationSettings } from "@/components/settings/IntegrationSettings";
import { WhiteLabelSettings } from "@/components/settings/WhiteLabelSettings";
import { BillingSettings } from "@/components/settings/BillingSettings";
import { AnalyticsSettings } from "@/components/settings/AnalyticsSettings";
import { GlobalSettings } from "@/components/settings/GlobalSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { SocialAccountsSettings } from "@/components/settings/SocialAccountsSettings";
import { SupportSettings } from "@/components/settings/SupportSettings";
import { ApiKeysSettings } from "@/components/settings/ApiKeysSettings";
import { ChatbotSettings } from "@/components/settings/ChatbotSettings";
import { UsersSettings } from "@/components/settings/UsersSettings";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  User, CreditCard, Paintbrush, BarChart3, 
  Globe, Shield, Share2, Bell, HelpCircle, Key, MessageSquare, 
  Link, Users
} from "lucide-react";
// Import custom WhiteLabel icon instead of using it from lucide-react
import WhiteLabel from "@/components/settings/WhiteLabel";

// Role types for view switching
type UserRole = "Super Admin" | "White Label" | "Admin" | "User";

// Common interface for all settings components
export interface CommonSettingsProps {
  onSettingChange?: () => void;
  role?: UserRole;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedRole, setSelectedRole] = useState<UserRole>("User");
  const { toast } = useToast();
  
  // Define which settings are available to which roles (now includes users for Super Admin and White Label)
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
      "profile", "appearance", "analytics", "security", 
      "social-accounts", "notifications", "support", "chatbot", "integrations"
    ],
    "User": [
      "profile", "appearance", "security", "social-accounts", "notifications"
    ]
  };
  
  // Function for handling settings changes - can be used to track analytics or sync to backend
  const handleSettingChange = () => {
    console.log(`Setting changed by ${selectedRole} role`);
    // In a real app, you might want to sync settings to a backend or perform other operations
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
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="profile">
              <ProfileSettings onSettingChange={handleSettingChange} />
            </TabsContent>
            
            <TabsContent value="users">
              <UsersSettings role={selectedRole} onSettingChange={handleSettingChange} />
            </TabsContent>
            
            <TabsContent value="white-label">
              <WhiteLabelSettings onSettingChange={handleSettingChange} role={selectedRole} />
            </TabsContent>
            
            <TabsContent value="billing">
              <BillingSettings role={selectedRole} onSettingChange={handleSettingChange} />
            </TabsContent>
            
            <TabsContent value="appearance">
              <AppearanceSettings onSettingChange={handleSettingChange} />
            </TabsContent>
            
            <TabsContent value="analytics">
              <AnalyticsSettings role={selectedRole} onSettingChange={handleSettingChange} />
            </TabsContent>
            
            <TabsContent value="global-settings">
              <GlobalSettings onSettingChange={handleSettingChange} />
            </TabsContent>
            
            <TabsContent value="security">
              <SecuritySettings role={selectedRole} onSettingChange={handleSettingChange} />
            </TabsContent>
            
            <TabsContent value="social-accounts">
              <SocialAccountsSettings onSettingChange={handleSettingChange} />
            </TabsContent>
            
            <TabsContent value="notifications">
              <NotificationSettings onSettingChange={handleSettingChange} />
            </TabsContent>
            
            <TabsContent value="support">
              <SupportSettings role={selectedRole} onSettingChange={handleSettingChange} />
            </TabsContent>
            
            <TabsContent value="api-keys">
              <ApiKeysSettings onSettingChange={handleSettingChange} />
            </TabsContent>
            
            <TabsContent value="chatbot">
              <ChatbotSettings role={selectedRole} onSettingChange={handleSettingChange} />
            </TabsContent>
            
            <TabsContent value="integrations">
              <IntegrationSettings onSettingChange={handleSettingChange} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
