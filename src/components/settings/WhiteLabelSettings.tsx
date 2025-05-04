
import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadCloud, Search, Plus, Edit, Trash2 } from "lucide-react";

// Mock data for white label accounts
const mockWhitelabelAccounts = [
  { 
    id: "1", 
    name: "Agency Pro", 
    domain: "agencypro.com", 
    logo: "/placeholder.svg",
    status: "Active",
    clientCount: 12
  },
  { 
    id: "2", 
    name: "Digital Marketing Co", 
    domain: "digitalmarketing.co", 
    logo: "/placeholder.svg",
    status: "Active",
    clientCount: 8
  },
  { 
    id: "3", 
    name: "Social Media Experts", 
    domain: "socialmediaexperts.net", 
    logo: "/placeholder.svg",
    status: "Inactive",
    clientCount: 3
  },
];

// Add interface to accept onSettingChange prop
interface WhiteLabelSettingsProps {
  onSettingChange?: () => void;
}

export function WhiteLabelSettings({ onSettingChange }: WhiteLabelSettingsProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("appearance");
  const [searchQuery, setSearchQuery] = useState("");
  const [accounts, setAccounts] = useState(mockWhitelabelAccounts);
  
  // Filter accounts based on search query
  const filteredAccounts = accounts.filter(
    account => 
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to handle logo upload (in a real app, this would upload to a server)
  const handleLogoUpload = () => {
    // Simulate a file upload
    setTimeout(() => {
      toast({
        title: "Logo uploaded",
        description: "Your logo has been successfully uploaded.",
      });
      // Call onSettingChange if it exists
      if (onSettingChange) {
        onSettingChange();
      }
    }, 1500);
  };

  const handleDeleteAccount = (accountId: string) => {
    setAccounts(accounts.filter(account => account.id !== accountId));
    
    toast({
      title: "Account deleted",
      description: "The white label account has been successfully deleted.",
    });
    
    // Call onSettingChange if it exists
    if (onSettingChange) {
      onSettingChange();
    }
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your white label settings have been saved.",
    });
    
    // Call onSettingChange if it exists
    if (onSettingChange) {
      onSettingChange();
    }
  };

  const handleAddAccount = () => {
    toast({
      title: "Feature active",
      description: "Add new white label account functionality is now available.",
    });
    
    // Create a new account with mock data
    const newAccount = {
      id: `${accounts.length + 1}`,
      name: "New Agency",
      domain: "newagency.com",
      logo: "/placeholder.svg",
      status: "Active",
      clientCount: 0
    };
    
    setAccounts([...accounts, newAccount]);
    
    // Call onSettingChange if it exists
    if (onSettingChange) {
      onSettingChange();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">White Label Management</h3>
        <p className="text-sm text-muted-foreground">
          Configure white label settings and manage white label accounts.
        </p>
      </div>
      
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Identity</CardTitle>
              <CardDescription>
                Customize the appearance of your white labeled platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input 
                  id="platform-name" 
                  placeholder="Enter your platform name" 
                  defaultValue="SocialFlow"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="border rounded p-4 w-32 h-32 flex items-center justify-center">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src="/placeholder.svg" alt="Logo" />
                      <AvatarFallback>SF</AvatarFallback>
                    </Avatar>
                  </div>
                  <Button onClick={handleLogoUpload}>
                    <UploadCloud className="mr-2 h-4 w-4" /> Upload Logo
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex gap-2">
                  <Input 
                    id="primary-color" 
                    type="color" 
                    defaultValue="#3b82f6" 
                    className="w-16 h-10 p-1" 
                  />
                  <Input 
                    defaultValue="#3b82f6" 
                    className="w-32"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom-domain">Custom Domain</Label>
                <Input 
                  id="custom-domain" 
                  placeholder="app.yourdomain.com" 
                />
                <p className="text-xs text-muted-foreground">
                  Enter the domain where you want to host your white labeled platform.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="favicon">Favicon</Label>
                <div className="flex items-center gap-4">
                  <div className="border rounded p-2 w-12 h-12 flex items-center justify-center">
                    <img src="/favicon.ico" alt="Favicon" className="w-8 h-8" />
                  </div>
                  <Button variant="outline">
                    <UploadCloud className="mr-2 h-4 w-4" /> Upload Favicon
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Email Customization</CardTitle>
              <CardDescription>
                Customize the emails sent from your platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-from">Email From</Label>
                <Input 
                  id="email-from" 
                  placeholder="noreply@yourdomain.com" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-footer">Email Footer</Label>
                <Input 
                  id="email-footer" 
                  placeholder="Your company address and contact info" 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="accounts" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search accounts..." 
                className="pl-8 w-[300px]" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button onClick={handleAddAccount}>
              <Plus className="mr-2 h-4 w-4" /> Add Account
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Clients</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No accounts found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={account.logo} alt={account.name} />
                          <AvatarFallback>
                            {account.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{account.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{account.domain}</TableCell>
                    <TableCell>
                      <Badge
                        variant={account.status === "Active" ? "default" : "secondary"}
                        className={
                          account.status === "Active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }
                      >
                        {account.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{account.clientCount}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAccount(account.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
