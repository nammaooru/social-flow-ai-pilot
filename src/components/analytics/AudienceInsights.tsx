
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, PieChart, LineChart, ResponsiveContainer, 
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, 
  Pie, Cell
} from 'recharts';
import { 
  Users, MapPin, Globe, Clock, Calendar, BarChart2,
  TrendingUp, TrendingDown
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for audience insights
const genderData = [
  { name: 'Women', value: 58 },
  { name: 'Men', value: 40 },
  { name: 'Non-binary', value: 2 },
];

const ageData = [
  { name: '13-17', value: 5 },
  { name: '18-24', value: 25 },
  { name: '25-34', value: 38 },
  { name: '35-44', value: 18 },
  { name: '45-54', value: 8 },
  { name: '55+', value: 6 },
];

const locationData = [
  { name: 'United States', value: 42 },
  { name: 'United Kingdom', value: 12 },
  { name: 'Canada', value: 8 },
  { name: 'Australia', value: 7 },
  { name: 'Germany', value: 6 },
  { name: 'France', value: 5 },
  { name: 'Other', value: 20 },
];

const growthData = [
  { date: '2023-01', followers: 3000 },
  { date: '2023-02', followers: 3200 },
  { date: '2023-03', followers: 3800 },
  { date: '2023-04', followers: 4200 },
  { date: '2023-05', followers: 4500 },
  { date: '2023-06', followers: 5100 },
  { date: '2023-07', followers: 6000 },
  { date: '2023-08', followers: 7200 },
  { date: '2023-09', followers: 8000 },
  { date: '2023-10', followers: 8800 },
  { date: '2023-11', followers: 9500 },
  { date: '2023-12', followers: 10200 },
];

const activityData = [
  { hour: '00:00', activity: 10 },
  { hour: '02:00', activity: 5 },
  { hour: '04:00', activity: 3 },
  { hour: '06:00', activity: 7 },
  { hour: '08:00', activity: 25 },
  { hour: '10:00', activity: 40 },
  { hour: '12:00', activity: 65 },
  { hour: '14:00', activity: 52 },
  { hour: '16:00', activity: 48 },
  { hour: '18:00', activity: 72 },
  { hour: '20:00', activity: 85 },
  { hour: '22:00', activity: 45 },
];

const interestsData = [
  { name: 'Fashion', value: 32 },
  { name: 'Technology', value: 24 },
  { name: 'Travel', value: 18 },
  { name: 'Food & Drink', value: 14 },
  { name: 'Fitness', value: 8 },
  { name: 'Beauty', value: 4 },
];

// Colors for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface AudienceInsightsProps {
  platform: string;
  timeRange: string;
}

