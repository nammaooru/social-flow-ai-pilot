
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock performance data
const performanceData = [
  {
    id: '1',
    name: 'Alex Johnson',
    role: 'Marketing Director',
    tasks: { completed: 24, total: 30 },
    goals: { achieved: 7, total: 10 },
    performance: 85,
    trend: [
      { month: 'Jan', score: 75 },
      { month: 'Feb', score: 78 },
      { month: 'Mar', score: 80 },
      { month: 'Apr', score: 82 },
      { month: 'May', score: 85 },
    ]
  },
  {
    id: '2',
    name: 'Sam Smith',
    role: 'Lead Designer',
    tasks: { completed: 32, total: 35 },
    goals: { achieved: 8, total: 10 },
    performance: 90,
    trend: [
      { month: 'Jan', score: 82 },
      { month: 'Feb', score: 84 },
      { month: 'Mar', score: 87 },
      { month: 'Apr', score: 89 },
      { month: 'May', score: 90 },
    ]
  },
  {
    id: '3',
    name: 'Taylor Wong',
    role: 'Full Stack Developer',
    tasks: { completed: 45, total: 50 },
    goals: { achieved: 9, total: 10 },
    performance: 92,
    trend: [
      { month: 'Jan', score: 80 },
      { month: 'Feb', score: 85 },
      { month: 'Mar', score: 88 },
      { month: 'Apr', score: 90 },
      { month: 'May', score: 92 },
    ]
  },
  {
    id: '4',
    name: 'Jordan Lee',
    role: 'Content Strategist',
    tasks: { completed: 18, total: 25 },
    goals: { achieved: 6, total: 10 },
    performance: 78,
    trend: [
      { month: 'Jan', score: 70 },
      { month: 'Feb', score: 72 },
      { month: 'Mar', score: 75 },
      { month: 'Apr', score: 77 },
      { month: 'May', score: 78 },
    ]
  },
  {
    id: '5',
    name: 'Casey Davis',
    role: 'SEO Specialist',
    tasks: { completed: 20, total: 22 },
    goals: { achieved: 7, total: 10 },
    performance: 84,
    trend: [
      { month: 'Jan', score: 76 },
      { month: 'Feb', score: 79 },
      { month: 'Mar', score: 81 },
      { month: 'Apr', score: 83 },
      { month: 'May', score: 84 },
    ]
  }
];

// Team average performance data
const teamPerformanceData = [
  { month: 'Jan', performance: 76.6 },
  { month: 'Feb', score: 79.6 },
  { month: 'Mar', score: 82.2 },
  { month: 'Apr', score: 84.2 },
  { month: 'May', score: 85.8 },
];

const PerformanceTracking = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const selectedEmployeeData = selectedEmployee 
    ? performanceData.find(emp => emp.id === selectedEmployee)?.trend 
    : teamPerformanceData;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Performance Metrics</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Timeframe:</span>
            <Select
              value={selectedTimeframe}
              onValueChange={setSelectedTimeframe}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-2">
                <div className="text-2xl font-bold">85.8%</div>
                <div className="text-sm text-muted-foreground">Team Avg. Performance</div>
              </div>
              <Progress value={85.8} className="h-2 bg-gray-200" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-2">
                <div className="text-2xl font-bold">139/162</div>
                <div className="text-sm text-muted-foreground">Tasks Completed</div>
              </div>
              <Progress value={85.8} className="h-2 bg-gray-200" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-2">
                <div className="text-2xl font-bold">37/50</div>
                <div className="text-sm text-muted-foreground">Goals Achieved</div>
              </div>
              <Progress value={74} className="h-2 bg-gray-200" />
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Performance Trend</h3>
                <Select
                  value={selectedEmployee || ""}
                  onValueChange={setSelectedEmployee}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Team Average" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Team Average</SelectItem>
                    {performanceData.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>{employee.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={selectedEmployeeData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[60, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-4">Top Performers</h3>
              <div className="space-y-4">
                {performanceData
                  .sort((a, b) => b.performance - a.performance)
                  .slice(0, 3)
                  .map((employee, index) => (
                    <div key={employee.id} className="flex items-center gap-3">
                      <div className="flex-shrink-0 flex items-center justify-center rounded-full w-8 h-8 bg-primary text-white">
                        {index + 1}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <span className="font-medium">{employee.name}</span>
                          <span className="font-bold">{employee.performance}%</span>
                        </div>
                        <div className="mt-1">
                          <Progress 
                            value={employee.performance} 
                            className="h-2 bg-gray-200"
                            indicatorClassName={getPerformanceColor(employee.performance)} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Tasks</TableHead>
                <TableHead>Goals</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceData.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>
                    {employee.tasks.completed}/{employee.tasks.total} 
                    <Progress 
                      value={(employee.tasks.completed / employee.tasks.total) * 100} 
                      className="h-2 bg-gray-200 mt-1" 
                    />
                  </TableCell>
                  <TableCell>
                    {employee.goals.achieved}/{employee.goals.total}
                    <Progress 
                      value={(employee.goals.achieved / employee.goals.total) * 100} 
                      className="h-2 bg-gray-200 mt-1" 
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between">
                      <Progress 
                        value={employee.performance} 
                        className="h-2 bg-gray-200 w-24 mr-2" 
                        indicatorClassName={getPerformanceColor(employee.performance)}
                      />
                      <span className="font-medium">{employee.performance}%</span>
                    </div>
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

export default PerformanceTracking;
