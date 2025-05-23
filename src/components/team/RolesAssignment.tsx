
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

// Mock data for roles
const initialRoles = [
  {
    id: '1',
    title: 'Marketing Director',
    responsibilities: [
      'Develop marketing strategies',
      'Oversee brand development',
      'Manage marketing budget',
      'Lead marketing team'
    ],
    permissions: ['create', 'edit', 'delete', 'approve']
  },
  {
    id: '2',
    title: 'Lead Designer',
    responsibilities: [
      'Create visual designs and style guides',
      'Direct design team efforts',
      'Ensure brand consistency',
      'Collaborate with marketing on campaigns'
    ],
    permissions: ['create', 'edit']
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    responsibilities: [
      'Build and maintain web applications',
      'Develop back-end architecture',
      'Optimize application performance',
      'Implement security best practices'
    ],
    permissions: ['create', 'edit', 'delete']
  },
  {
    id: '4',
    title: 'Content Strategist',
    responsibilities: [
      'Develop content strategy',
      'Create editorial calendar',
      'Manage content team',
      'Ensure content quality'
    ],
    permissions: ['create', 'edit']
  }
];

// Permission options
const permissionOptions = [
  { id: 'create', label: 'Create' },
  { id: 'edit', label: 'Edit' },
  { id: 'delete', label: 'Delete' },
  { id: 'approve', label: 'Approve' },
  { id: 'publish', label: 'Publish' },
  { id: 'manage_users', label: 'Manage Users' }
];

const RolesAssignment = () => {
  const [roles, setRoles] = useState(initialRoles);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<any>(null);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  
  const handleOpenEditDialog = (role: any) => {
    setCurrentRole({...role});
    setSelectedPermissions(role.permissions || []);
    setEditingRoleId(role.id);
    setIsEditDialogOpen(true);
  };
  
  const handleAddRole = () => {
    // Ensure required fields are present
    if (!currentRole?.title) {
      return;
    }
    
    const newId = (roles.length + 1).toString();
    setRoles([...roles, {
      ...currentRole, 
      id: newId, 
      permissions: selectedPermissions
    }]);
    setCurrentRole(null);
    setSelectedPermissions([]);
    setIsAddDialogOpen(false);
  };
  
  const handleEditRole = () => {
    // Ensure required fields are present
    if (!currentRole?.title) {
      return;
    }
    
    const updatedRoles = roles.map(role => 
      role.id === editingRoleId ? {
        ...currentRole, 
        permissions: selectedPermissions
      } : role
    );
    setRoles(updatedRoles);
    setCurrentRole(null);
    setSelectedPermissions([]);
    setEditingRoleId(null);
    setIsEditDialogOpen(false);
  };
  
  const handleResponsibilityChange = (value: string) => {
    if (!currentRole) return;
    
    const responsibilities = value
      .split('\n')
      .filter(item => item.trim() !== '')
      .map(item => item.trim());
      
    setCurrentRole({...currentRole, responsibilities});
  };
  
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    } else {
      setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Roles & Responsibilities</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <Plus size={16} /> Add Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Define a new role and assign responsibilities.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Role Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g. Product Manager"
                    value={currentRole?.title || ''}
                    onChange={(e) => setCurrentRole({...currentRole, title: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="responsibilities">Responsibilities</Label>
                  <Textarea 
                    id="responsibilities"
                    placeholder="Enter responsibilities, one per line"
                    className="min-h-[100px]"
                    onChange={(e) => handleResponsibilityChange(e.target.value)}
                    value={currentRole?.responsibilities ? currentRole.responsibilities.join('\n') : ''}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {permissionOptions.map(permission => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`permission-${permission.id}`} 
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked === true)}
                        />
                        <Label 
                          htmlFor={`permission-${permission.id}`}
                          className="text-sm font-normal"
                        >
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleAddRole}
                  disabled={!currentRole?.title}
                >
                  Create Role
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Title</TableHead>
                <TableHead>Responsibilities</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">
                    {role.title}
                  </TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside text-sm">
                      {role.responsibilities.slice(0, 2).map((resp, index) => (
                        <li key={index}>{resp}</li>
                      ))}
                      {role.responsibilities.length > 2 && (
                        <li className="text-muted-foreground">+{role.responsibilities.length - 2} more</li>
                      )}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map(permission => (
                        <Badge key={permission} variant="outline" className="bg-blue-50">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog open={isEditDialogOpen && editingRoleId === role.id} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog(role)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Role</DialogTitle>
                          <DialogDescription>
                            Update role details and responsibilities.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-title">Role Title</Label>
                            <Input 
                              id="edit-title" 
                              value={currentRole?.title || ''}
                              onChange={(e) => setCurrentRole({...currentRole, title: e.target.value})}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-responsibilities">Responsibilities</Label>
                            <Textarea 
                              id="edit-responsibilities"
                              className="min-h-[100px]"
                              onChange={(e) => handleResponsibilityChange(e.target.value)}
                              value={currentRole?.responsibilities ? currentRole.responsibilities.join('\n') : ''}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label>Permissions</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {permissionOptions.map(permission => (
                                <div key={permission.id} className="flex items-center space-x-2">
                                  <Checkbox 
                                    id={`edit-permission-${permission.id}`} 
                                    checked={selectedPermissions.includes(permission.id)}
                                    onCheckedChange={(checked) => handlePermissionChange(permission.id, checked === true)}
                                  />
                                  <Label 
                                    htmlFor={`edit-permission-${permission.id}`}
                                    className="text-sm font-normal"
                                  >
                                    {permission.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => {
                            setIsEditDialogOpen(false);
                            setEditingRoleId(null);
                          }}>Cancel</Button>
                          <Button 
                            onClick={handleEditRole}
                            disabled={!currentRole?.title}
                          >
                            Save Changes
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RolesAssignment;
