
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, AlertTriangle, LockKeyhole, Laptop, Smartphone, LogOut } from "lucide-react";

interface SecuritySettingsProps {
  role: string;
}

// Mock data for active sessions
const mockSessions = [
  {
    id: "1",
    device: "Chrome on Windows",
    location: "New York, USA",
    ip: "192.168.1.1",
    lastActive: "Active now",
    isCurrent: true,
  },
  {
    id: "2",
    device: "Safari on macOS",
    location: "San Francisco, USA",
    ip: "192.168.1.2",
    lastActive: "2 days ago",
    isCurrent: false,
  },
  {
    id: "3",
    device: "Mobile App on iPhone",
    location: "Toronto, Canada",
    ip: "192.168.1.3",
    lastActive: "1 week ago",
    isCurrent: false,
  }
];

// Mock data for login history
const mockLoginHistory = [
  {
    id: "1",
    timestamp: "2023-05-01 09:30:45",
    device: "Chrome on Windows",
    location: "New York, USA",
    ip: "192.168.1.1",
    status: "Success",
  },
  {
    id: "2",
    timestamp: "2023-04-29 14:22:10",
    device: "Safari on macOS",
    location: "San Francisco, USA",
    ip: "192.168.1.2",
    status: "Success",
  },
  {
    id: "3",
    timestamp: "2023-04-28 08:15:32",
    device: "Firefox on Windows",
    location: "London, UK",
    ip: "192.168.1.4",
    status: "Failed",
  },
];

export function SecuritySettings({ role }: SecuritySettingsProps) {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Security settings saved",
      description: "Your security settings have been updated successfully.",
    });
  };

  const handleLogout = (sessionId: string) => {
    toast({
      title: "Session terminated",
      description: "The selected session has been logged out.",
    });
  };

  const handleEnableTwoFactor = () => {
    toast({
      title: "Two-factor authentication",
      description: "Setup wizard will be available soon.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Security Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage security preferences and account access.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" /> Authentication Settings
          </CardTitle>
          <CardDescription>
            Configure authentication methods and security requirements.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="two-factor" className="flex flex-col space-y-1">
              <span>Two-Factor Authentication</span>
              <span className="font-normal text-sm text-muted-foreground">
                Require a second form of authentication when signing in.
              </span>
            </Label>
            <Switch
              id="two-factor"
              defaultChecked={false}
              onCheckedChange={handleEnableTwoFactor}
            />
          </div>
          
          {role === "Super Admin" && (
            <>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="force-two-factor" className="flex flex-col space-y-1">
                  <span>Require Two-Factor for All Users</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Force all users to enable two-factor authentication.
                  </span>
                </Label>
                <Switch
                  id="force-two-factor"
                  defaultChecked={false}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password-policy">Password Policy</Label>
                <Select defaultValue="strong">
                  <SelectTrigger id="password-policy">
                    <SelectValue placeholder="Select password policy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                    <SelectItem value="moderate">Moderate (8+ chars, mixed case)</SelectItem>
                    <SelectItem value="strong">Strong (8+ chars, mixed case, numbers, symbols)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password-expiry">Password Expiry</Label>
                <Select defaultValue="90">
                  <SelectTrigger id="password-expiry">
                    <SelectValue placeholder="Select password expiry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-login-attempts">Maximum Login Attempts</Label>
                <Input
                  id="max-login-attempts"
                  type="number"
                  defaultValue="5"
                />
                <p className="text-xs text-muted-foreground">
                  Number of failed login attempts before account lockout.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lockout-duration">Account Lockout Duration (minutes)</Label>
                <Input
                  id="lockout-duration"
                  type="number"
                  defaultValue="30"
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Authentication Settings</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LockKeyhole className="h-5 w-5" /> Session Management
          </CardTitle>
          <CardDescription>
            View and manage your active sessions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {session.device.includes("Mobile") ? (
                      <Smartphone className="h-4 w-4" />
                    ) : (
                      <Laptop className="h-4 w-4" />
                    )}
                    {session.device}
                    {session.isCurrent && (
                      <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                        Current
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{session.location}</TableCell>
                  <TableCell>{session.ip}</TableCell>
                  <TableCell>{session.lastActive}</TableCell>
                  <TableCell className="text-right">
                    {!session.isCurrent && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLogout(session.id)}
                      >
                        <LogOut className="mr-2 h-3 w-3" /> Logout
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="flex items-center justify-between space-x-2 mt-4">
            <Label htmlFor="session-timeout" className="flex flex-col space-y-1">
              <span>Session Timeout</span>
              <span className="font-normal text-sm text-muted-foreground">
                Automatically log out inactive sessions.
              </span>
            </Label>
            <div className="w-32">
              <Select defaultValue="60">
                <SelectTrigger id="session-timeout">
                  <SelectValue placeholder="Select timeout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                  <SelectItem value="480">8 hours</SelectItem>
                  <SelectItem value="720">12 hours</SelectItem>
                  <SelectItem value="1440">24 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="destructive"
            onClick={() => {
              toast({
                title: "All sessions terminated",
                description: "You have been logged out of all other devices.",
              });
            }}
          >
            Logout All Other Sessions
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" /> Login History
          </CardTitle>
          <CardDescription>
            Review recent login activity on your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLoginHistory.map((login) => (
                <TableRow key={login.id}>
                  <TableCell>{login.timestamp}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    {login.device.includes("Mobile") ? (
                      <Smartphone className="h-4 w-4" />
                    ) : (
                      <Laptop className="h-4 w-4" />
                    )}
                    {login.device}
                  </TableCell>
                  <TableCell>{login.location}</TableCell>
                  <TableCell>{login.ip}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        login.status === "Success"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {login.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button variant="outline">
            View Full History
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
