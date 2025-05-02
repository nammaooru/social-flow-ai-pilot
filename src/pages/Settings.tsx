
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  Users, Shield, CreditCard, Palette, BarChart, Settings as SettingsIcon, 
  Globe, User, Lock, FileText, BellRing, Headphones, Brush, Bot, 
  Building, UserPlus, Database, Key, Cloud, FileCode, PanelLeft, LogOut
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// User role types
type UserRole = 'superAdmin' | 'whiteLabel' | 'admin' | 'user';

const Settings = () => {
  // In a real app, this would come from your auth context
  const [userRole, setUserRole] = useState<UserRole>('superAdmin');
  const [activeTab, setActiveTab] = useState("account");
  
  // Demo function to show toast notifications for settings changes
  const handleSave = (section: string) => {
    toast({
      title: "Settings updated",
      description: `Your ${section} settings have been saved successfully.`,
    });
  };

  // For demo purposes - allow switching between roles
  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    toast({
      title: "Role changed",
      description: `You are now viewing the application as: ${role}`,
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        
        {/* Role selector for demo purposes */}
        <div className="flex flex-col space-y-2">
          <Label>View as role (Demo):</Label>
          <ToggleGroup type="single" value={userRole} onValueChange={(value) => handleRoleChange(value as UserRole)}>
            <ToggleGroupItem value="superAdmin" aria-label="Super Admin">
              <Shield className="h-4 w-4 mr-2" />
              Super Admin
            </ToggleGroupItem>
            <ToggleGroupItem value="whiteLabel" aria-label="White Label">
              <Building className="h-4 w-4 mr-2" />
              White Label
            </ToggleGroupItem>
            <ToggleGroupItem value="admin" aria-label="Admin">
              <UserPlus className="h-4 w-4 mr-2" />
              Admin
            </ToggleGroupItem>
            <ToggleGroupItem value="user" aria-label="User">
              <User className="h-4 w-4 mr-2" />
              User
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <Card>
            <CardContent className="p-0">
              <Tabs
                defaultValue="account"
                orientation="vertical"
                className="w-full"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="flex flex-col h-auto items-stretch border-r md:w-full rounded-none p-0">
                  <TabsTrigger value="account" className="justify-start rounded-none border-b p-3">
                    <User className="h-5 w-5 mr-2" />
                    Profile
                  </TabsTrigger>
                  
                  {/* User Management - only for admin and higher */}
                  {['superAdmin', 'whiteLabel', 'admin'].includes(userRole) && (
                    <TabsTrigger value="users" className="justify-start rounded-none border-b p-3">
                      <Users className="h-5 w-5 mr-2" />
                      Users
                    </TabsTrigger>
                  )}
                  
                  {/* White Label - only for super admin & white label */}
                  {['superAdmin', 'whiteLabel'].includes(userRole) && (
                    <TabsTrigger value="whiteLabelSettings" className="justify-start rounded-none border-b p-3">
                      <Building className="h-5 w-5 mr-2" />
                      White Label
                    </TabsTrigger>
                  )}
                  
                  {/* Subscription - visible to all except regular users */}
                  {['superAdmin', 'whiteLabel', 'admin'].includes(userRole) && (
                    <TabsTrigger value="billing" className="justify-start rounded-none border-b p-3">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Billing
                    </TabsTrigger>
                  )}
                  
                  {/* Appearance - for customizing UI, available to all except users */}
                  {['superAdmin', 'whiteLabel', 'admin'].includes(userRole) && (
                    <TabsTrigger value="appearance" className="justify-start rounded-none border-b p-3">
                      <Palette className="h-5 w-5 mr-2" />
                      Appearance
                    </TabsTrigger>
                  )}
                  
                  {/* Analytics - available to all except users */}
                  {['superAdmin', 'whiteLabel', 'admin'].includes(userRole) && (
                    <TabsTrigger value="analytics" className="justify-start rounded-none border-b p-3">
                      <BarChart className="h-5 w-5 mr-2" />
                      Analytics
                    </TabsTrigger>
                  )}
                  
                  {/* Global Settings - super admin only */}
                  {userRole === 'superAdmin' && (
                    <TabsTrigger value="globalSettings" className="justify-start rounded-none border-b p-3">
                      <Globe className="h-5 w-5 mr-2" />
                      Global Settings
                    </TabsTrigger>
                  )}
                  
                  {/* Security - for all */}
                  <TabsTrigger value="security" className="justify-start rounded-none border-b p-3">
                    <Lock className="h-5 w-5 mr-2" />
                    Security
                  </TabsTrigger>
                  
                  {/* Social Accounts - for all */}
                  <TabsTrigger value="social" className="justify-start rounded-none border-b p-3">
                    <Globe className="h-5 w-5 mr-2" />
                    Social Accounts
                  </TabsTrigger>
                  
                  {/* Notifications - for all */}
                  <TabsTrigger value="notifications" className="justify-start rounded-none border-b p-3">
                    <BellRing className="h-5 w-5 mr-2" />
                    Notifications
                  </TabsTrigger>
                  
                  {/* Support - for all */}
                  <TabsTrigger value="support" className="justify-start rounded-none border-b p-3">
                    <Headphones className="h-5 w-5 mr-2" />
                    Support
                  </TabsTrigger>
                  
                  {/* API Keys - for admin and higher */}
                  {['superAdmin', 'whiteLabel', 'admin'].includes(userRole) && (
                    <TabsTrigger value="apiKeys" className="justify-start rounded-none border-b p-3">
                      <Key className="h-5 w-5 mr-2" />
                      API Keys
                    </TabsTrigger>
                  )}

                  {/* Chatbot - for admin and higher */}
                  {['superAdmin', 'whiteLabel', 'admin'].includes(userRole) && (
                    <TabsTrigger value="chatbot" className="justify-start rounded-none border-b p-3">
                      <Bot className="h-5 w-5 mr-2" />
                      Chatbot
                    </TabsTrigger>
                  )}
                  
                  {/* Integrations - for all */}
                  <TabsTrigger value="integrations" className="justify-start rounded-none border-b p-3">
                    <Database className="h-5 w-5 mr-2" />
                    Integrations
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Content area */}
        <div className="md:w-3/4">
          <Tabs value={activeTab} className="w-full">
            {/* Profile section */}
            <TabsContent value="account" className="mt-0">
              <ProfileSettings userRole={userRole} onSave={() => handleSave('profile')} />
            </TabsContent>
            
            {/* User Management */}
            {['superAdmin', 'whiteLabel', 'admin'].includes(userRole) && (
              <TabsContent value="users" className="mt-0">
                <UserManagementSettings userRole={userRole} onSave={() => handleSave('user management')} />
              </TabsContent>
            )}

            {/* White Label */}
            {['superAdmin', 'whiteLabel'].includes(userRole) && (
              <TabsContent value="whiteLabelSettings" className="mt-0">
                <WhiteLabelSettings userRole={userRole} onSave={() => handleSave('white label')} />
              </TabsContent>
            )}

            {/* Billing */}
            {['superAdmin', 'whiteLabel', 'admin'].includes(userRole) && (
              <TabsContent value="billing" className="mt-0">
                <BillingSettings userRole={userRole} onSave={() => handleSave('billing')} />
              </TabsContent>
            )}

            {/* Appearance */}
            {['superAdmin', 'whiteLabel', 'admin'].includes(userRole) && (
              <TabsContent value="appearance" className="mt-0">
                <AppearanceSettings userRole={userRole} onSave={() => handleSave('appearance')} />
              </TabsContent>
            )}

            {/* Analytics */}
            {['superAdmin', 'whiteLabel', 'admin'].includes(userRole) && (
              <TabsContent value="analytics" className="mt-0">
                <AnalyticsSettings userRole={userRole} onSave={() => handleSave('analytics')} />
              </TabsContent>
            )}

            {/* Global Settings - super admin only */}
            {userRole === 'superAdmin' && (
              <TabsContent value="globalSettings" className="mt-0">
                <GlobalSettings onSave={() => handleSave('global settings')} />
              </TabsContent>
            )}

            {/* Security */}
            <TabsContent value="security" className="mt-0">
              <SecuritySettings userRole={userRole} onSave={() => handleSave('security')} />
            </TabsContent>

            {/* Social Accounts */}
            <TabsContent value="social" className="mt-0">
              <SocialAccountsSettings userRole={userRole} onSave={() => handleSave('social accounts')} />
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="mt-0">
              <NotificationSettings userRole={userRole} onSave={() => handleSave('notifications')} />
            </TabsContent>

            {/* Support */}
            <TabsContent value="support" className="mt-0">
              <SupportSettings userRole={userRole} />
            </TabsContent>

            {/* API Keys */}
            {['superAdmin', 'whiteLabel', 'admin'].includes(userRole) && (
              <TabsContent value="apiKeys" className="mt-0">
                <ApiKeysSettings userRole={userRole} onSave={() => handleSave('API keys')} />
              </TabsContent>
            )}

            {/* Chatbot */}
            {['superAdmin', 'whiteLabel', 'admin'].includes(userRole) && (
              <TabsContent value="chatbot" className="mt-0">
                <ChatbotSettings userRole={userRole} onSave={() => handleSave('chatbot')} />
              </TabsContent>
            )}

            {/* Integrations */}
            <TabsContent value="integrations" className="mt-0">
              <IntegrationsSettings userRole={userRole} onSave={() => handleSave('integrations')} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// Individual section components
interface SettingsSectionProps {
  userRole: UserRole;
  onSave?: () => void;
}

const ProfileSettings: React.FC<SettingsSectionProps> = ({ onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Manage your personal information and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Your name" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" placeholder="Your email" defaultValue="john.doe@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="Your phone number" defaultValue="+1 (555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" defaultValue="UTC-5 Eastern Time" />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Password & Authentication</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="enable-2fa" />
            <Label htmlFor="enable-2fa">Enable Two-Factor Authentication</Label>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Account Preferences</h3>
          <div className="flex items-center space-x-2">
            <Switch id="email-marketing" defaultChecked />
            <Label htmlFor="email-marketing">Receive marketing emails</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="email-updates" defaultChecked />
            <Label htmlFor="email-updates">Receive product updates</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="activity-digest" defaultChecked />
            <Label htmlFor="activity-digest">Receive weekly activity digest</Label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const UserManagementSettings: React.FC<SettingsSectionProps> = ({ userRole, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage users, roles, and permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {userRole === 'superAdmin' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Super Admin Controls</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Create White Label Account
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Create Admin
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Global User Limits</Label>
              <Input type="number" defaultValue="1000" />
              <p className="text-sm text-muted-foreground">Maximum number of users allowed across all accounts</p>
            </div>
          </div>
        )}

        {userRole === 'whiteLabel' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">White Label Admin Controls</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Create Admin
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Organization User Limits</Label>
              <Input type="number" defaultValue="100" />
              <p className="text-sm text-muted-foreground">Maximum number of users allowed in your organization</p>
            </div>
          </div>
        )}

        {userRole === 'admin' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Admin Controls</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Create User
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Team User Limits</Label>
              <p className="text-sm">You have 24/50 users</p>
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Users & Permissions</h3>
          <div className="border rounded-md">
            <div className="grid grid-cols-5 font-medium p-3 border-b">
              <div>Name</div>
              <div>Email</div>
              <div>Role</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            <div className="grid grid-cols-5 p-3 border-b items-center">
              <div>Jane Smith</div>
              <div>jane.smith@example.com</div>
              <div>
                {userRole === 'superAdmin' ? 'White Label' : 
                 userRole === 'whiteLabel' ? 'Admin' : 'User'}
              </div>
              <div><Badge variant="outline" className="bg-green-100">Active</Badge></div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">Edit</Button>
                <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
              </div>
            </div>
            <div className="grid grid-cols-5 p-3 border-b items-center">
              <div>Mike Johnson</div>
              <div>mike.j@example.com</div>
              <div>
                {userRole === 'superAdmin' ? 'Admin' : 
                 userRole === 'whiteLabel' ? 'Admin' : 'User'}
              </div>
              <div><Badge variant="outline" className="bg-green-100">Active</Badge></div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">Edit</Button>
                <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
              </div>
            </div>
            <div className="grid grid-cols-5 p-3 items-center">
              <div>Sarah Williams</div>
              <div>sarah.w@example.com</div>
              <div>User</div>
              <div><Badge variant="outline" className="bg-yellow-100">Invited</Badge></div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">Edit</Button>
                <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const WhiteLabelSettings: React.FC<SettingsSectionProps> = ({ userRole, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>White Label Settings</CardTitle>
        <CardDescription>
          {userRole === 'superAdmin' 
            ? 'Manage White Label accounts and their settings' 
            : 'Customize your White Label platform'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Branding</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" placeholder="Your Company" defaultValue="Acme Corp" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Custom Domain</Label>
              <Input id="domain" placeholder="app.yourcompany.com" defaultValue="app.acmecorp.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Company Logo</Label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                  Logo
                </div>
                <Button variant="outline">Upload New</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="favicon">Favicon</Label>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                  Icon
                </div>
                <Button variant="outline">Upload New</Button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Theme Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-purple-500"></div>
                <Input id="primaryColor" defaultValue="#8B5CF6" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-400"></div>
                <Input id="secondaryColor" defaultValue="#0EA5E9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accentColor">Accent Color</Label>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-amber-500"></div>
                <Input id="accentColor" defaultValue="#F97316" />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {userRole === 'superAdmin' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">White Label Management</h3>
            <div className="border rounded-md">
              <div className="grid grid-cols-4 font-medium p-3 border-b">
                <div>Company</div>
                <div>Domain</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="grid grid-cols-4 p-3 border-b items-center">
                <div>Agency Partners</div>
                <div>app.agencypartners.com</div>
                <div><Badge variant="outline" className="bg-green-100">Active</Badge></div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm" className="text-red-500">Deactivate</Button>
                </div>
              </div>
              <div className="grid grid-cols-4 p-3 border-b items-center">
                <div>BrandMasters</div>
                <div>app.brandmasters.io</div>
                <div><Badge variant="outline" className="bg-green-100">Active</Badge></div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm" className="text-red-500">Deactivate</Button>
                </div>
              </div>
            </div>
            <Button variant="outline">+ Add White Label</Button>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const BillingSettings: React.FC<SettingsSectionProps> = ({ userRole, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing & Subscription</CardTitle>
        <CardDescription>
          Manage your payment methods and subscription plan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Current Plan</h3>
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-lg">
                  {userRole === 'superAdmin' ? 'Enterprise Plan' : 
                   userRole === 'whiteLabel' ? 'Agency Pro' : 'Business Plan'}
                </h4>
                <p className="text-muted-foreground">
                  {userRole === 'superAdmin' ? 'Unlimited everything' : 
                   userRole === 'whiteLabel' ? '50 accounts, unlimited users' : '25 users, 10 social accounts'}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-md p-4 space-y-2">
              <h4 className="font-medium">Users</h4>
              <div className="flex items-center justify-between">
                <span>45</span>
                <span className="text-sm text-muted-foreground">/ 50</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            <div className="border rounded-md p-4 space-y-2">
              <h4 className="font-medium">Social Accounts</h4>
              <div className="flex items-center justify-between">
                <span>20</span>
                <span className="text-sm text-muted-foreground">/ 25</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div className="border rounded-md p-4 space-y-2">
              <h4 className="font-medium">Storage</h4>
              <div className="flex items-center justify-between">
                <span>15 GB</span>
                <span className="text-sm text-muted-foreground">/ 50 GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Payment Methods</h3>
          <div className="border rounded-md">
            <div className="grid grid-cols-4 p-3 border-b items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-6 bg-blue-500 rounded"></div>
                <span>Visa ending in 4242</span>
              </div>
              <div>John Doe</div>
              <div>Expires 12/25</div>
              <div className="flex space-x-2">
                <Badge variant="outline">Default</Badge>
                <Button variant="ghost" size="sm">Edit</Button>
                <Button variant="ghost" size="sm" className="text-red-500">Remove</Button>
              </div>
            </div>
          </div>
          <Button variant="outline">+ Add Payment Method</Button>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Billing History</h3>
          <div className="border rounded-md">
            <div className="grid grid-cols-4 font-medium p-3 border-b">
              <div>Date</div>
              <div>Description</div>
              <div>Amount</div>
              <div>Status</div>
            </div>
            <div className="grid grid-cols-4 p-3 border-b items-center">
              <div>Mar 1, 2025</div>
              <div>Monthly Subscription</div>
              <div>$199.00</div>
              <div><Badge variant="outline" className="bg-green-100">Paid</Badge></div>
            </div>
            <div className="grid grid-cols-4 p-3 border-b items-center">
              <div>Feb 1, 2025</div>
              <div>Monthly Subscription</div>
              <div>$199.00</div>
              <div><Badge variant="outline" className="bg-green-100">Paid</Badge></div>
            </div>
            <div className="grid grid-cols-4 p-3 items-center">
              <div>Jan 1, 2025</div>
              <div>Monthly Subscription</div>
              <div>$199.00</div>
              <div><Badge variant="outline" className="bg-green-100">Paid</Badge></div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AppearanceSettings: React.FC<SettingsSectionProps> = ({ onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize the look and feel of your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Theme</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer bg-background">
              <div className="w-full h-24 bg-white rounded border"></div>
              <span>Light</span>
            </div>
            <div className="border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer">
              <div className="w-full h-24 bg-gray-900 rounded border"></div>
              <span>Dark</span>
            </div>
            <div className="border rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer">
              <div className="w-full h-24 bg-gradient-to-b from-white to-gray-900 rounded border"></div>
              <span>System</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Custom Colors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-purple-500"></div>
                <Input id="primaryColor" defaultValue="#8B5CF6" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Secondary Color</Label>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-400"></div>
                <Input id="secondaryColor" defaultValue="#0EA5E9" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="backgroundLight">Background (Light)</Label>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gray-50"></div>
                <Input id="backgroundLight" defaultValue="#F9FAFB" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="backgroundDark">Background (Dark)</Label>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gray-900"></div>
                <Input id="backgroundDark" defaultValue="#1A1F2C" />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Layout Preferences</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="condensed-view" />
              <Label htmlFor="condensed-view">Condensed view</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Use a more compact layout with reduced padding and spacing
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="show-sidebar" defaultChecked />
              <Label htmlFor="show-sidebar">Show sidebar by default</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Content Density</Label>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">Comfortable</Button>
              <Button variant="outline" className="flex-1 bg-gray-100">Compact</Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AnalyticsSettings: React.FC<SettingsSectionProps> = ({ userRole, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Settings</CardTitle>
        <CardDescription>
          Configure analytics preferences and tracking options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Data Collection</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="enable-analytics" defaultChecked />
              <Label htmlFor="enable-analytics">Enable Analytics Collection</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Allows the platform to collect usage data to improve your experience
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="performance-tracking" defaultChecked />
              <Label htmlFor="performance-tracking">Track Content Performance</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Collects data about how your content performs across platforms
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="audience-tracking" defaultChecked />
              <Label htmlFor="audience-tracking">Track Audience Insights</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Collects demographic and behavior data about your audience
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Reporting</h3>
          <div className="space-y-2">
            <Label htmlFor="default-date-range">Default Date Range</Label>
            <Input id="default-date-range" defaultValue="Last 30 days" />
          </div>

          <div className="space-y-2">
            <Label>Email Reports</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="weekly-report" defaultChecked />
                <Label htmlFor="weekly-report">Weekly Performance Report</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="monthly-report" defaultChecked />
                <Label htmlFor="monthly-report">Monthly Performance Report</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="custom-report" />
                <Label htmlFor="custom-report">Custom Reports</Label>
              </div>
            </div>
          </div>
        </div>

        {(userRole === 'superAdmin' || userRole === 'whiteLabel') && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Advanced Analytics</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="cross-account-analytics" defaultChecked />
                  <Label htmlFor="cross-account-analytics">Enable Cross-Account Analytics</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Analyze data across multiple accounts for comparative insights
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="data-export" defaultChecked />
                  <Label htmlFor="data-export">Enable Data Export</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Allow exporting analytics data to CSV or Excel format
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retention-period">Data Retention Period</Label>
                <Input id="retention-period" defaultValue="12 months" />
                <p className="text-sm text-muted-foreground">
                  How long analytics data is stored before being deleted
                </p>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end">
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const GlobalSettings: React.FC<{ onSave?: () => void }> = ({ onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Settings</CardTitle>
        <CardDescription>
          Configure system-wide parameters and limitations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">System Limits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-users">Maximum Users Per Account</Label>
              <Input id="max-users" type="number" defaultValue="100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-social-accounts">Maximum Social Accounts Per User</Label>
              <Input id="max-social-accounts" type="number" defaultValue="25" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-storage">Maximum Storage (GB)</Label>
              <Input id="max-storage" type="number" defaultValue="50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-api-calls">API Rate Limit (calls/min)</Label>
              <Input id="max-api-calls" type="number" defaultValue="100" />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Default Settings</h3>
          <div className="space-y-2">
            <Label htmlFor="default-timezone">Default Timezone</Label>
            <Input id="default-timezone" defaultValue="UTC" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="default-language">Default Language</Label>
            <Input id="default-language" defaultValue="English" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="require-2fa" />
              <Label htmlFor="require-2fa">Require 2FA for all admin accounts</Label>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Feature Toggles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="enable-ai-features" defaultChecked />
                <Label htmlFor="enable-ai-features">AI Features</Label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="enable-white-label" defaultChecked />
                <Label htmlFor="enable-white-label">White Labeling</Label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="enable-multi-platform" defaultChecked />
                <Label htmlFor="enable-multi-platform">Multi-Platform Support</Label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="enable-advanced-analytics" defaultChecked />
                <Label htmlFor="enable-advanced-analytics">Advanced Analytics</Label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SecuritySettings: React.FC<SettingsSectionProps> = ({ userRole, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Manage security preferences and access controls
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Authentication</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="enable-2fa" />
              <Label htmlFor="enable-2fa">Enable Two-Factor Authentication</Label>
            </div>
            <Button variant="outline" className="mt-2">Set up 2FA</Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
            <Input id="session-timeout" type="number" defaultValue="30" />
            <p className="text-sm text-muted-foreground">
              How long until an inactive session is automatically logged out
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Password Requirements</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="require-uppercase" defaultChecked />
              <Label htmlFor="require-uppercase">Require uppercase letters</Label>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="require-number" defaultChecked />
              <Label htmlFor="require-number">Require numbers</Label>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="require-special" defaultChecked />
              <Label htmlFor="require-special">Require special characters</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="min-length">Minimum password length</Label>
            <Input id="min-length" type="number" defaultValue="12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-expiry">Password expiry (days)</Label>
            <Input id="password-expiry" type="number" defaultValue="90" />
            <p className="text-sm text-muted-foreground">
              How often users are required to change their password. Set to 0 to disable.
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Login Security</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="ip-restriction" />
              <Label htmlFor="ip-restriction">IP Address Restrictions</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Limit login attempts to specific IP ranges
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-attempts">Maximum login attempts before lockout</Label>
            <Input id="max-attempts" type="number" defaultValue="5" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lockout-time">Account lockout duration (minutes)</Label>
            <Input id="lockout-time" type="number" defaultValue="30" />
          </div>
        </div>

        {(userRole === 'superAdmin' || userRole === 'whiteLabel' || userRole === 'admin') && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Security Logs</h3>
              <div className="border rounded-md">
                <div className="grid grid-cols-4 font-medium p-3 border-b">
                  <div>Date & Time</div>
                  <div>User</div>
                  <div>Activity</div>
                  <div>IP Address</div>
                </div>
                <div className="grid grid-cols-4 p-3 border-b">
                  <div>Apr 12, 2025 14:32</div>
                  <div>admin@example.com</div>
                  <div>Login successful</div>
                  <div>192.168.1.1</div>
                </div>
                <div className="grid grid-cols-4 p-3 border-b">
                  <div>Apr 11, 2025 09:15</div>
                  <div>user@example.com</div>
                  <div>Password changed</div>
                  <div>192.168.1.2</div>
                </div>
                <div className="grid grid-cols-4 p-3">
                  <div>Apr 10, 2025 17:45</div>
                  <div>admin@example.com</div>
                  <div>User created</div>
                  <div>192.168.1.1</div>
                </div>
              </div>
              <Button variant="outline">Export Security Logs</Button>
            </div>
          </>
        )}

        <div className="flex justify-end">
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SocialAccountsSettings: React.FC<SettingsSectionProps> = ({ onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Accounts</CardTitle>
        <CardDescription>
          Manage connected social media accounts and permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Connected Accounts</h3>
          <div className="border rounded-md">
            <div className="grid grid-cols-4 font-medium p-3 border-b">
              <div>Platform</div>
              <div>Account</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            <div className="grid grid-cols-4 p-3 border-b items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                <span>Facebook</span>
              </div>
              <div>Acme Corporation</div>
              <div><Badge variant="outline" className="bg-green-100">Connected</Badge></div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">Refresh</Button>
                <Button variant="ghost" size="sm" className="text-red-500">Disconnect</Button>
              </div>
            </div>
            <div className="grid grid-cols-4 p-3 border-b items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-sky-400 rounded-full"></div>
                <span>Twitter</span>
              </div>
              <div>@AcmeCorp</div>
              <div><Badge variant="outline" className="bg-green-100">Connected</Badge></div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">Refresh</Button>
                <Button variant="ghost" size="sm" className="text-red-500">Disconnect</Button>
              </div>
            </div>
            <div className="grid grid-cols-4 p-3 border-b items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-pink-500 rounded-full"></div>
                <span>Instagram</span>
              </div>
              <div>@acme_corporation</div>
              <div><Badge variant="outline" className="bg-yellow-100">Expired</Badge></div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">Reconnect</Button>
                <Button variant="ghost" size="sm" className="text-red-500">Disconnect</Button>
              </div>
            </div>
            <div className="grid grid-cols-4 p-3 items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                <span>LinkedIn</span>
              </div>
              <div>Acme Corp. Official</div>
              <div><Badge variant="outline" className="bg-green-100">Connected</Badge></div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">Refresh</Button>
                <Button variant="ghost" size="sm" className="text-red-500">Disconnect</Button>
              </div>
            </div>
          </div>
          <Button variant="outline">+ Connect New Account</Button>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Default Permissions</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="read-posts" defaultChecked />
              <Label htmlFor="read-posts">Read posts and comments</Label>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="publish-posts" defaultChecked />
              <Label htmlFor="publish-posts">Publish posts</Label>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="manage-comments" defaultChecked />
              <Label htmlFor="manage-comments">Manage comments and messages</Label>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="analytics-access" defaultChecked />
              <Label htmlFor="analytics-access">Access analytics data</Label>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="manage-ads" />
              <Label htmlFor="manage-ads">Manage ad campaigns</Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const NotificationSettings: React.FC<SettingsSectionProps> = ({ onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Manage how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Email Notifications</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="email-comments" defaultChecked />
              <Label htmlFor="email-comments">Comments on your posts</Label>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="email-messages" defaultChecked />
              <Label htmlFor="email-messages">Direct messages</Label>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="email-mentions" defaultChecked />
              <Label htmlFor="email-mentions">Mentions and tags</Label>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="email-reports" defaultChecked />
              <Label htmlFor="email-reports">Weekly and monthly reports</Label>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="email-updates" defaultChecked />
              <Label htmlFor="email-updates">Product updates and news</Label>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">In-App Notifications</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="inapp-comments" defaultChecked />
              <Label htmlFor="inapp-comments">Comments on your posts</Label>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="inapp-messages" defaultChecked />
              <Label htmlFor="inapp-messages">Direct messages</Label>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="inapp-mentions" defaultChecked />
              <Label htmlFor="inapp-mentions">Mentions and tags</Label>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="inapp-scheduled" defaultChecked />
              <Label htmlFor="inapp-scheduled">Scheduled post reminders</Label>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="inapp-activity" defaultChecked />
              <Label htmlFor="inapp-activity">Account activity alerts</Label>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Mobile Notifications</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="mobile-push" defaultChecked />
              <Label htmlFor="mobile-push">Enable push notifications</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quiet-hours">Quiet Hours</Label>
            <div className="grid grid-cols-2 gap-4">
              <Input id="quiet-from" type="time" defaultValue="22:00" />
              <Input id="quiet-to" type="time" defaultValue="07:00" />
            </div>
            <p className="text-sm text-muted-foreground">
              During quiet hours, only critical notifications will be delivered
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SupportSettings: React.FC<SettingsSectionProps> = ({ userRole }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Support</CardTitle>
        <CardDescription>
          Get help and access support resources
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact Support</h3>
          <div className="space-y-2">
            <Label htmlFor="support-subject">Subject</Label>
            <Input id="support-subject" placeholder="Brief description of your issue" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="support-message">Message</Label>
            <textarea
              id="support-message"
              className="w-full min-h-[150px] rounded-md border border-input p-3 text-sm"
              placeholder="Describe your issue in detail"
            />
          </div>
          <Button>Submit Ticket</Button>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Knowledge Base</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Getting Started Guide
            </Button>
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Social Media Best Practices
            </Button>
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Platform Features
            </Button>
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              FAQ
            </Button>
          </div>
        </div>

        {(userRole === 'superAdmin' || userRole === 'whiteLabel') && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Priority Support</h3>
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Headphones className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Dedicated Support Available
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        As a {userRole}, you have access to priority support with a dedicated account manager. Contact your account manager directly:
                      </p>
                      <p className="mt-2">
                        <strong>Email:</strong> dedicated@example.com<br />
                        <strong>Phone:</strong> +1 (555) 123-4567
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const ApiKeysSettings: React.FC<SettingsSectionProps> = ({ userRole, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>
          Manage API keys for external integrations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Your API Keys</h3>
          <div className="border rounded-md">
            <div className="grid grid-cols-4 font-medium p-3 border-b">
              <div>Name</div>
              <div>Key</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            <div className="grid grid-cols-4 p-3 border-b items-center">
              <div>Production Key</div>
              <div className="flex items-center">
                <span>•••••••••••••••••••</span>
                <Button variant="ghost" size="sm">Show</Button>
              </div>
              <div><Badge variant="outline" className="bg-green-100">Active</Badge></div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">Regenerate</Button>
                <Button variant="ghost" size="sm" className="text-red-500">Revoke</Button>
              </div>
            </div>
            <div className="grid grid-cols-4 p-3 items-center">
              <div>Development Key</div>
              <div className="flex items-center">
                <span>•••••••••••••••••••</span>
                <Button variant="ghost" size="sm">Show</Button>
              </div>
              <div><Badge variant="outline" className="bg-green-100">Active</Badge></div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">Regenerate</Button>
                <Button variant="ghost" size="sm" className="text-red-500">Revoke</Button>
              </div>
            </div>
          </div>
          <Button variant="outline">+ Generate New API Key</Button>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">API Access</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="enable-api" defaultChecked />
              <Label htmlFor="enable-api">Enable API Access</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Allows external applications to connect to your account via the API
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate-limit">API Rate Limit (requests per minute)</Label>
            <Input id="rate-limit" type="number" defaultValue="60" />
          </div>

          <div className="space-y-2">
            <Label>IP Whitelist</Label>
            <Input placeholder="Add IP addresses (comma separated)" />
            <p className="text-sm text-muted-foreground">
              Only allow API access from specific IP addresses
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Webhook Settings</h3>
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input id="webhook-url" placeholder="https://your-server.com/webhook" />
          </div>

          <div className="space-y-2">
            <Label>Webhook Events</Label>
            <div className="flex items-center space-x-2">
              <Switch id="event-post" defaultChecked />
              <Label htmlFor="event-post">Post published</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="event-comment" defaultChecked />
              <Label htmlFor="event-comment">Comment received</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="event-message" defaultChecked />
              <Label htmlFor="event-message">Message received</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="event-mention" />
              <Label htmlFor="event-mention">Account mentioned</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Webhook Secret</Label>
            <div className="flex items-center gap-2">
              <Input type="password" value="••••••••••••••••" readOnly />
              <Button variant="outline">Regenerate</Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Use this secret to verify webhook requests
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ChatbotSettings: React.FC<SettingsSectionProps> = ({ userRole, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chatbot Settings</CardTitle>
        <CardDescription>
          Configure the AI chatbot assistant
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">General Settings</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="enable-chatbot" defaultChecked />
              <Label htmlFor="enable-chatbot">Enable Chatbot</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Show the AI assistant in the dashboard
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chatbot-name">Chatbot Name</Label>
            <Input id="chatbot-name" defaultValue="Acme Assistant" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="greeting-message">Greeting Message</Label>
            <Input id="greeting-message" defaultValue="Hi there! How can I help you today?" />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">AI Configuration</h3>
          <div className="space-y-2">
            <Label htmlFor="model-selection">AI Model</Label>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1 bg-gray-100">Standard</Button>
              <Button variant="outline" className="flex-1">Advanced</Button>
              <Button variant="outline" className="flex-1">Custom</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language-pref">Language Preference</Label>
            <Input id="language-pref" defaultValue="English" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="voice-support" defaultChecked />
              <Label htmlFor="voice-support">Voice Support</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Allow voice commands and responses
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="context-memory" defaultChecked />
              <Label htmlFor="context-memory">Conversational Memory</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Remember conversation context for more natural responses
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Knowledge Base</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch id="use-kb" defaultChecked />
              <Label htmlFor="use-kb">Use Custom Knowledge Base</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Train the chatbot with your organization's specific information
            </p>
          </div>

          <div className="border rounded-md p-4">
            <h4 className="font-medium mb-2">Knowledge Sources</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="kb-docs" defaultChecked />
                <Label htmlFor="kb-docs">Company Documentation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="kb-faqs" defaultChecked />
                <Label htmlFor="kb-faqs">FAQs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="kb-guides" defaultChecked />
                <Label htmlFor="kb-guides">Product Guides</Label>
              </div>
            </div>
            <Button variant="outline" className="mt-4">Upload Documents</Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const IntegrationsSettings: React.FC<SettingsSectionProps> = ({ userRole, onSave }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>
          Manage connections with external services and tools
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Social Platforms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                <span>Facebook</span>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
            <div className="border rounded-md p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
                <span>Twitter/X</span>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
            <div className="border rounded-md p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-pink-500 rounded-full"></div>
                <span>Instagram</span>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
            <div className="border rounded-md p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-700 rounded-full"></div>
                <span>LinkedIn</span>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Business Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                <div>
                  <div>Google Analytics</div>
                  <div className="text-sm text-muted-foreground">Track website traffic</div>
                </div>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
            <div className="border rounded-md p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
                <div>
                  <div>Salesforce</div>
                  <div className="text-sm text-muted-foreground">CRM integration</div>
                </div>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
            <div className="border rounded-md p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-500 rounded-full"></div>
                <div>
                  <div>Shopify</div>
                  <div className="text-sm text-muted-foreground">E-commerce platform</div>
                </div>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
            <div className="border rounded-md p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
                <div>
                  <div>Slack</div>
                  <div className="text-sm text-muted-foreground">Team communication</div>
                </div>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Calendar & Scheduling</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-md p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
                <span>Google Calendar</span>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
            <div className="border rounded-md p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-700 rounded-full"></div>
                <span>Microsoft Outlook</span>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
          </div>
        </div>

        {(userRole === 'superAdmin' || userRole === 'whiteLabel' || userRole === 'admin') && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Advanced Integrations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-600 rounded-full"></div>
                    <div>
                      <div>Zapier</div>
                      <div className="text-sm text-muted-foreground">Workflow automation</div>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
                <div className="border rounded-md p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full"></div>
                    <div>
                      <div>Segment</div>
                      <div className="text-sm text-muted-foreground">Customer data platform</div>
                    </div>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-webhook">Custom Webhook URL</Label>
                <Input id="custom-webhook" placeholder="https://your-service.com/webhook" />
                <p className="text-sm text-muted-foreground">
                  Connect to custom services via webhook
                </p>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end">
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Settings;
