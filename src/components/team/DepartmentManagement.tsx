
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, Users, UserPlus, User } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// Mock data for roles
const availableRoles = [
  {
    id: '1',
    title: 'Marketing Director',
  },
  {
    id: '2',
    title: 'Lead Designer',
  },
  {
    id: '3',
    title: 'Full Stack Developer',
  },
  {
    id: '4',
    title: 'Content Strategist',
  }
];

// Mock data for members
const availableMembers = [
  { id: '1', name: 'Alex Johnson', avatarUrl: 'https://i.pravatar.cc/150?img=1', role: 'Marketing Director' },
  { id: '2', name: 'Sam Smith', avatarUrl: 'https://i.pravatar.cc/150?img=2', role: 'Content Strategist' },
  { id: '3', name: 'Taylor Wong', avatarUrl: 'https://i.pravatar.cc/150?img=3', role: 'Lead Designer' },
  { id: '4', name: 'Jordan Lee', avatarUrl: 'https://i.pravatar.cc/150?img=4', role: 'Full Stack Developer' },
  { id: '5', name: 'Casey Davis', avatarUrl: 'https://i.pravatar.cc/150?img=5', role: 'Lead Designer' },
  { id: '6', name: 'Morgan Brown', avatarUrl: 'https://i.pravatar.cc/150?img=6', role: 'Content Strategist' },
  { id: '7', name: 'Riley Kim', avatarUrl: 'https://i.pravatar.cc/150?img=7', role: 'Marketing Director' },
  { id: '8', name: 'Jamie Garcia', avatarUrl: 'https://i.pravatar.cc/150?img=8', role: 'Full Stack Developer' },
];

