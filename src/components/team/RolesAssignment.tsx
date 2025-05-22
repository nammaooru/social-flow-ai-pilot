
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

// Mock data for roles
const initialRoles = [
  {
    id: '1',
    title: 'Marketing Director',
    department: 'Marketing',
    responsibilities: [
      'Develop marketing strategies',
      'Oversee brand development',
      'Manage marketing budget',
      'Lead marketing team'
    ],
    assignedTo: 'Alex Johnson',
    level: 'Executive'
  },
  {
    id: '2',
    title: 'Lead Designer',
    department: 'Design',
    responsibilities: [
      'Create visual designs and style guides',
      'Direct design team efforts',
      'Ensure brand consistency',
      'Collaborate with marketing on campaigns'
    ],
    assignedTo: 'Sam Smith',
    level: 'Manager'
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    department: 'Development',
    responsibilities: [
      'Build and maintain web applications',
      'Develop back-end architecture',
      'Optimize application performance',
      'Implement security best practices'
    ],
    assignedTo: 'Taylor Wong',
    level: 'Senior'
  },
  {
    id: '4',
    title: 'Content Strategist',
    department: 'Content',
    responsibilities: [
      'Develop content strategy',
      'Create editorial calendar',
      'Manage content team',
      'Ensure content quality'
    ],
    assignedTo: 'Jordan Lee',
    level: 'Senior'
  }
];

const teamMembers = [
  { value: "Alex Johnson", label: "Alex Johnson" },
  { value: "Sam Smith", label: "Sam Smith" },
  { value: "Taylor Wong", label: "Taylor Wong" },
  { value: "Jordan Lee", label: "Jordan Lee" },
  { value: "Casey Davis", label: "Casey Davis" },
  { value: "Morgan Patel", label: "Morgan Patel" },
];

const departments = [
  { value: "Marketing", label: "Marketing" },
  { value: "Design", label: "Design" },
  { value: "Development", label: "Development" },
  { value: "Content", label: "Content" },
  { value: "Management", label: "Management" },
];

const levels = [
  { value: "Executive", label: "Executive" },
  { value: "Manager", label: "Manager" },
  { value: "Senior", label: "Senior" },
  { value: "Mid-level", label: "Mid-level" },
  { value: "Junior", label: "Junior" },
];

const RolesAssignment = () => {
  const [roles, setRoles] = useState(initialRoles);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<any>(null);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  
  const handleOpenEditDialog = (role: any) => {
    setCurrentRole({...role});
    setEditingRoleId(role.id);
    setIsEditDialogOpen(true);
  };
  
  const handleAddRole = () => {
    const newId = (roles.length + 1).toString();
    setRoles([...roles, {...currentRole, id: newId}]);
    setCurrentRole(null);
    setIsAddDialogOpen(false);
  };
  
  const handleEditRole = () => {
    const updatedRoles = roles.map(role => 
      role.id === editingRoleId ? {...currentRole} : role
    );
    setRoles(updatedRoles);
    setCurrentRole(null);
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
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    onValueChange={(value) => setCurrentRole({...currentRole, department: value})}
                    value={currentRole?.department || undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="level">Level</Label>
                  <Select 
                    onValueChange={(value) => setCurrentRole({...currentRole, level: value})}
                    value={currentRole?.level || undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="assignedTo">Assign To</Label>
                  <Select 
                    onValueChange={(value) => setCurrentRole({...currentRole, assignedTo: value})}
                    value={currentRole?.assignedTo || undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.value} value={member.value}>
                          {member.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddRole}>Create Role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">
                    {role.title}
                  </TableCell>
                  <TableCell>{role.department}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      role.level === 'Executive' ? 'bg-purple-100' : 
                      role.level === 'Manager' ? 'bg-blue-100' : 
                      role.level === 'Senior' ? 'bg-green-100' : 
                      role.level === 'Mid-level' ? 'bg-yellow-100' : 'bg-gray-100'
                    }>
                      {role.level}
                    </Badge>
                  </TableCell>
                  <TableCell>{role.assignedTo}</TableCell>
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
                            <Label htmlFor="edit-department">Department</Label>
                            <Select 
                              value={currentRole?.department || undefined}
                              onValueChange={(value) => setCurrentRole({...currentRole, department: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                              <SelectContent>
                                {departments.map((dept) => (
                                  <SelectItem key={dept.value} value={dept.value}>
                                    {dept.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="edit-level">Level</Label>
                            <Select 
                              value={currentRole?.level || undefined}
                              onValueChange={(value) => setCurrentRole({...currentRole, level: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                              <SelectContent>
                                {levels.map((level) => (
                                  <SelectItem key={level.value} value={level.value}>
                                    {level.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                            <Label htmlFor="edit-assignedTo">Assign To</Label>
                            <Select 
                              value={currentRole?.assignedTo || undefined}
                              onValueChange={(value) => setCurrentRole({...currentRole, assignedTo: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select team member" />
                              </SelectTrigger>
                              <SelectContent>
                                {teamMembers.map((member) => (
                                  <SelectItem key={member.value} value={member.value}>
                                    {member.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => {
                            setIsEditDialogOpen(false);
                            setEditingRoleId(null);
                          }}>Cancel</Button>
                          <Button onClick={handleEditRole}>Save Changes</Button>
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
