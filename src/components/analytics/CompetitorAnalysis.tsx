import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, BarChart, ResponsiveContainer, 
  Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { 
  Search, Plus, ArrowUpDown, TrendingUp, TrendingDown, 
  Info, ExternalLink, BarChart2, Users, ThumbsUp, 
  MessageCircle, Eye, Share2, Check, X
} from 'lucide-react';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

const competitors = [
  { 
    id: 1, 
    name: 'BrandX', 
    instagram: '@brandx', 
    followers: 125000, 
    engagement: 4.2, 
    postFrequency: 5.3,
    contentQuality: 'High',
    status: 'tracked'
  },
  { 
    id: 2, 
    name: 'CompetitorY', 
    instagram: '@competitory', 
    followers: 89000, 
    engagement: 3.8, 
    postFrequency: 3.7,
    contentQuality: 'Medium',
    status: 'tracked'
  },
  { 
    id: 3, 
    name: 'RivalZ', 
    instagram: '@rivalz', 
    followers: 215000, 
    engagement: 5.3, 
    postFrequency: 7.1,
    contentQuality: 'High',
    status: 'tracked'
  },
  { 
    id: 4, 
    name: 'IndustryLeader', 
    instagram: '@industryleader', 
    followers: 450000, 
    engagement: 4.8, 
    postFrequency: 4.2,
    contentQuality: 'Very High',
    status: 'not-tracked'
  },
  { 
    id: 5, 
    name: 'NewPlayer', 
    instagram: '@newplayer', 
    followers: 42000, 
    engagement: 6.2, 
    postFrequency: 8.5,
    contentQuality: 'Medium',
    status: 'not-tracked'
  },
];

const followerComparisonData = [
  { month: 'Jan', "Your Brand": 4000, "BrandX": 6000, "CompetitorY": 3800, "RivalZ": 9000 },
  { month: 'Feb', "Your Brand": 4500, "BrandX": 6400, "CompetitorY": 4100, "RivalZ": 9200 },
  { month: 'Mar', "Your Brand": 5000, "BrandX": 6800, "CompetitorY": 4300, "RivalZ": 9500 },
  { month: 'Apr', "Your Brand": 5700, "BrandX": 7200, "CompetitorY": 4500, "RivalZ": 9800 },
  { month: 'May', "Your Brand": 6400, "BrandX": 7500, "CompetitorY": 4700, "RivalZ": 10200 },
  { month: 'Jun', "Your Brand": 7200, "BrandX": 7800, "CompetitorY": 5000, "RivalZ": 10500 },
];

const engagementComparisonData = [
  { month: 'Jan', "Your Brand": 3.5, "BrandX": 4.1, "CompetitorY": 3.2, "RivalZ": 5.0 },
  { month: 'Feb', "Your Brand": 3.7, "BrandX": 4.2, "CompetitorY": 3.5, "RivalZ": 5.1 },
  { month: 'Mar', "Your Brand": 3.8, "BrandX": 4.0, "CompetitorY": 3.4, "RivalZ": 5.2 },
  { month: 'Apr', "Your Brand": 4.0, "BrandX": 3.9, "CompetitorY": 3.6, "RivalZ": 5.3 },
  { month: 'May', "Your Brand": 4.3, "BrandX": 4.2, "CompetitorY": 3.7, "RivalZ": 5.2 },
  { month: 'Jun', "Your Brand": 4.6, "BrandX": 4.4, "CompetitorY": 3.8, "RivalZ": 5.1 },
];

const contentAnalysisData = [
  { category: 'Product Posts', "Your Brand": 40, "Average Competitor": 35 },
  { category: 'Educational', "Your Brand": 15, "Average Competitor": 25 },
  { category: 'User-Generated', "Your Brand": 10, "Average Competitor": 20 },
  { category: 'Behind-the-Scenes', "Your Brand": 5, "Average Competitor": 10 },
  { category: 'Promotional', "Your Brand": 30, "Average Competitor": 10 },
];

const topPerformingCompetitorContent = [
  {
    id: 1,
    competitor: 'RivalZ',
    title: 'Summer Collection Preview',
    type: 'Carousel',
    engagement: 12.4,
    impressions: 128500,
    reactions: 24600,
    comments: 1830,
    shares: 4250,
  },
  {
    id: 2,
    competitor: 'BrandX',
    title: 'Customer Success Story',
    type: 'Video',
    engagement: 10.8,
    impressions: 98700,
    reactions: 18900,
    comments: 1450,
    shares: 3280,
  },
  {
    id: 3,
    competitor: 'CompetitorY',
    title: 'Behind the Scenes Factory Tour',
    type: 'Video',
    engagement: 9.7,
    impressions: 76500,
    reactions: 14200,
    comments: 865,
    shares: 2340,
  },
  {
    id: 4,
    competitor: 'RivalZ',
    title: 'Employee Spotlight Series',
    type: 'Carousel',
    engagement: 8.9,
    impressions: 82400,
    reactions: 15600,
    comments: 920,
    shares: 1870,
  },
  {
    id: 5,
    competitor: 'BrandX',
    title: 'Product Tutorial',
    type: 'Video',
    engagement: 8.2,
    impressions: 64300,
    reactions: 12800,
    comments: 785,
    shares: 1640,
  },
];

