
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, LineChart, PieChart, ResponsiveContainer, 
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, 
  Pie, Cell, Sector
} from 'recharts';
import { 
  MessageCircle, Heart, Share2, ExternalLink, 
  Clock, Bookmark, ThumbsUp, Info, Pin, TrendingUp, TrendingDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';

// Mock data for engagement metrics
const engagementByPlatform = [
  { name: 'Instagram', value: 42 },
  { name: 'Facebook', value: 28 },
  { name: 'Twitter', value: 18 },
  { name: 'LinkedIn', value: 12 },
];

const engagementByType = [
  { name: 'Likes', value: 60 },
  { name: 'Comments', value: 25 },
  { name: 'Shares', value: 10 },
  { name: 'Saves', value: 5 },
];

const engagementTrend = [
  { name: 'Mon', likes: 1200, comments: 300, shares: 200 },
  { name: 'Tue', likes: 1400, comments: 350, shares: 180 },
  { name: 'Wed', likes: 1800, comments: 400, shares: 250 },
  { name: 'Thu', likes: 1600, comments: 380, shares: 220 },
  { name: 'Fri', likes: 2000, comments: 450, shares: 280 },
  { name: 'Sat', likes: 2400, comments: 500, shares: 320 },
  { name: 'Sun', likes: 2200, comments: 480, shares: 300 },
];

const topPerformingContent = [
  { 
    id: 1, 
    title: 'Summer Collection Launch', 
    platform: 'Instagram', 
    type: 'Image', 
    likes: 3245, 
    comments: 432, 
    shares: 312, 
    engagementRate: '8.2%' 
  },
  { 
    id: 2, 
    title: 'Customer Testimonial Video', 
    platform: 'Facebook', 
    type: 'Video', 
    likes: 2145, 
    comments: 321, 
    shares: 287, 
    engagementRate: '7.1%' 
  },
  { 
    id: 3, 
    title: 'Product Tutorial', 
    platform: 'LinkedIn', 
    type: 'Video', 
    likes: 1432, 
    comments: 214, 
    shares: 142, 
    engagementRate: '6.4%' 
  },
  { 
    id: 4, 
    title: 'Behind the Scenes', 
    platform: 'Instagram', 
    type: 'Carousel', 
    likes: 1876, 
    comments: 312, 
    shares: 98, 
    engagementRate: '5.9%' 
  },
  { 
    id: 5, 
    title: 'Industry News Update', 
    platform: 'Twitter', 
    type: 'Text', 
    likes: 876, 
    comments: 128, 
    shares: 234, 
    engagementRate: '5.2%' 
  },
];

// Best times to post data
const bestTimesData = [
  { day: 'Monday', time: '9:00 AM', engagementScore: 85 },
  { day: 'Monday', time: '6:00 PM', engagementScore: 82 },
  { day: 'Wednesday', time: '12:00 PM', engagementScore: 90 },
  { day: 'Thursday', time: '8:00 AM', engagementScore: 78 },
  { day: 'Friday', time: '7:00 PM', engagementScore: 88 },
  { day: 'Saturday', time: '11:00 AM', engagementScore: 92 },
  { day: 'Sunday', time: '3:00 PM', engagementScore: 84 },
];

// Colors for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Custom Active Shape for PieChart
const renderActiveShape = (props) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value } = props;
  const sin = Math.sin(-midAngle * Math.PI / 180);
  const cos = Math.cos(-midAngle * Math.PI / 180);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

interface EngagementMetricsProps {
  platform: string;
  timeRange: string;
}