// Mock department data
const initialDepartments = [
  {
    id: '1',
    name: 'Marketing',
    description: 'Responsible for brand promotion and customer acquisition',
    leader: { id: '1', name: 'Alex Johnson', avatarUrl: 'https://i.pravatar.cc/150?img=1', role: 'Marketing Director' },
    members: [
      { id: '1', name: 'Alex Johnson', avatarUrl: 'https://i.pravatar.cc/150?img=1', role: 'Marketing Director' },
      { id: '2', name: 'Sam Smith', avatarUrl: 'https://i.pravatar.cc/150?img=2', role: 'Content Strategist' },
    ],
    status: 'active'
  },
  {
    id: '2',
    name: 'Design',
    description: 'Creates visual assets and improves user experience',
    leader: { id: '3', name: 'Taylor Wong', avatarUrl: 'https://i.pravatar.cc/150?img=3', role: 'Lead Designer' },
    members: [
      { id: '3', name: 'Taylor Wong', avatarUrl: 'https://i.pravatar.cc/150?img=3', role: 'Lead Designer' },
      { id: '5', name: 'Casey Davis', avatarUrl: 'https://i.pravatar.cc/150?img=5', role: 'Lead Designer' },
    ],
    status: 'active'
  },
  {
    id: '3',
    name: 'Development',
    description: 'Builds and maintains software products and services',
    leader: { id: '4', name: 'Jordan Lee', avatarUrl: 'https://i.pravatar.cc/150?img=4', role: 'Full Stack Developer' },
    members: [
      { id: '4', name: 'Jordan Lee', avatarUrl: 'https://i.pravatar.cc/150?img=4', role: 'Full Stack Developer' },
      { id: '8', name: 'Jamie Garcia', avatarUrl: 'https://i.pravatar.cc/150?img=8', role: 'Full Stack Developer' },
    ],
    status: 'active'
  }
];

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState(initialDepartments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<any>({
    name: '',
    description: '',
    members: [],
    leader: null,
    status: 'active'
  });
  const [editingDepartmentId, setEditingDepartmentId] = useState<string | null>(null);
  const [deletingDepartmentId, setDeletingDepartmentId] = useState<string | null>(null);
  const [viewingDepartmentId, setViewingDepartmentId] = useState<string | null>(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [searchMember, setSearchMember] = useState('');
  
  const filteredMembers = availableMembers.filter(member => 
    member.name.toLowerCase().includes(searchMember.toLowerCase())
  );

  const handleAddDepartment = () => {
    if (!currentDepartment?.name || !currentDepartment?.leader) return;
    
    // Ensure leader is also in the members list
    let departmentMembers = [...currentDepartment.members];
    if (!departmentMembers.some(member => member.id === currentDepartment.leader.id)) {
      departmentMembers = [currentDepartment.leader, ...departmentMembers];
    }
    
    const id = (departments.length + 1).toString();
    const newDepartmentWithId = {
      ...currentDepartment,
      id,
      members: departmentMembers,
      status: 'active'
    };
    
    setDepartments([...departments, newDepartmentWithId]);
    resetFormState();
    setIsAddDialogOpen(false);
  };

  const handleEditDepartment = () => {
    if (!currentDepartment?.name || !editingDepartmentId || !currentDepartment?.leader) return;
    
    // Ensure leader is also in the members list
    let departmentMembers = [...currentDepartment.members];
    if (!departmentMembers.some(member => member.id === currentDepartment.leader.id)) {
      departmentMembers = [currentDepartment.leader, ...departmentMembers];
    }
    
    const updatedDepartments = departments.map(dept => 
      dept.id === editingDepartmentId ? {
        ...currentDepartment,
        id: editingDepartmentId,
        members: departmentMembers
      } : dept
    );
    
    setDepartments(updatedDepartments);
    resetFormState();
    setIsEditDialogOpen(false);
    setEditingDepartmentId(null);
  };

  const handleDeleteDepartment = () => {
    if (!deletingDepartmentId) return;
    
    const filteredDepartments = departments.filter(dept => dept.id !== deletingDepartmentId);
    setDepartments(filteredDepartments);
    setIsDeleteDialogOpen(false);
    setDeletingDepartmentId(null);
  };

  const openEditDialog = (department: typeof initialDepartments[0]) => {
    setCurrentDepartment({
      name: department.name,
      description: department.description,
      leader: department.leader,
      members: department.members,
      status: department.status
    });
    setSelectedMemberIds(department.members.map(member => member.id));
    setEditingDepartmentId(department.id);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (department: typeof initialDepartments[0]) => {
    setCurrentDepartment(department);
    setViewingDepartmentId(department.id);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeletingDepartmentId(id);
    setIsDeleteDialogOpen(true);
  };

  const resetFormState = () => {
    setCurrentDepartment({
      name: '',
      description: '',
      members: [],
      leader: null,
      status: 'active'
    });
    setSelectedMemberIds([]);
  };

  const handleMemberSelect = (member: any) => {
    // Toggle member selection
    if (selectedMemberIds.includes(member.id)) {
      setSelectedMemberIds(selectedMemberIds.filter(id => id !== member.id));
      setCurrentDepartment({
        ...currentDepartment,
        members: currentDepartment.members.filter((m: any) => m.id !== member.id)
      });
    } else {
      setSelectedMemberIds([...selectedMemberIds, member.id]);
      setCurrentDepartment({
        ...currentDepartment,
        members: [...currentDepartment.members, member]
      });
    }
  };

  const handleLeaderSelect = (leaderId: string) => {
    const leader = availableMembers.find(member => member.id === leaderId);
    if (leader) {
      setCurrentDepartment({
        ...currentDepartment,
        leader
      });
      
      // Also add the leader to members list if not already there
      if (!selectedMemberIds.includes(leaderId)) {
        setSelectedMemberIds([...selectedMemberIds, leaderId]);
        setCurrentDepartment(prev => ({
          ...prev,
          members: [...prev.members, leader]
        }));
      }
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Department Management</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <Plus size={16} /> Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Department</DialogTitle>
                <DialogDescription>
                  Create a new department in your organization structure.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Department Name</Label>
                  <Input 
                    id="name" 
                    value={currentDepartment.name}
                    onChange={(e) => setCurrentDepartment({...currentDepartment, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={currentDepartment.description}
                    onChange={(e) => setCurrentDepartment({...currentDepartment, description: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="leader">Team Leader</Label>
                  <Select 
                    onValueChange={handleLeaderSelect}
                    value={currentDepartment.leader?.id}
                  >
                    <SelectTrigger id="leader">
                      <SelectValue placeholder="Select team leader" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMembers.map(member => (
                        <SelectItem key={member.id} value={member.id} className="cursor-pointer">
                          <div className="flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={member.avatarUrl} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{member.name}</span>
                            <span className="ml-auto text-xs text-muted-foreground">{member.role}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <Label>Team Members</Label>
                    <span className="text-xs text-muted-foreground">
                      {selectedMemberIds.length} selected
                    </span>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="justify-between h-auto py-2"
                      >
                        <span>
                          {selectedMemberIds.length > 0
                            ? `${selectedMemberIds.length} member${selectedMemberIds.length > 1 ? "s" : ""} selected`
                            : "Select members"}
                        </span>
                        <UserPlus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Search members..."
                          className="h-9"
                          value={searchMember}
                          onValueChange={setSearchMember}
                        />
                        <CommandList>
                          <CommandEmpty>No members found.</CommandEmpty>
                          <CommandGroup>
                            <ScrollArea className="h-64">
                              {filteredMembers.map((member) => (
                                <CommandItem
                                  key={member.id}
                                  value={member.id}
                                  onSelect={() => handleMemberSelect(member)}
                                  className="cursor-pointer"
                                >
                                  <div className="flex items-center w-full">
                                    <Checkbox
                                      id={`member-${member.id}`}
                                      checked={selectedMemberIds.includes(member.id)}
                                      className="mr-2"
                                    />
                                    <Avatar className="h-6 w-6 mr-2">
                                      <AvatarImage src={member.avatarUrl} />
                                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <span>{member.name}</span>
                                      <p className="text-xs text-muted-foreground">{member.role}</p>
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                            </ScrollArea>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsAddDialogOpen(false);
                  resetFormState();
                }}>Cancel</Button>
                <Button 
                  onClick={handleAddDepartment}
                  disabled={!currentDepartment.name || !currentDepartment.leader}
                >
                  Create Department
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Team Leader</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{department.name}</div>
                      <div className="text-xs text-muted-foreground">{department.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={department.leader.avatarUrl} />
                        <AvatarFallback>{department.leader.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{department.leader.name}</div>
                        <div className="text-xs text-muted-foreground">{department.leader.role}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="flex -space-x-2 mr-2">
                        {department.members.slice(0, 3).map((member) => (
                          <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                            <AvatarImage src={member.avatarUrl} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ))}
                        {department.members.length > 3 && (
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border-2 border-background text-xs font-medium">
                            +{department.members.length - 3}
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => openViewDialog(department)}>
                        View all
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={department.status === 'active' ? 'outline' : 'secondary'} 
                      className={department.status === 'active' ? 'bg-green-100' : undefined}>
                      {department.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditDialog(department)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openDeleteDialog(department.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Edit Department Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Department</DialogTitle>
              <DialogDescription>
                Update the department information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Department Name</Label>
                <Input 
                  id="edit-name" 
                  value={currentDepartment.name}
                  onChange={(e) => setCurrentDepartment({...currentDepartment, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description" 
                  value={currentDepartment.description}
                  onChange={(e) => setCurrentDepartment({...currentDepartment, description: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-leader">Team Leader</Label>
                <Select 
                  onValueChange={handleLeaderSelect}
                  value={currentDepartment.leader?.id}
                  defaultValue={currentDepartment.leader?.id}
                >
                  <SelectTrigger id="edit-leader">
                    <SelectValue placeholder="Select team leader" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMembers.map(member => (
                      <SelectItem key={member.id} value={member.id} className="cursor-pointer">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={member.avatarUrl} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{member.name}</span>
                          <span className="ml-auto text-xs text-muted-foreground">{member.role}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label>Team Members</Label>
                  <span className="text-xs text-muted-foreground">
                    {selectedMemberIds.length} selected
                  </span>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="justify-between h-auto py-2"
                    >
                      <span>
                        {selectedMemberIds.length > 0
                          ? `${selectedMemberIds.length} member${selectedMemberIds.length > 1 ? "s" : ""} selected`
                          : "Select members"}
                      </span>
                      <UserPlus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Search members..."
                        className="h-9"
                        value={searchMember}
                        onValueChange={setSearchMember}
                      />
                      <CommandList>
                        <CommandEmpty>No members found.</CommandEmpty>
                        <CommandGroup>
                          <ScrollArea className="h-64">
                            {filteredMembers.map((member) => (
                              <CommandItem
                                key={member.id}
                                value={member.id}
                                onSelect={() => handleMemberSelect(member)}
                                className="cursor-pointer"
                              >
                                <div className="flex items-center w-full">
                                  <Checkbox
                                    id={`edit-member-${member.id}`}
                                    checked={selectedMemberIds.includes(member.id)}
                                    className="mr-2"
                                  />
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={member.avatarUrl} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <span>{member.name}</span>
                                    <p className="text-xs text-muted-foreground">{member.role}</p>
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </ScrollArea>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingDepartmentId(null);
                  resetFormState();
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEditDepartment}
                disabled={!currentDepartment.name || !currentDepartment.leader}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Department Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Department</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this department? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setDeletingDepartmentId(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeleteDepartment}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* View Department Members Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{currentDepartment.name} Members</DialogTitle>
              <DialogDescription>
                Team members in this department
              </DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2 flex items-center">
                  <User className="mr-2 h-4 w-4" /> Team Leader
                </h4>
                {currentDepartment.leader && (
                  <div className="flex items-center p-2 bg-muted/40 rounded-md">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={currentDepartment.leader.avatarUrl} />
                      <AvatarFallback>{currentDepartment.leader.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{currentDepartment.leader.name}</div>
                      <div className="text-xs text-muted-foreground">{currentDepartment.leader.role}</div>
                    </div>
                  </div>
                )}
              </div>
              
              <h4 className="text-sm font-semibold mb-2 flex items-center">
                <Users className="mr-2 h-4 w-4" /> Team Members
              </h4>
              <ScrollArea className="h-64 pr-4">
                {currentDepartment.members?.filter((member: any) => member.id !== currentDepartment.leader?.id).map((member: any) => (
                  <div key={member.id} className="flex items-center p-2 hover:bg-muted rounded-md transition-colors mb-1">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={member.avatarUrl} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.role}</div>
                    </div>
                  </div>
                ))}
                {currentDepartment.members?.filter((member: any) => member.id !== currentDepartment.leader?.id).length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    No additional team members
                  </div>
                )}
              </ScrollArea>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default DepartmentManagement;