interface CompetitorAnalysisProps {
  platform: string;
  timeRange: string;
}

const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({ platform, timeRange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('followers');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [trackedCompetitors, setTrackedCompetitors] = useState<number[]>([1, 2, 3]);
  const [comparisonMetric, setComparisonMetric] = useState('followers');

  const filteredCompetitors = competitors.filter(competitor => 
    competitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    competitor.instagram.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCompetitors = [...filteredCompetitors].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortColumn] > b[sortColumn] ? 1 : -1;
    } else {
      return a[sortColumn] < b[sortColumn] ? 1 : -1;
    }
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const toggleTracking = (id: number) => {
    if (trackedCompetitors.includes(id)) {
      setTrackedCompetitors(trackedCompetitors.filter(cid => cid !== id));
    } else {
      setTrackedCompetitors([...trackedCompetitors, id]);
    }
  };

  const formatNumber = (num: string | number): string => {
    if (Array.isArray(num)) {
      num = num[0];
    }
    
    const numValue = typeof num === 'string' ? parseFloat(num) : num;
    return numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const renderComparisonChart = () => {
    if (comparisonMetric === 'followers') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={followerComparisonData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => formatNumber(value)} />
            <Legend />
            <Line type="monotone" dataKey="Your Brand" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="BrandX" stroke="#82ca9d" strokeWidth={2} />
            <Line type="monotone" dataKey="CompetitorY" stroke="#ffc658" strokeWidth={2} />
            <Line type="monotone" dataKey="RivalZ" stroke="#ff8042" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={engagementComparisonData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
            <Line type="monotone" dataKey="Your Brand" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="BrandX" stroke="#82ca9d" strokeWidth={2} />
            <Line type="monotone" dataKey="CompetitorY" stroke="#ffc658" strokeWidth={2} />
            <Line type="monotone" dataKey="RivalZ" stroke="#ff8042" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Competitor Tracking</CardTitle>
              <CardDescription>Monitor and analyze your competitors' social media presence</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search competitors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Competitor
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Status</TableHead>
                  <TableHead>Competitor</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('followers')}
                  >
                    <div className="flex items-center gap-1">
                      Followers
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('engagement')}
                  >
                    <div className="flex items-center gap-1">
                      Engagement Rate
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('postFrequency')}
                  >
                    <div className="flex items-center gap-1">
                      Posts/Week
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Content Quality</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCompetitors.map((competitor) => (
                  <TableRow key={competitor.id}>
                    <TableCell>
                      {trackedCompetitors.includes(competitor.id) ? (
                        <Badge className="bg-green-500 hover:bg-green-600">Tracked</Badge>
                      ) : (
                        <Badge variant="outline">Not Tracked</Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{competitor.name}</TableCell>
                    <TableCell>{competitor.instagram}</TableCell>
                    <TableCell>{formatNumber(competitor.followers)}</TableCell>
                    <TableCell>{competitor.engagement}%</TableCell>
                    <TableCell>{competitor.postFrequency}</TableCell>
                    <TableCell>{competitor.contentQuality}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant={trackedCompetitors.includes(competitor.id) ? "destructive" : "default"} 
                        size="sm"
                        onClick={() => toggleTracking(competitor.id)}
                      >
                        {trackedCompetitors.includes(competitor.id) ? (
                          <>
                            <X className="h-4 w-4 mr-1" />
                            Stop Tracking
                          </>
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Track
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Your Position</CardTitle>
            <CardDescription>Ranking against top competitors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                    <div className="font-medium">10,200</div>
                  </div>
                </div>
                <Badge>
                  <span className="flex items-center">
                    <span className="font-medium mr-1">4th</span>
                    <span className="text-xs text-muted-foreground">of 5</span>
                  </span>
                </Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full">
                    <ThumbsUp className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Engagement Rate</div>
                    <div className="font-medium">4.6%</div>
                  </div>
                </div>
                <Badge>
                  <span className="flex items-center">
                    <span className="font-medium mr-1">3rd</span>
                    <span className="text-xs text-muted-foreground">of 5</span>
                  </span>
                </Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-full">
                    <BarChart2 className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Content Volume</div>
                    <div className="font-medium">5.8 posts/week</div>
                  </div>
                </div>
                <Badge>
                  <span className="flex items-center">
                    <span className="font-medium mr-1">3rd</span>
                    <span className="text-xs text-muted-foreground">of 5</span>
                  </span>
                </Badge>
              </div>
              
              <div className="flex justify-between items-center p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded-full">
                    <Eye className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Growth Rate</div>
                    <div className="font-medium">+12.5% monthly</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Badge variant="secondary" className="mr-2">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Fastest Growing
                  </Badge>
                  <Badge>
                    <span className="flex items-center">
                      <span className="font-medium mr-1">1st</span>
                      <span className="text-xs text-muted-foreground">of 5</span>
                    </span>
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Competitor Comparison</CardTitle>
                <CardDescription>Track performance over time</CardDescription>
              </div>
              <Select value={comparisonMetric} onValueChange={setComparisonMetric}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="followers">Followers</SelectItem>
                  <SelectItem value="engagement">Engagement Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {renderComparisonChart()}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Content Strategy Analysis</CardTitle>
            <CardDescription>Content type comparison with competitors</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={contentAnalysisData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="category" />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="Your Brand" fill="#8884d8" />
                <Bar dataKey="Average Competitor" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Key Insights</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>You post 3x more promotional content than your competitors, which might explain lower engagement rates.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Competitors share 2x more educational and user-generated content, which typically leads to higher engagement.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Behind-the-scenes content is underutilized compared to competitors, representing an opportunity.</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Competitor Content</CardTitle>
            <CardDescription>Most engaging posts from your competitors</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <div className="p-4 space-y-4">
                {topPerformingCompetitorContent.map((content) => (
                  <div key={content.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Badge variant="outline" className="mb-2">{content.competitor}</Badge>
                        <h3 className="font-medium">{content.title}</h3>
                      </div>
                      <Badge>{content.type}</Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mt-4">
                      <div>
                        <div className="flex items-center text-muted-foreground mb-1">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          <span>Reactions</span>
                        </div>
                        <span className="font-medium">{formatNumber(content.reactions)}</span>
                      </div>
                      <div>
                        <div className="flex items-center text-muted-foreground mb-1">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          <span>Comments</span>
                        </div>
                        <span className="font-medium">{formatNumber(content.comments)}</span>
                      </div>
                      <div>
                        <div className="flex items-center text-muted-foreground mb-1">
                          <Share2 className="h-3 w-3 mr-1" />
                          <span>Shares</span>
                        </div>
                        <span className="font-medium">{formatNumber(content.shares)}</span>
                      </div>
                      <div>
                        <div className="flex items-center text-muted-foreground mb-1">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          <span>Engagement</span>
                        </div>
                        <span className="font-medium">{content.engagement}%</span>
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button variant="outline" size="sm" className="gap-1">
                        <ExternalLink className="h-3 w-3" />
                        View Post
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Competitive Advantage Analysis</CardTitle>
          <CardDescription>Assessment of your strengths and weaknesses compared to competitors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-lg mb-3">Strengths</h3>
              <div className="space-y-3">
                <div className="flex p-3 border rounded-md">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30 mr-3">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Highest Growth Rate</h4>
                    <p className="text-sm text-muted-foreground">
                      Your follower growth rate of 12.5% monthly is the highest among competitors,
                      indicating strong audience acquisition.
                    </p>
                  </div>
                </div>
                <div className="flex p-3 border rounded-md">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30 mr-3">
                    <MessageCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Higher Comment Engagement</h4>
                    <p className="text-sm text-muted-foreground">
                      Your posts receive 28% more comments per follower than competitors,
                      suggesting stronger community interaction.
                    </p>
                  </div>
                </div>
                <div className="flex p-3 border rounded-md">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30 mr-3">
                    <BarChart2 className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Consistent Posting Schedule</h4>
                    <p className="text-sm text-muted-foreground">
                      You maintain a more consistent posting schedule than 70% of competitors,
                      which helps with algorithm visibility.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-3">Opportunities for Improvement</h3>
              <div className="space-y-3">
                <div className="flex p-3 border rounded-md">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 mr-3">
                    <Info className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Content Diversity</h4>
                    <p className="text-sm text-muted-foreground">
                      Competitors utilize a wider variety of content formats. Consider increasing
                      educational content (currently 10% below competitor average).
                    </p>
                  </div>
                </div>
                <div className="flex p-3 border rounded-md">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 mr-3">
                    <Info className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">User-Generated Content</h4>
                    <p className="text-sm text-muted-foreground">
                      Competitors leverage UGC at 2x your rate. Implementing UGC campaigns
                      could significantly boost engagement and authenticity.
                    </p>
                  </div>
                </div>
                <div className="flex p-3 border rounded-md">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 mr-3">
                    <Info className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">Response Rate</h4>
                    <p className="text-sm text-muted-foreground">
                      Your comment response rate (45%) is below the competitor average (72%).
                      Increasing engagement with followers could improve community sentiment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            Generate Detailed Competitive Analysis Report
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default CompetitorAnalysis;
