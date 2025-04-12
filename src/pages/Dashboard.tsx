
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Users, BarChart2, MessageSquare, ThumbsUp } from 'lucide-react';

import StatCard from '@/components/StatCard';
import SocialAccountCard from '@/components/SocialAccountCard';
import EngagementChart from '@/components/EngagementChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Welcome back, John!</h1>
        <p className="text-muted-foreground">Here's what's happening with your social media accounts today.</p>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Followers" 
          value="12,658" 
          change={5.2} 
          icon={<Users size={20} />} 
          className="bg-blue-50 dark:bg-blue-950/20" 
        />
        <StatCard 
          title="Engagement Rate" 
          value="4.3%" 
          change={-1.8} 
          icon={<ThumbsUp size={20} />} 
          className="bg-green-50 dark:bg-green-950/20" 
        />
        <StatCard 
          title="Total Posts" 
          value="245" 
          change={12.5} 
          icon={<BarChart2 size={20} />} 
          className="bg-amber-50 dark:bg-amber-950/20" 
        />
        <StatCard 
          title="Recent Comments" 
          value="78" 
          change={8.7} 
          icon={<MessageSquare size={20} />} 
          className="bg-purple-50 dark:bg-purple-950/20" 
        />
      </div>
      
      {/* Social Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>
            Manage your social media connections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <SocialAccountCard 
            platform="Facebook" 
            icon={<Facebook className="text-[#1877F2]" />} 
            isConnected={true} 
            accountName="John's Business Page" 
          />
          <SocialAccountCard 
            platform="Twitter" 
            icon={<Twitter className="text-[#1DA1F2]" />} 
            isConnected={true} 
            status="warning" 
            accountName="@johnbusiness" 
          />
          <SocialAccountCard 
            platform="Instagram" 
            icon={<Instagram className="text-[#E1306C]" />} 
            isConnected={false} 
          />
          <SocialAccountCard 
            platform="LinkedIn" 
            icon={<Linkedin className="text-[#0A66C2]" />} 
            isConnected={true} 
            accountName="John Doe" 
          />
          <div className="flex justify-end mt-4">
            <Button variant="outline">Manage All Accounts</Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Engagement Chart */}
      <EngagementChart />
      
      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest updates from your accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 items-start pb-4 border-b border-border">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Facebook className="text-[#1877F2]" size={20} />
              </div>
              <div>
                <p className="font-medium">New comment on your Facebook post</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Sarah Johnson: "Love this content! Can you share more tips like this?"
                </p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start pb-4 border-b border-border">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Twitter className="text-[#1DA1F2]" size={20} />
              </div>
              <div>
                <p className="font-medium">Your scheduled tweet was published</p>
                <p className="text-sm text-muted-foreground mt-1">
                  "Check out our latest product launch! #NewProduct #Innovation"
                </p>
                <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Linkedin className="text-[#0A66C2]" size={20} />
              </div>
              <div>
                <p className="font-medium">New connection request on LinkedIn</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Alex Martinez wants to connect with you
                </p>
                <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-4">
            <Button variant="link">View All Activities</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