const EngagementMetrics: React.FC<EngagementMetricsProps> = ({ platform, timeRange }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIndexType, setActiveIndexType] = useState(0);
  const [engagementView, setEngagementView] = useState('trend');
  const [contentFilter, setContentFilter] = useState('all');

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieEnterType = (_, index) => {
    setActiveIndexType(index);
  };

  // Filter top performing content by platform
  const filteredContent = platform === 'all' 
    ? topPerformingContent 
    : topPerformingContent.filter(item => 
        item.platform.toLowerCase() === platform.toLowerCase()
      );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Engagement Rate</CardTitle>
            <CardDescription>Average across all content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-3xl font-bold">5.4%</span>
                <div className="flex items-center text-sm text-green-500 mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+0.8% from last period</span>
                </div>
              </div>
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-full">
                <ThumbsUp className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Interactions</CardTitle>
            <CardDescription>Sum of all engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-3xl font-bold">42,586</span>
                <div className="flex items-center text-sm text-green-500 mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+12.3% from last period</span>
                </div>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                <MessageCircle className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Click-Through Rate</CardTitle>
            <CardDescription>Average for posts with links</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-3xl font-bold">2.7%</span>
                <div className="flex items-center text-sm text-red-500 mt-1">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span>-0.3% from last period</span>
                </div>
              </div>
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                <ExternalLink className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Engagement by Platform</CardTitle>
                <CardDescription>Distribution across social networks</CardDescription>
              </div>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={engagementByPlatform}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                  >
                    {engagementByPlatform.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Engagement by Type</CardTitle>
                <CardDescription>Breakdown of interaction types</CardDescription>
              </div>
              <Tabs 
                value={engagementView} 
                onValueChange={setEngagementView}
                className="h-9"
              >
                <TabsList className="grid w-[220px] grid-cols-2">
                  <TabsTrigger value="trend">Trend</TabsTrigger>
                  <TabsTrigger value="distribution">Distribution</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="trend" className="mt-0 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={engagementTrend}
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
                  <Line 
                    type="monotone" 
                    dataKey="likes" 
                    name="Likes" 
                    stroke="#8884d8" 
                    strokeWidth={2} 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="comments" 
                    name="Comments" 
                    stroke="#82ca9d" 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="shares" 
                    name="Shares" 
                    stroke="#ffc658" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="distribution" className="mt-0 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndexType}
                    activeShape={renderActiveShape}
                    data={engagementByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnterType}
                  >
                    {engagementByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>Posts with highest engagement rates</CardDescription>
            </div>
            <Select value={contentFilter} onValueChange={setContentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Content Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Content</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="carousel">Carousels</SelectItem>
                <SelectItem value="text">Text Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Content</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Shares</TableHead>
                <TableHead className="text-right">Engagement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContent.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex gap-2 items-center">
                      <Pin className="h-4 w-4 text-muted-foreground" />
                      <span>{item.title}</span>
                      <Badge variant="outline" className="ml-2">
                        {item.type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{item.platform}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-red-500" />
                      {item.likes.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3 text-blue-500" />
                      {item.comments.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Share2 className="h-3 w-3 text-green-500" />
                      {item.shares.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{item.engagementRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" size="sm">
            Previous
          </Button>
          <Button variant="ghost" size="sm">
            Next
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Best Times to Post</CardTitle>
            <CardDescription>Optimal posting schedule based on audience activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bestTimesData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 30,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    label={{ value: 'Time', position: 'insideBottom', dy: 20 }} 
                  />
                  <YAxis 
                    label={{ value: 'Engagement Score', angle: -90, position: 'insideLeft' }} 
                  />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="engagementScore" 
                    name="Engagement Score" 
                    fill="#8884d8" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Recommended Posting Times</h4>
              <div className="space-y-2">
                {bestTimesData.slice(0, 3).map((slot, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{slot.day}</span>
                      <span className="text-muted-foreground">{slot.time}</span>
                    </div>
                    <Badge variant="secondary">Score: {slot.engagementScore}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Recommendations</CardTitle>
            <CardDescription>Suggested content types based on engagement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/40">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-500 hover:bg-blue-600">High Impact</Badge>
                <h3 className="font-medium">Video Tutorials</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Video tutorials showing product usage have 2.3x higher engagement than other content types.
                Consider posting more educational content.
              </p>
              <div className="flex gap-2 mt-3">
                <Badge variant="outline">+254% Comments</Badge>
                <Badge variant="outline">+154% Shares</Badge>
              </div>
            </div>
            
            <div className="p-4 border rounded-md bg-muted/40">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-green-500 hover:bg-green-600">Medium Impact</Badge>
                <h3 className="font-medium">Behind-the-scenes Content</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Posts showing behind-the-scenes aspects of your business receive 1.7x more engagement.
                This type of content builds authenticity and trust.
              </p>
              <div className="flex gap-2 mt-3">
                <Badge variant="outline">+124% Likes</Badge>
                <Badge variant="outline">+87% Comments</Badge>
              </div>
            </div>
            
            <div className="p-4 border rounded-md bg-muted/40">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-amber-500 hover:bg-amber-600">Medium Impact</Badge>
                <h3 className="font-medium">User-generated Content</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Sharing content created by your customers increases trust and relatability.
                This content type receives 1.5x more engagement on average.
              </p>
              <div className="flex gap-2 mt-3">
                <Badge variant="outline">+95% Comments</Badge>
                <Badge variant="outline">+112% Saves</Badge>
              </div>
            </div>
            
            <Button className="w-full">
              <Bookmark className="mr-2 h-4 w-4" />
              Get Detailed Content Insights
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EngagementMetrics;