const AudienceInsights: React.FC<AudienceInsightsProps> = ({ platform, timeRange }) => {
  const [demographicsTab, setDemographicsTab] = useState('gender');
  const [locationView, setLocationView] = useState('countries');

  // Format numbers with commas
  const formatNumber = (num: number | string): string => {
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    return numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Calculate follower growth
  const currentFollowers = growthData[growthData.length - 1].followers;
  const previousFollowers = growthData[growthData.length - 2].followers;
  const followerGrowth = currentFollowers - previousFollowers;
  const growthPercentage = ((followerGrowth / previousFollowers) * 100).toFixed(1);
  
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Followers</CardTitle>
            <CardDescription>Across all platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-3xl font-bold">{formatNumber(currentFollowers)}</span>
                <div className="flex items-center text-sm text-green-500 mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+{growthPercentage}% from last month</span>
                </div>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">New Followers</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-3xl font-bold">+{formatNumber(followerGrowth)}</span>
                <div className="flex items-center text-sm text-green-500 mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+12.2% compared to previous</span>
                </div>
              </div>
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-full">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Demographics</CardTitle>
            <CardDescription>Top age and gender</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-3xl font-bold">25-34</span>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <span>{genderData[0].name}, {genderData[0].value}%</span>
                </div>
              </div>
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Top Location</CardTitle>
            <CardDescription>Most followers from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-3xl font-bold">{locationData[0].name}</span>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <span>{locationData[0].value}% of audience</span>
                </div>
              </div>
              <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-full">
                <MapPin className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Follower Growth</CardTitle>
            <CardDescription>
              Growth trends over the past 12 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={growthData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date"
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleString('default', { month: 'short' });
                    }} 
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${formatNumber(value)} followers`, 'Total Followers']}
                    labelFormatter={(label) => {
                      const date = new Date(label);
                      return date.toLocaleString('default', { month: 'long', year: 'numeric' });
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="followers" 
                    name="Followers" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audience Activity</CardTitle>
            <CardDescription>
              When your audience is most active online
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activityData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="hour" 
                    label={{ value: 'Time (24hr)', position: 'insideBottom', offset: -5 }} 
                  />
                  <YAxis 
                    label={{ value: 'Activity Level (%)', angle: -90, position: 'insideLeft' }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="activity" name="Activity Level" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2">
              <Badge className="mt-2">
                <Clock className="mr-1 h-3 w-3" />
                Optimal posting time: 20:00 (8:00 PM)
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Demographics</CardTitle>
                <CardDescription>Gender and age breakdown</CardDescription>
              </div>
              <Tabs value={demographicsTab} onValueChange={setDemographicsTab} className="h-8">
                <TabsList className="grid w-[180px] grid-cols-2">
                  <TabsTrigger value="gender">Gender</TabsTrigger>
                  <TabsTrigger value="age">Age</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="gender" className="mt-0 p-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="age" className="mt-0 p-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ageData}
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
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="value" name="Percentage" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Key Insights</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  {demographicsTab === 'gender' ? (
                    <span>Your audience is predominantly women (58%), which is 12% higher than the platform average.</span>
                  ) : (
                    <span>25-34 age group represents your largest audience segment (38%), followed by 18-24 (25%).</span>
                  )}
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  {demographicsTab === 'gender' ? (
                    <span>Recent campaigns have increased male audience engagement by 5% over the last quarter.</span>
                  ) : (
                    <span>Consider tailoring content for the 25-34 demographic to maximize engagement.</span>
                  )}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Audience Location</CardTitle>
                <CardDescription>Geographic distribution</CardDescription>
              </div>
              <Tabs value={locationView} onValueChange={setLocationView} className="h-8">
                <TabsList className="grid w-[180px] grid-cols-2">
                  <TabsTrigger value="countries">Countries</TabsTrigger>
                  <TabsTrigger value="cities">Cities</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={locationData}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 60,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Bar dataKey="value" name="Percentage" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Regional Insights</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Content Localization</span>
                    <span>60% Complete</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Region-specific Campaigns</span>
                    <span>35% Complete</span>
                  </div>
                  <Progress value={35} className="h-2" />
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Globe className="mr-2 h-4 w-4" />
                View Detailed Geographic Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Audience Interests</CardTitle>
          <CardDescription>Topics and categories your followers are interested in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={interestsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {interestsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium mb-4">Content Recommendations Based on Interests</h3>
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium flex items-center mb-2">
                    <Badge className="mr-2">Primary</Badge>
                    Fashion (32%)
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your audience is highly interested in fashion content. Consider sharing more style guides, 
                    trend updates, and fashion inspiration posts to increase engagement.
                  </p>
                  <div className="text-sm">
                    <span className="font-medium">Suggested Topics:</span> Seasonal trends, outfit inspiration, 
                    sustainable fashion, style tips
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium flex items-center mb-2">
                    <Badge variant="secondary" className="mr-2">Secondary</Badge>
                    Technology (24%)
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    A significant portion of your audience is interested in technology. Content focusing on tech 
                    news, gadget reviews, and digital trends could resonate well.
                  </p>
                  <div className="text-sm">
                    <span className="font-medium">Suggested Topics:</span> Tech news, product reviews, 
                    digital lifestyle, productivity tools
                  </div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium flex items-center mb-2">
                    <Badge variant="outline" className="mr-2">Tertiary</Badge>
                    Travel (18%)
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Travel content performs well with a portion of your audience. Destination guides, travel 
                    tips, and adventure stories could increase engagement.
                  </p>
                  <div className="text-sm">
                    <span className="font-medium">Suggested Topics:</span> Destination guides, travel tips, 
                    packing essentials, adventure stories
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AudienceInsights;
