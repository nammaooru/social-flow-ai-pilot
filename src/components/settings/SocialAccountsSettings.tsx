import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CommonSettingsProps } from "./SettingsComponentTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Plus, Edit, RefreshCw, Trash2 } from "lucide-react";

// Mock data for connected accounts
const mockAccounts = [
  {
    id: "1",
    name: "Company Facebook Page",
    platform: "facebook",
    status: "connected",
    icon: <Facebook className="h-5 w-5 text-blue-600" />,
    username: "companybrand",
    avatar: "/placeholder.svg",
    lastSync: "10 minutes ago"
  },
  {
    id: "2",
    name: "Marketing Twitter",
    platform: "twitter",
    status: "connected",
    icon: <Twitter className="h-5 w-5 text-blue-400" />,
    username: "@companybrand",
    avatar: "/placeholder.svg",
    lastSync: "1 hour ago"
  },
  {
    id: "3",
    name: "Company Instagram",
    platform: "instagram",
    status: "connected",
    icon: <Instagram className="h-5 w-5 text-pink-500" />,
    username: "@companybrand",
    avatar: "/placeholder.svg",
    lastSync: "3 hours ago"
  },
  {
    id: "4",
    name: "Company LinkedIn",
    platform: "linkedin",
    status: "error",
    icon: <Linkedin className="h-5 w-5 text-blue-700" />,
    username: "company-brand",
    avatar: "/placeholder.svg",
    lastSync: "Failed to sync"
  },
  {
    id: "5",
    name: "YouTube Channel",
    platform: "youtube",
    status: "connected",
    icon: <Youtube className="h-5 w-5 text-red-600" />,
    username: "CompanyBrand",
    avatar: "/placeholder.svg",
    lastSync: "1 day ago"
  }
];

interface SocialAccountsSettingsProps extends CommonSettingsProps {}

export function SocialAccountsSettings({ onSettingChange }: SocialAccountsSettingsProps) {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState(mockAccounts);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  
  const handleRefresh = (accountId: string) => {
    // Simulate refreshing the account
    toast({
      title: "Account refreshed",
      description: "The connection has been refreshed.",
    });
  };
  
  const handleDisconnect = (accountId: string) => {
    // In a real app, this would call an API to disconnect the account
    setAccounts(accounts.filter(account => account.id !== accountId));
    toast({
      title: "Account disconnected",
      description: "The social account has been disconnected.",
    });
  };
  
  const handleAddAccount = (platform: string) => {
    // In a real app, this would open OAuth flow for the selected platform
    toast({
      title: "Connecting account",
      description: `Redirecting to ${platform} for authorization.`,
    });
    setIsAddAccountOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Social Accounts</h3>
          <p className="text-sm text-muted-foreground">
            Manage your connected social media accounts.
          </p>
        </div>
        
        <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Connect Social Account</DialogTitle>
              <DialogDescription>
                Choose a platform to connect a new social account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <Button
                variant="outline"
                className="flex flex-col h-24 items-center justify-center gap-2"
                onClick={() => handleAddAccount("Facebook")}
              >
                <Facebook className="h-8 w-8 text-blue-600" />
                <span>Facebook</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col h-24 items-center justify-center gap-2"
                onClick={() => handleAddAccount("Twitter")}
              >
                <Twitter className="h-8 w-8 text-blue-400" />
                <span>Twitter</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col h-24 items-center justify-center gap-2"
                onClick={() => handleAddAccount("Instagram")}
              >
                <Instagram className="h-8 w-8 text-pink-500" />
                <span>Instagram</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col h-24 items-center justify-center gap-2"
                onClick={() => handleAddAccount("LinkedIn")}
              >
                <Linkedin className="h-8 w-8 text-blue-700" />
                <span>LinkedIn</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col h-24 items-center justify-center gap-2"
                onClick={() => handleAddAccount("YouTube")}
              >
                <Youtube className="h-8 w-8 text-red-600" />
                <span>YouTube</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col h-24 items-center justify-center gap-2"
                onClick={() => handleAddAccount("TikTok")}
              >
                <svg viewBox="0 0 24 24" className="h-8 w-8">
                  <path
                    d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
                    fill="currentColor"
                  />
                </svg>
                <span>TikTok</span>
              </Button>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddAccountOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No social accounts connected.
                    <br />
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsAddAccountOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Connect an Account
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                accounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={account.avatar} alt={account.name} />
                          <AvatarFallback>{account.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div>{account.name}</div>
                          <div className="text-xs text-muted-foreground">{account.username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {account.icon}
                        <span className="capitalize">{account.platform}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          account.status === "connected"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {account.status === "connected" ? "Connected" : "Error"}
                      </Badge>
                    </TableCell>
                    <TableCell>{account.lastSync}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleRefresh(account.id)}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDisconnect(account.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
          <CardDescription>
            Manage what actions SocialFlow can perform on your behalf.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Label className="flex flex-col p-4 border rounded-md space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="permission-read"
                  className="rounded border-gray-300"
                  defaultChecked
                />
                <span>Read Content</span>
              </div>
              <span className="text-xs text-muted-foreground pl-6">
                Access posts, analytics, and profile information.
              </span>
            </Label>
            
            <Label className="flex flex-col p-4 border rounded-md space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="permission-post"
                  className="rounded border-gray-300"
                  defaultChecked
                />
                <span>Post Content</span>
              </div>
              <span className="text-xs text-muted-foreground pl-6">
                Create and publish new content on your accounts.
              </span>
            </Label>
            
            <Label className="flex flex-col p-4 border rounded-md space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="permission-engage"
                  className="rounded border-gray-300"
                  defaultChecked
                />
                <span>Engage with Content</span>
              </div>
              <span className="text-xs text-muted-foreground pl-6">
                Like, comment, and respond to messages.
              </span>
            </Label>
            
            <Label className="flex flex-col p-4 border rounded-md space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="permission-analytics"
                  className="rounded border-gray-300"
                  defaultChecked
                />
                <span>Collect Analytics</span>
              </div>
              <span className="text-xs text-muted-foreground pl-6">
                Gather engagement and performance metrics.
              </span>
            </Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => {
            toast({
              title: "Permissions saved",
              description: "Your permission settings have been updated.",
            });
          }}>
            Save Permissions
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
