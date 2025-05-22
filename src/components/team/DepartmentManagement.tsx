
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash, Users } from 'lucide-react';
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

// Mock department data
const initialDepartments = [
  {
    id: '1',
    name: 'Marketing',
    description: 'Responsible for brand promotion and customer acquisition',
    headCount: 5,
    budget: 120000,
    status: 'active'
  },
  {
    id: '2',
    name: 'Design',
    description: 'Creates visual assets and improves user experience',
    headCount: 3,
    budget: 85000,
    status: 'active'
  },
  {
    id: '3',
    name: 'Development',
    description: 'Builds and maintains software products and services',
    headCount: 8,
    budget: 250000,
    status: 'active'
  },
  {
    id: '4',
    name: 'Content',
    description: 'Produces written and multimedia content for marketing',
    headCount: 4,
    budget: 75000,
    status: 'active'
  },
  {
    id: '5',
    name: 'Management',
    description: 'Oversees company operations and strategic planning',
    headCount: 2,
    budget: 180000, 
    status: 'active'
  },
];

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState(initialDepartments);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState({
    name: '',
    description: '',
    headCount: 0,
    budget: 0,
    status: 'active'
  });
  const [editingDepartmentId, setEditingDepartmentId] = useState<string | null>(null);
  const [deletingDepartmentId, setDeletingDepartmentId] = useState<string | null>(null);

  const handleAddDepartment = () => {
    if (!currentDepartment.name) return;
    
    const id = (departments.length + 1).toString();
    const newDepartmentWithId = {
      ...currentDepartment,
      id,
      status: 'active'
    };
    
    setDepartments([...departments, newDepartmentWithId]);
    setCurrentDepartment({
      name: '',
      description: '',
      headCount: 0,
      budget: 0,
      status: 'active'
    });
    setIsAddDialogOpen(false);
  };

  const handleEditDepartment = () => {
    if (!currentDepartment.name || !editingDepartmentId) return;
    
    const updatedDepartments = departments.map(dept => 
      dept.id === editingDepartmentId ? {...currentDepartment, id: editingDepartmentId} : dept
    );
    
    setDepartments(updatedDepartments);
    setCurrentDepartment({
      name: '',
      description: '',
      headCount: 0,
      budget: 0,
      status: 'active'
    });
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
      headCount: department.headCount,
      budget: department.budget,
      status: department.status
    });
    setEditingDepartmentId(department.id);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setDeletingDepartmentId(id);
    setIsDeleteDialogOpen(true);
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
            <DialogContent>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="headCount">Head Count</Label>
                    <Input 
                      id="headCount" 
                      type="number"
                      min="0"
                      value={currentDepartment.headCount}
                      onChange={(e) => setCurrentDepartment({...currentDepartment, headCount: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="budget">Budget ($)</Label>
                    <Input 
                      id="budget" 
                      type="number"
                      min="0"
                      value={currentDepartment.budget}
                      onChange={(e) => setCurrentDepartment({...currentDepartment, budget: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleAddDepartment}
                  disabled={!currentDepartment.name}
                >
                  Add Department
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
                <TableHead>Members</TableHead>
                <TableHead>Budget</TableHead>
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
                      <Users size={16} className="mr-2 text-muted-foreground" />
                      <span>{department.headCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>${department.budget.toLocaleString()}</TableCell>
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
          <DialogContent>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-headCount">Head Count</Label>
                  <Input 
                    id="edit-headCount" 
                    type="number"
                    min="0"
                    value={currentDepartment.headCount}
                    onChange={(e) => setCurrentDepartment({...currentDepartment, headCount: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-budget">Budget ($)</Label>
                  <Input 
                    id="edit-budget" 
                    type="number"
                    min="0"
                    value={currentDepartment.budget}
                    onChange={(e) => setCurrentDepartment({...currentDepartment, budget: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingDepartmentId(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEditDepartment}
                disabled={!currentDepartment.name}
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
      </CardContent>
    </Card>
  );
};

export default DepartmentManagement;
