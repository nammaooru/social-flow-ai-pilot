
import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { MoreHorizontal, Plus, Search, Users as UsersIcon, Edit, Trash2, UserPlus, Shield, Crown, Upload, X, Eye, EyeOff, Share, Copy } from "lucide-react";
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
  parentWhiteLabel?: string;
  username?: string;
  password?: string;
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
  const [isShareCredentialsDialogOpen, setIsShareCredentialsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [editAvatarPreview, setEditAvatarPreview] = useState<string>("");
  
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Admin" as User["role"],
    company: "",
    address: "",
    phone: "",
    avatar: "",
    parentWhiteLabel: "",
    username: "",
    password: ""
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
      permissions: ["all"],
      username: "sysadmin",
      password: "Admin123!"
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
      permissions: ["branding", "users", "settings"],
      username: "brandmgr",
      password: "Brand456@"
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
      permissions: ["content", "analytics", "support"],
      parentWhiteLabel: "2",
      username: "contentadmin",
      password: "Content789#"
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
      permissions: ["content", "analytics"],
      parentWhiteLabel: "2",
      username: "marketingadmin",
      password: "Market321$"
    }
  ]);
  
  // Handle avatar file selection for new user
  const handleAvatarSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (1MB = 1024 * 1024 bytes)
      if (file.size > 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Avatar image must be less than 1MB",
          variant: "destructive"
        });
        return;
      }
      
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        setNewUser(prev => ({ ...prev, avatar: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle avatar file selection for edit user
  const handleEditAvatarSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (1MB = 1024 * 1024 bytes)
      if (file.size > 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Avatar image must be less than 1MB",
          variant: "destructive"
        });
        return;
      }
      
      setEditAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditAvatarPreview(result);
        if (selectedUser) {
          setSelectedUser(prev => prev ? { ...prev, avatar: result } : null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove avatar preview
  const removeAvatarPreview = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    setNewUser(prev => ({ ...prev, avatar: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove edit avatar preview
  const removeEditAvatarPreview = () => {
    setEditAvatarFile(null);
    setEditAvatarPreview("");
    if (selectedUser) {
      setSelectedUser(prev => prev ? { ...prev, avatar: "" } : null);
    }
    if (editFileInputRef.current) {
      editFileInputRef.current.value = "";
    }
  };
  
  // Get White Label users for dropdown
  const getWhiteLabelUsers = () => {
    return users.filter(user => user.role === "White Label" && user.status === "Active");
  };
  
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
  
  // Generate random password
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUser(prev => ({ ...prev, password }));
  };

  // Generate username from name
  const generateUsername = (name: string) => {
    const username = name.toLowerCase().replace(/\s+/g, '').slice(0, 10);
    setNewUser(prev => ({ ...prev, username }));
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: `${label} has been copied to your clipboard.`,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the text manually.",
        variant: "destructive"
      });
    }
  };
  
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.username || !newUser.password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields including username and password.",
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

    // If creating Admin and no White Label selected
    if (newUser.role === "Admin" && !newUser.parentWhiteLabel) {
      toast({
        title: "White Label required",
        description: "Please select a White Label for this Admin user.",
        variant: "destructive"
      });
      return;
    }
    
    const createdUser: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "Active",
      company: newUser.company,
      address: newUser.address,
      phone: newUser.phone,
      avatar: newUser.avatar,
      lastActive: "Never",
      createdAt: new Date().toISOString().split('T')[0],
      permissions: [],
      parentWhiteLabel: newUser.role === "Admin" ? newUser.parentWhiteLabel : undefined,
      username: newUser.username,
      password: newUser.password
    };
    
    setUsers(prev => [...prev, createdUser]);
    setNewUser({ name: "", email: "", role: "Admin", company: "", address: "", phone: "", avatar: "", parentWhiteLabel: "", username: "", password: "" });
    setAvatarFile(null);
    setAvatarPreview("");
    setIsAddUserDialogOpen(false);
    
    toast({
      title: "User created",
      description: `${createdUser.name} has been added with credentials.`,
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
    setEditAvatarFile(null);
    setEditAvatarPreview("");
    
    toast({
      title: "User updated",
      description: "User information has been updated successfully.",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };

  const handleToggleUserStatus = (user: User) => {
    const manageableRoles = getManageableRoles();
    if (!manageableRoles.includes(user.role)) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to modify this user's status.",
        variant: "destructive"
      });
      return;
    }

    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    setUsers(prev => prev.map(u => 
      u.id === user.id ? { ...u, status: newStatus } : u
    ));

    toast({
      title: "User status updated",
      description: `${user.name} is now ${newStatus.toLowerCase()}.`,
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
    setEditAvatarPreview(user.avatar || "");
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
  const showAddUserButton = role === "Super Admin"; // Only Super Admin can add users
  
  const canShareCredentials = (user: User) => {
    const manageableRoles = getManageableRoles();
    return manageableRoles.includes(user.role) && user.username && user.password;
  };
  
  const openShareCredentialsDialog = (user: User) => {
    setSelectedUser(user);
    setIsShareCredentialsDialogOpen(true);
  };
  
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
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getVisibleUsers().filter(u => u.status === "Active").length}
            </div>
            <p className="text-xs text-muted-foreground">active users</p>
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
            {showAddUserButton && (
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
                      Create a new user account with login credentials
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newUserAvatar">Avatar</Label>
                      <div className="flex flex-col gap-2">
                        {avatarPreview && (
                          <div className="relative w-20 h-20">
                            <Avatar className="w-20 h-20">
                              <AvatarImage src={avatarPreview} />
                              <AvatarFallback>Preview</AvatarFallback>
                            </Avatar>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                              onClick={removeAvatarPreview}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarSelect}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Avatar
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Max 1MB</p>
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
                        onValueChange={(value: User["role"]) => {
                          setNewUser(prev => ({ ...prev, role: value, parentWhiteLabel: "" }));
                        }}
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
                      <Label htmlFor="newUserUsername">Username *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="newUserUsername"
                          placeholder="username"
                          value={newUser.username}
                          onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => generateUsername(newUser.name)}
                          disabled={!newUser.name}
                        >
                          Generate
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newUserPassword">Password *</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            id="newUserPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={newUser.password}
                            onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generatePassword}
                        >
                          Generate
                        </Button>
                      </div>
                    </div>
                    
                    {newUser.role === "Admin" && (
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="newUserWhiteLabel">White Label *</Label>
                        <Select 
                          value={newUser.parentWhiteLabel} 
                          onValueChange={(value) => setNewUser(prev => ({ ...prev, parentWhiteLabel: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select White Label" />
                          </SelectTrigger>
                          <SelectContent>
                            {getWhiteLabelUsers().map(whiteLabel => (
                              <SelectItem key={whiteLabel.id} value={whiteLabel.id}>
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={whiteLabel.avatar} />
                                    <AvatarFallback>{whiteLabel.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  {whiteLabel.name} ({whiteLabel.company})
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
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
                        {user.parentWhiteLabel && (
                          <p className="text-xs text-muted-foreground">
                            Under: {users.find(u => u.id === user.parentWhiteLabel)?.name}
                          </p>
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
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`status-${user.id}`} className="text-xs">
                              {user.status === "Active" ? "Active" : "Inactive"}
                            </Label>
                            <Switch
                              id={`status-${user.id}`}
                              checked={user.status === "Active"}
                              onCheckedChange={() => handleToggleUserStatus(user)}
                            />
                          </div>
                          {canShareCredentials(user) && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openShareCredentialsDialog(user)}
                              title="Share credentials"
                            >
                              <Share className="h-4 w-4" />
                            </Button>
                          )}
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
                <Label htmlFor="editUserAvatar">Avatar</Label>
                <div className="flex flex-col gap-2">
                  {(editAvatarPreview || selectedUser.avatar) && (
                    <div className="relative w-20 h-20">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={editAvatarPreview || selectedUser.avatar} />
                        <AvatarFallback>Preview</AvatarFallback>
                      </Avatar>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                        onClick={removeEditAvatarPreview}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleEditAvatarSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => editFileInputRef.current?.click()}
                      className="flex-1"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Avatar
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Max 1MB</p>
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
              {selectedUser.role === "Admin" && (
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="editUserWhiteLabel">White Label</Label>
                  <Select 
                    value={selectedUser.parentWhiteLabel || ""} 
                    onValueChange={(value) => 
                      setSelectedUser(prev => prev ? { ...prev, parentWhiteLabel: value } : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select White Label" />
                    </SelectTrigger>
                    <SelectContent>
                      {getWhiteLabelUsers().map(whiteLabel => (
                        <SelectItem key={whiteLabel.id} value={whiteLabel.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={whiteLabel.avatar} />
                              <AvatarFallback>{whiteLabel.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            {whiteLabel.name} ({whiteLabel.company})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
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
      
      {/* Share Credentials Dialog */}
      <Dialog open={isShareCredentialsDialogOpen} onOpenChange={setIsShareCredentialsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share User Credentials</DialogTitle>
            <DialogDescription>
              Copy the login credentials for this user to share with them securely.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                <Avatar>
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback>{selectedUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  <Badge variant={getRoleBadgeVariant(selectedUser.role)} className="mt-1">
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <div className="flex gap-2">
                    <Input value={selectedUser.username || ""} readOnly />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedUser.username || "", "Username")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="password" 
                      value={selectedUser.password || ""} 
                      readOnly 
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedUser.password || "", "Password")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Security Note:</strong> Share these credentials securely and advise the user to change their password after first login.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShareCredentialsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
