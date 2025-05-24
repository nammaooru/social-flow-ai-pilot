
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MoreHorizontal, Plus, Search, Users as UsersIcon } from "lucide-react";
import { CommonSettingsProps } from "@/pages/Settings";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
  lastActive: string;
}

interface UsersSettingsProps extends CommonSettingsProps {
  // No need to redefine role as it's already in CommonSettingsProps with the correct type
}

export function UsersSettings({ role, onSettingChange }: UsersSettingsProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("user");
  
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      status: "Active",
      lastActive: "2 hours ago"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Editor",
      status: "Active",
      lastActive: "1 day ago"
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "Viewer",
      status: "Inactive",
      lastActive: "1 week ago"
    }
  ]);
  
  const handleInviteUser = () => {
    if (!newUserEmail) return;
    
    const newUser: User = {
      id: Date.now().toString(),
      name: newUserEmail.split('@')[0],
      email: newUserEmail,
      role: newUserRole,
      status: "Pending",
      lastActive: "Never"
    };
    
    setUsers(prev => [...prev, newUser]);
    setNewUserEmail("");
    setNewUserRole("user");
    setIsInviteDialogOpen(false);
    
    toast({
      title: "User invited",
      description: `Invitation sent to ${newUserEmail}`,
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Users</h3>
        <p className="text-sm text-muted-foreground">
          Manage user access and permissions for your organization.
        </p>
        {role && <Badge variant="outline" className="mt-2">Current role: {role}</Badge>}
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5" />
                Team Members
              </CardTitle>
              <CardDescription>Invite and manage your team members</CardDescription>
            </div>
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Invite User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite New User</DialogTitle>
                  <DialogDescription>
                    Send an invitation to a new team member
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={newUserRole} onValueChange={setNewUserRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleInviteUser}>Send Invitation</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={user.status === "Active" ? "default" : user.status === "Pending" ? "secondary" : "outline"}>
                      {user.status}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium">{user.role}</p>
                      <p className="text-xs text-muted-foreground">Last active: {user.lastActive}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
