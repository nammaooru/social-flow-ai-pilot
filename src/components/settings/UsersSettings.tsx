
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
import { MoreHorizontal, Plus, Search, Users as UsersIcon, Edit, Trash2, UserPlus, Shield, Crown, Upload } from "lucide-react";
import { CommonSettingsProps } from "@/pages/Settings";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "White Label" | "Admin" | "User";
  status: "Active" | "Inactive" | "Pending";
  avatar?: string;
  company?: string;
  address?: string;
  phone?: string;
  lastActive: string;
  createdAt: string;
  permissions?: string[];
}

interface UsersSettingsProps extends CommonSettingsProps {
  // No need to redefine role as it's already in CommonSettingsProps with the correct type
}

export function UsersSettings({ role, onSettingChange }: UsersSettingsProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Admin" as User["role"],
    company: "",
    address: "",
    phone: "",
    avatar: ""
  });
  
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "System Administrator",
      email: "admin@company.com",
      role: "Super Admin",
      status: "Active",
      company: "Tech Corp",
      address: "123 Main St, New York, NY 10001",
      phone: "+1 (555) 123-4567",
      lastActive: "2 hours ago",
      createdAt: "2024-01-01",
      permissions: ["all"]
    },
    {
      id: "2",
      name: "Brand Manager",
      email: "brand@company.com",
      role: "White Label",
      status: "Active",
      company: "Brand Solutions Inc",
      address: "456 Business Ave, Los Angeles, CA 90210",
      phone: "+1 (555) 987-6543",
      lastActive: "1 day ago",
      createdAt: "2024-01-15",
      permissions: ["branding", "users", "settings"]
    },
    {
      id: "3",
      name: "Content Admin",
      email: "content@company.com",
      role: "Admin",
      status: "Active",
      company: "Content Masters LLC",
      address: "789 Creative Blvd, Chicago, IL 60601",
      phone: "+1 (555) 456-7890",
      lastActive: "3 hours ago",
      createdAt: "2024-02-01",
      permissions: ["content", "analytics", "support"]
    },
    {
      id: "4",
      name: "Marketing Admin",
      email: "marketing@company.com",
      role: "Admin",
      status: "Inactive",
      company: "Marketing Pro",
      address: "321 Strategy St, Miami, FL 33101",
      phone: "+1 (555) 321-0987",
      lastActive: "1 week ago",
      createdAt: "2024-01-20",
      permissions: ["content", "analytics"]
    }
  ]);
  
  // Determine what roles the current user can manage
  const getManageableRoles = (): User["role"][] => {
    if (role === "Super Admin") {
      return ["White Label", "Admin"];
    } else if (role === "White Label") {
      return ["Admin"];
    }
    return [];
  };
  
  // Filter users based on current role permissions
  const getVisibleUsers = () => {
    if (role === "Super Admin") {
      return users; // Can see all users
    } else if (role === "White Label") {
      return users.filter(user => user.role !== "Super Admin"); // Can't see Super Admin
    }
    return users.filter(user => user.role === "User"); // Other roles see only regular users
  };
  
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const manageableRoles = getManageableRoles();
    if (!manageableRoles.includes(newUser.role)) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to create users with this role.",
        variant: "destructive"
      });
      return;
    }
    
    const createdUser: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "Pending",
      company: newUser.company,
      address: newUser.address,
      phone: newUser.phone,
      avatar: newUser.avatar,
      lastActive: "Never",
      createdAt: new Date().toISOString().split('T')[0],
      permissions: []
    };
    
    setUsers(prev => [...prev, createdUser]);
    setNewUser({ name: "", email: "", role: "Admin", company: "", address: "", phone: "", avatar: "" });
    setIsAddUserDialogOpen(false);
    
    toast({
      title: "User created",
      description: `${createdUser.name} has been added successfully.`,
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  const handleEditUser = () => {
    if (!selectedUser) return;
    
    const manageableRoles = getManageableRoles();
    if (!manageableRoles.includes(selectedUser.role)) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to edit this user.",
        variant: "destructive"
      });
      return;
    }
    
    setUsers(prev => prev.map(user => 
      user.id === selectedUser.id ? selectedUser : user
    ));
    
    setIsEditUserDialogOpen(false);
    setSelectedUser(null);
    
    toast({
      title: "User updated",
      description: "User information has been updated successfully.",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    const manageableRoles = getManageableRoles();
    if (!manageableRoles.includes(selectedUser.role)) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to delete this user.",
        variant: "destructive"
      });
      return;
    }
    
    setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
    setIsDeleteUserDialogOpen(false);
    setSelectedUser(null);
    
    toast({
      title: "User deleted",
      description: "User has been removed successfully.",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  const openEditDialog = (user: User) => {
    setSelectedUser({ ...user });
    setIsEditUserDialogOpen(true);
  };
  
  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserDialogOpen(true);
  };
  
  const handleUserNameClick = (user: User) => {
    const manageableRoles = getManageableRoles();
    if (manageableRoles.includes(user.role)) {
      openEditDialog(user);
    }
  };
  
  const filteredUsers = getVisibleUsers().filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const getRoleIcon = (userRole: User["role"]) => {
    switch (userRole) {
      case "Super Admin":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "White Label":
        return <Shield className="h-4 w-4 text-blue-500" />;
      case "Admin":
        return <Shield className="h-4 w-4 text-green-500" />;
      default:
        return <UsersIcon className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getRoleBadgeVariant = (userRole: User["role"]) => {
    switch (userRole) {
      case "Super Admin":
        return "default";
      case "White Label":
        return "secondary";
      case "Admin":
        return "outline";
      default:
        return "outline";
    }
  };
  
  const manageableRoles = getManageableRoles();
  const canManageUsers = manageableRoles.length > 0;
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Users Management</h3>
        <p className="text-sm text-muted-foreground">
          Manage user access, roles, and permissions for your organization.
        </p>
        {role && <Badge variant="outline" className="mt-2">Current role: {role}</Badge>}
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getVisibleUsers().length}</div>
            <p className="text-xs text-muted-foreground">active accounts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getVisibleUsers().filter(u => u.role === "Admin").length}
            </div>
            <p className="text-xs text-muted-foreground">admin users</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">White Label</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getVisibleUsers().filter(u => u.role === "White Label").length}
            </div>
            <p className="text-xs text-muted-foreground">brand managers</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getVisibleUsers().filter(u => u.status === "Pending").length}
            </div>
            <p className="text-xs text-muted-foreground">pending invites</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="h-5 w-5" />
                Team Members
              </CardTitle>
              <CardDescription>
                {canManageUsers 
                  ? `Manage users and their roles. You can manage: ${manageableRoles.join(", ")}`
                  : "View team members and their information"
                }
              </CardDescription>
            </div>
            {canManageUsers && (
              <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Create a new user account with detailed information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newUserAvatar">Avatar URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="newUserAvatar"
                          placeholder="https://example.com/avatar.jpg"
                          value={newUser.avatar}
                          onChange={(e) => setNewUser(prev => ({ ...prev, avatar: e.target.value }))}
                        />
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newUserName">Full Name *</Label>
                      <Input
                        id="newUserName"
                        placeholder="John Doe"
                        value={newUser.name}
                        onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newUserCompany">Company</Label>
                      <Input
                        id="newUserCompany"
                        placeholder="Company Name"
                        value={newUser.company}
                        onChange={(e) => setNewUser(prev => ({ ...prev, company: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newUserEmail">Email Address *</Label>
                      <Input
                        id="newUserEmail"
                        type="email"
                        placeholder="user@example.com"
                        value={newUser.email}
                        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="newUserAddress">Address</Label>
                      <Input
                        id="newUserAddress"
                        placeholder="123 Main St, City, State ZIP"
                        value={newUser.address}
                        onChange={(e) => setNewUser(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newUserPhone">Phone Number</Label>
                      <Input
                        id="newUserPhone"
                        placeholder="+1 (555) 123-4567"
                        value={newUser.phone}
                        onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newUserRole">Role *</Label>
                      <Select 
                        value={newUser.role} 
                        onValueChange={(value: User["role"]) => setNewUser(prev => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {manageableRoles.map(roleOption => (
                            <SelectItem key={roleOption} value={roleOption}>
                              <div className="flex items-center gap-2">
                                {getRoleIcon(roleOption)}
                                {roleOption}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddUser}>Create User</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, company, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="space-y-3">
              {filteredUsers.map((user) => {
                const canEditThisUser = manageableRoles.includes(user.role);
                
                return (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUserNameClick(user)}
                            className={`font-medium text-left hover:underline ${canEditThisUser ? 'text-blue-600 cursor-pointer' : 'cursor-default'}`}
                            disabled={!canEditThisUser}
                          >
                            {user.name}
                          </button>
                          {getRoleIcon(user.role)}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        {user.company && (
                          <p className="text-xs text-muted-foreground">{user.company}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Created: {user.createdAt} • Last active: {user.lastActive}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={user.status === "Active" ? "default" : user.status === "Pending" ? "secondary" : "outline"}
                      >
                        {user.status}
                      </Badge>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                      {canEditThisUser && (
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openEditDialog(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => openDeleteDialog(user)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {!canEditThisUser && (
                        <Button variant="ghost" size="sm" disabled>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No users found matching your search criteria.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User Details</DialogTitle>
            <DialogDescription>
              Update user information and settings
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editUserAvatar">Avatar URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="editUserAvatar"
                    placeholder="https://example.com/avatar.jpg"
                    value={selectedUser.avatar || ""}
                    onChange={(e) => setSelectedUser(prev => prev ? { ...prev, avatar: e.target.value } : null)}
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editUserName">Full Name</Label>
                <Input
                  id="editUserName"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editUserCompany">Company</Label>
                <Input
                  id="editUserCompany"
                  value={selectedUser.company || ""}
                  onChange={(e) => setSelectedUser(prev => prev ? { ...prev, company: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editUserEmail">Email Address</Label>
                <Input
                  id="editUserEmail"
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser(prev => prev ? { ...prev, email: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="editUserAddress">Address</Label>
                <Input
                  id="editUserAddress"
                  value={selectedUser.address || ""}
                  onChange={(e) => setSelectedUser(prev => prev ? { ...prev, address: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editUserPhone">Phone Number</Label>
                <Input
                  id="editUserPhone"
                  value={selectedUser.phone || ""}
                  onChange={(e) => setSelectedUser(prev => prev ? { ...prev, phone: e.target.value } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editUserRole">Role</Label>
                <Select 
                  value={selectedUser.role} 
                  onValueChange={(value: User["role"]) => 
                    setSelectedUser(prev => prev ? { ...prev, role: value } : null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {manageableRoles.map(roleOption => (
                      <SelectItem key={roleOption} value={roleOption}>
                        <div className="flex items-center gap-2">
                          {getRoleIcon(roleOption)}
                          {roleOption}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editUserStatus">Status</Label>
                <Select 
                  value={selectedUser.status} 
                  onValueChange={(value: User["status"]) => 
                    setSelectedUser(prev => prev ? { ...prev, status: value } : null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                <Avatar>
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback>{selectedUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  {selectedUser.company && (
                    <p className="text-xs text-muted-foreground">{selectedUser.company}</p>
                  )}
                  <Badge variant={getRoleBadgeVariant(selectedUser.role)} className="mt-1">
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
