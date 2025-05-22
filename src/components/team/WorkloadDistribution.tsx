
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
} from 'recharts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Clock, ArrowUpRight, MoreHorizontal, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

// Mock team members data
const teamMembers = [
  {
    id: '1',
    name: 'Alex Johnson',
    role: 'Marketing Director',
    avatar: 'https://i.pravatar.cc/150?img=1',
    capacity: 40,
    currentLoad: 32,
    tasks: [
      { id: '1', name: 'Review Q3 Marketing Strategy', priority: 'high', dueDate: '2023-08-15', status: 'in-progress', hours: 8 },
      { id: '2', name: 'Approve Social Media Calendar', priority: 'medium', dueDate: '2023-08-10', status: 'pending', hours: 4 },
      { id: '3', name: 'Prepare Board Meeting Presentation', priority: 'high', dueDate: '2023-08-20', status: 'not-started', hours: 12 },
      { id: '4', name: 'Website Content Audit', priority: 'low', dueDate: '2023-08-30', status: 'in-progress', hours: 8 },
    ]
  },
  {
    id: '2',
    name: 'Sam Smith',
    role: 'Lead Designer',
    avatar: 'https://i.pravatar.cc/150?img=2',
    capacity: 40,
    currentLoad: 36,
    tasks: [
      { id: '5', name: 'Design New Landing Page', priority: 'high', dueDate: '2023-08-12', status: 'in-progress', hours: 20 },
      { id: '6', name: 'Create Social Media Graphics', priority: 'medium', dueDate: '2023-08-08', status: 'in-progress', hours: 10 },
      { id: '7', name: 'Design Email Templates', priority: 'low', dueDate: '2023-08-25', status: 'not-started', hours: 6 },
    ]
  },
  {
    id: '3',
    name: 'Taylor Wong',
    role: 'Full Stack Developer',
    avatar: 'https://i.pravatar.cc/150?img=3',
    capacity: 40,
    currentLoad: 30,
    tasks: [
      { id: '8', name: 'API Development', priority: 'high', dueDate: '2023-08-18', status: 'in-progress', hours: 16 },
      { id: '9', name: 'Backend Performance Optimization', priority: 'medium', dueDate: '2023-08-22', status: 'not-started', hours: 8 },
      { id: '10', name: 'Code Review', priority: 'low', dueDate: '2023-08-09', status: 'pending', hours: 6 },
    ]
  },
  {
    id: '4',
    name: 'Jordan Lee',
    role: 'Content Strategist',
    avatar: 'https://i.pravatar.cc/150?img=4',
    capacity: 40,
    currentLoad: 24,
    tasks: [
      { id: '11', name: 'Q3 Content Calendar', priority: 'high', dueDate: '2023-08-11', status: 'in-progress', hours: 10 },
      { id: '12', name: 'Blog Post Writing', priority: 'medium', dueDate: '2023-08-14', status: 'in-progress', hours: 8 },
      { id: '13', name: 'SEO Report Analysis', priority: 'low', dueDate: '2023-08-28', status: 'not-started', hours: 6 },
    ]
  },
  {
    id: '5',
    name: 'Casey Davis',
    role: 'SEO Specialist',
    avatar: 'https://i.pravatar.cc/150?img=5',
    capacity: 40,
    currentLoad: 18,
    tasks: [
      { id: '14', name: 'SEO Audit', priority: 'medium', dueDate: '2023-08-16', status: 'in-progress', hours: 12 },
      { id: '15', name: 'Keyword Research', priority: 'low', dueDate: '2023-08-23', status: 'not-started', hours: 6 },
    ]
  }
];

// Create workload data for chart
const workloadData = teamMembers.map(member => ({
  name: member.name,
  current: member.currentLoad,
  capacity: member.capacity,
  available: member.capacity - member.currentLoad,
}));

