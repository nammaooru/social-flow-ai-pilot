
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, BarChart, AreaChart, ResponsiveContainer, 
  Line, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { 
  ArrowUp, ArrowDown, Users, BarChart2, Share2, ThumbsUp, 
  MessageCircle, Eye, TrendingUp, Calendar
} from 'lucide-react';

// Mock data for the overview charts
const performanceData = [
  { name: 'Jan', Instagram: 4000, Facebook: 2400, Twitter: 2400, LinkedIn: 1800 },
  { name: 'Feb', Instagram: 3000, Facebook: 1398, Twitter: 2210, LinkedIn: 1300 },
  { name: 'Mar', Instagram: 2000, Facebook: 9800, Twitter: 2290, LinkedIn: 2300 },
  { name: 'Apr', Instagram: 2780, Facebook: 3908, Twitter: 2000, LinkedIn: 2800 },
  { name: 'May', Instagram: 1890, Facebook: 4800, Twitter: 2181, LinkedIn: 2400 },
  { name: 'Jun', Instagram: 2390, Facebook: 3800, Twitter: 2500, LinkedIn: 2100 },
  { name: 'Jul', Instagram: 3490, Facebook: 4300, Twitter: 2100, LinkedIn: 1900 },
];

const engagementData = [
  { name: 'Week 1', Likes: 4000, Comments: 2400, Shares: 2400 },
  { name: 'Week 2', Likes: 3000, Comments: 1398, Shares: 2210 },
  { name: 'Week 3', Likes: 2000, Comments: 9800, Shares: 2290 },
  { name: 'Week 4', Likes: 2780, Comments: 3908, Shares: 2000 },
];

const audienceGrowthData = [
  { name: 'Jan', Total: 4000, New: 2400 },
  { name: 'Feb', Total: 6000, New: 2000 },
  { name: 'Mar', Total: 8000, New: 2000 },
  { name: 'Apr', Total: 9000, New: 1000 },
  { name: 'May', Total: 9500, New: 500 },
  { name: 'Jun', Total: 11000, New: 1500 },
  { name: 'Jul', Total: 15000, New: 4000 },
];

// Define component props
interface OverviewDashboardProps {
  platform: string;
  timeRange: string;
}

// StatsCard component for consistent styling of metric cards
const StatsCard = ({ title, value, change, icon, trend }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <div className="text-2xl font-bold">{value}</div>
          <div className={`flex items-center text-xs mt-1 font-medium ${
            trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
          }`}>
            {trend === 'up' ? <ArrowUp className="h-3 w-3 mr-1" /> : 
             trend === 'down' ? <ArrowDown className="h-3 w-3 mr-1" /> : null}
            {change}
          </div>
        </div>
        <div className="p-2 bg-muted rounded-full">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ platform, timeRange }) => {
  // Apply filters to data (in a real app, this would be done via API calls)
  const filteredPerformanceData = platform === 'all' ? performanceData : 
    performanceData.map(item => ({ 
      name: item.name, 
      [platform.charAt(0).toUpperCase() + platform.slice(1)]: item[platform.charAt(0).toUpperCase() + platform.slice(1)] 
    }));

  // Format data based on time range (simplified)
  const timeRangeLabel = timeRange === 'last7days' ? 'Last 7 Days' : 
                          timeRange === 'last30days' ? 'Last 30 Days' : 
                          timeRange === 'last3months' ? 'Last 3 Months' :
                          timeRange === 'last6months' ? 'Last 6 Months' :
                          timeRange === 'lastyear' ? 'Last Year' : 'Custom Range';

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Followers" 
          value="15,248" 
          change="+12.5% from last period" 
          icon={<Users className="h-5 w-5 text-primary" />}
          trend="up"
        />
        <StatsCard 
          title="Engagement Rate" 
          value="4.6%" 
          change="-0.8% from last period" 
          icon={<ThumbsUp className="h-5 w-5 text-primary" />}
          trend="down"
        />
        <StatsCard 
          title="Total Impressions" 
          value="247.8K" 
          change="+18.2% from last period" 
          icon={<Eye className="h-5 w-5 text-primary" />}
          trend="up"
        />
        <StatsCard 
          title="Content Count" 
          value="86" 
          change="+5 from last period" 
          icon={<BarChart2 className="h-5 w-5 text-primary" />}
          trend="neutral"
        />
      </div>

      <Card className="col-span-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>
              Growth across platforms for {timeRangeLabel}
            </CardDescription>
          </div>
          <div>
            <Badge variant="outline" className="ml-2">
              {platform === 'all' ? 'All Platforms' : platform.charAt(0).toUpperCase() + platform.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={filteredPerformanceData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {platform === 'all' ? (
                <>
                  <Line type="monotone" dataKey="Instagram" stroke="#E1306C" strokeWidth={2} />
                  <Line type="monotone" dataKey="Facebook" stroke="#4267B2" strokeWidth={2} />
                  <Line type="monotone" dataKey="Twitter" stroke="#1DA1F2" strokeWidth={2} />
                  <Line type="monotone" dataKey="LinkedIn" stroke="#0077B5" strokeWidth={2} />
                </>
              ) : (
                <Line 
                  type="monotone" 
                  dataKey={platform.charAt(0).toUpperCase() + platform.slice(1)} 
                  stroke="#7C3AED" 
                  strokeWidth={2} 
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Breakdown</CardTitle>
            <CardDescription>
              Likes, comments, and shares over time
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={engagementData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Likes" fill="#8884d8" />
                <Bar dataKey="Comments" fill="#82ca9d" />
                <Bar dataKey="Shares" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audience Growth</CardTitle>
            <CardDescription>
              Total and new followers over time
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={audienceGrowthData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="Total" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="New" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Calendar</CardTitle>
          <CardDescription>
            Content publishing and engagement heatmap
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-3">
            <Calendar className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-lg font-medium">Calendar View Coming Soon</h3>
            <p className="text-center text-muted-foreground">
              Our team is working on an interactive calendar view to help you visualize your content schedule and performance.
            </p>
            <Button variant="outline" className="mt-2">Notify Me When Available</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default OverviewDashboard;
