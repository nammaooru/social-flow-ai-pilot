
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, UserCog, BarChart3, Calendar, Share2, BriefcaseBusiness } from 'lucide-react';
import TeamOrganization from '@/components/team/TeamOrganization';
import RolesAssignment from '@/components/team/RolesAssignment';
import PerformanceTracking from '@/components/team/PerformanceTracking';
import TeamAvailability from '@/components/team/TeamAvailability';
import TeamChat from '@/components/team/TeamChat';
import WorkloadDistribution from '@/components/team/WorkloadDistribution';
import CollaborationTools from '@/components/team/CollaborationTools';

const Team = () => {
  const [activeTab, setActiveTab] = useState('organization');
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Team Management</h1>
        <p className="text-muted-foreground">Organize your team, assign roles, track performance and collaborate efficiently.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Card className="md:w-1/4">
          <CardHeader className="pb-3">
            <CardTitle>Team Overview</CardTitle>
            <CardDescription>Your team at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Members</span>
              <Badge variant="outline">8</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Now</span>
              <Badge variant="outline" className="bg-green-100">5</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Pending Tasks</span>
              <Badge variant="outline" className="bg-yellow-100">12</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Completed Tasks</span>
              <Badge variant="outline" className="bg-blue-100">27</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Unread Messages</span>
              <Badge variant="outline" className="bg-red-100">4</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="pb-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 mb-4">
                <TabsTrigger value="organization" className="flex items-center gap-2">
                  <Users size={16} />
                  <span className="hidden sm:inline">Organization</span>
                </TabsTrigger>
                <TabsTrigger value="roles" className="flex items-center gap-2">
                  <UserCog size={16} />
                  <span className="hidden sm:inline">Roles</span>
                </TabsTrigger>
                <TabsTrigger value="performance" className="flex items-center gap-2">
                  <BarChart3 size={16} />
                  <span className="hidden sm:inline">Performance</span>
                </TabsTrigger>
                <TabsTrigger value="availability" className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span className="hidden sm:inline">Availability</span>
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare size={16} />
                  <span className="hidden sm:inline">Team Chat</span>
                </TabsTrigger>
                <TabsTrigger value="workload" className="flex items-center gap-2">
                  <BriefcaseBusiness size={16} />
                  <span className="hidden sm:inline">Workload</span>
                </TabsTrigger>
                <TabsTrigger value="collaboration" className="flex items-center gap-2">
                  <Share2 size={16} />
                  <span className="hidden sm:inline">Collaboration</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-2">
            <Tabs value={activeTab}>
              <TabsContent value="organization">
                <TeamOrganization />
              </TabsContent>
              <TabsContent value="roles">
                <RolesAssignment />
              </TabsContent>
              <TabsContent value="performance">
                <PerformanceTracking />
              </TabsContent>
              <TabsContent value="availability">
                <TeamAvailability />
              </TabsContent>
              <TabsContent value="chat">
                <TeamChat />
              </TabsContent>
              <TabsContent value="workload">
                <WorkloadDistribution />
              </TabsContent>
              <TabsContent value="collaboration">
                <CollaborationTools />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Team;