const WorkloadDistribution = () => {
  const [members, setMembers] = useState(teamMembers);
  const [sortBy, setSortBy] = useState<'name' | 'workload' | 'capacity'>('workload');
  const [filterBy, setFilterBy] = useState<'all' | 'overloaded' | 'available'>('all');
  const [isAssignTaskDialogOpen, setIsAssignTaskDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  
  const form = useForm({
    defaultValues: {
      taskName: '',
      priority: 'medium',
      dueDate: '',
      hours: 0,
      assignedTo: '',
    },
  });

  // Helper functions
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return <Badge variant="outline" className="bg-red-100">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-blue-100">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-100">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-100">In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100">Pending</Badge>;
      case 'not-started':
        return <Badge variant="outline" className="bg-gray-100">Not Started</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getWorkloadClass = (currentLoad: number, capacity: number) => {
    const percentage = (currentLoad / capacity) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  // Filter and sort the members list
  let filteredMembers = [...members];
  
  if (filterBy === 'overloaded') {
    filteredMembers = filteredMembers.filter(member => (member.currentLoad / member.capacity) > 0.9);
  } else if (filterBy === 'available') {
    filteredMembers = filteredMembers.filter(member => (member.currentLoad / member.capacity) < 0.75);
  }
  
  filteredMembers.sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'workload') {
      return (b.currentLoad / b.capacity) - (a.currentLoad / a.capacity);
    } else {
      return b.capacity - a.capacity;
    }
  });

  // Handle task assignment
  const handleAssignTask = (data: any) => {
    if (selectedMemberId) {
      const newTask = {
        id: `task-${Date.now()}`,
        name: data.taskName,
        priority: data.priority,
        dueDate: data.dueDate,
        status: 'not-started',
        hours: Number(data.hours)
      };
      
      const updatedMembers = members.map(member => {
        if (member.id === selectedMemberId) {
          return {
            ...member,
            tasks: [...member.tasks, newTask],
            currentLoad: member.currentLoad + Number(data.hours)
          };
        }
        return member;
      });
      
      setMembers(updatedMembers);
      setIsAssignTaskDialogOpen(false);
      form.reset();
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Team Workload</h2>
          <div className="flex items-center gap-2">
            <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                <SelectItem value="overloaded">Overloaded</SelectItem>
                <SelectItem value="available">Available</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="workload">Workload %</SelectItem>
                <SelectItem value="capacity">Capacity</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center gap-1">
              <Clock size={16} />
              <span className="hidden md:inline">Time Tracking</span>
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-4">Workload Distribution</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={workloadData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="current" stackId="a" name="Current Load (hours)" fill="#8884d8" />
                    <Bar dataKey="available" stackId="a" name="Available Capacity (hours)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="rounded-md border mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Workload</TableHead>
                <TableHead>Hours (Current/Capacity)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <div className="w-full">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Workload</span>
                        <span>{Math.round((member.currentLoad / member.capacity) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(member.currentLoad / member.capacity) * 100} 
                        className="h-2" 
                        indicatorClassName={getWorkloadClass(member.currentLoad, member.capacity)}
                      />
                    </div>
                  </TableCell>
                  <TableCell>{member.currentLoad}/{member.capacity} hours</TableCell>
                  <TableCell className="text-right">
                    <Dialog
                      open={isAssignTaskDialogOpen && selectedMemberId === member.id}
                      onOpenChange={(open) => {
                        setIsAssignTaskDialogOpen(open);
                        if (!open) setSelectedMemberId(null);
                      }}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onClick={() => setSelectedMemberId(member.id)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Assign Task
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuItem>
                            <Clock className="h-4 w-4 mr-2" />
                            View Tasks
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ArrowUpRight className="h-4 w-4 mr-2" />
                            Adjust Capacity
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Task to {member.name}</DialogTitle>
                          <DialogDescription>
                            Create a new task and assign it to this team member.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={form.handleSubmit(handleAssignTask)}>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <FormItem>
                                <FormLabel>Task Name</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...form.register('taskName')}
                                    placeholder="Enter task name" 
                                    required
                                  />
                                </FormControl>
                              </FormItem>
                            </div>
                            
                            <div className="grid gap-2">
                              <FormItem>
                                <FormLabel>Priority</FormLabel>
                                <Select
                                  defaultValue="medium"
                                  onValueChange={(value) => form.setValue('priority', value)}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="low">Low</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            </div>
                            
                            <div className="grid gap-2">
                              <FormItem>
                                <FormLabel>Due Date</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...form.register('dueDate')}
                                    type="date" 
                                    required
                                  />
                                </FormControl>
                              </FormItem>
                            </div>
                            
                            <div className="grid gap-2">
                              <FormItem>
                                <FormLabel>Estimated Hours</FormLabel>
                                <FormControl>
                                  <Input 
                                    {...form.register('hours')}
                                    type="number" 
                                    min="1"
                                    required
                                  />
                                </FormControl>
                              </FormItem>
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsAssignTaskDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">Assign Task</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <h3 className="text-lg font-semibold mb-4">Active Tasks by Team Member</h3>
        
        {filteredMembers.map((member) => (
          <Card key={member.id} className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">{member.currentLoad}/{member.capacity} hours</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((member.currentLoad / member.capacity) * 100)}% Allocated
                    </div>
                  </div>
                  <Progress 
                    value={(member.currentLoad / member.capacity) * 100} 
                    className="h-2 w-20" 
                    indicatorClassName={getWorkloadClass(member.currentLoad, member.capacity)}
                  />
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Hours</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {member.tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.name}</TableCell>
                        <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                        <TableCell>{getStatusBadge(task.status)}</TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                        <TableCell>{task.hours}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default WorkloadDistribution;
