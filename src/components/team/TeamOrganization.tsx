
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock team data
const teamMembers = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    department: 'Marketing',
    role: 'Director',
    status: 'active',
    avatarUrl: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    name: 'Sam Smith',
    email: 'sam@example.com',
    department: 'Design',
    role: 'Lead Designer',
    status: 'active',
    avatarUrl: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: '3',
    name: 'Taylor Wong',
    email: 'taylor@example.com',
    department: 'Development',
    role: 'Full Stack Developer',
    status: 'active',
    avatarUrl: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: '4',
    name: 'Jordan Lee',
    email: 'jordan@example.com',
    department: 'Content',
    role: 'Content Strategist',
    status: 'active',
    avatarUrl: 'https://i.pravatar.cc/150?img=4'
  },
  {
    id: '5',
    name: 'Casey Davis',
    email: 'casey@example.com',
    department: 'Marketing',
    role: 'SEO Specialist',
    status: 'inactive',
    avatarUrl: 'https://i.pravatar.cc/150?img=5'
  },
];

const TeamOrganization = () => {
  const [members, setMembers] = useState(teamMembers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    department: '',
    role: ''
  });

  const handleAddMember = () => {
    const id = (members.length + 1).toString();
    const newMemberWithId = {
      ...newMember, 
      id,
      status: 'active',
      avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 30)}`
    };
    
    setMembers([...members, newMemberWithId]);
    setNewMember({ name: '', email: '', department: '', role: '' });
    setIsAddDialogOpen(false);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Team Structure</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <Plus size={16} /> Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>
                  Add a new member to your team. They will receive an invitation email.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    onValueChange={(value) => setNewMember({...newMember, department: value})}
                    value={newMember.department || undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Development">Development</SelectItem>
                      <SelectItem value="Content">Content</SelectItem>
                      <SelectItem value="Management">Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Input 
                    id="role" 
                    value={newMember.role}
                    onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddMember}>Add Member</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <img 
                        src={member.avatarUrl} 
                        alt={member.name} 
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div>{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{member.department}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <Badge variant={member.status === 'active' ? 'outline' : 'secondary'} 
                      className={member.status === 'active' ? 'bg-green-100' : undefined}>
                      {member.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
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

export default TeamOrganization;
