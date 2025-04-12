
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart2, PieChart, LineChart, TrendingUp, Users, Share2, Calendar, 
  Download, Filter, ArrowUpDown, RefreshCw, FileText, ChevronDown
} from 'lucide-react';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DatePickerWithRange } from '@/components/analytics/DateRangePicker';
import OverviewDashboard from '@/components/analytics/OverviewDashboard';
import EngagementMetrics from '@/components/analytics/EngagementMetrics';
import AudienceInsights from '@/components/analytics/AudienceInsights';
import CompetitorAnalysis from '@/components/analytics/CompetitorAnalysis';
import ReportsGenerator from '@/components/analytics/ReportsGenerator';

const platformFilters = [
  { value: 'all', label: 'All Platforms' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'linkedin', label: 'LinkedIn' }
];

const timeRanges = [
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'last3months', label: 'Last 3 Months' },
  { value: 'last6months', label: 'Last 6 Months' },
  { value: 'lastyear', label: 'Last Year' },
  { value: 'custom', label: 'Custom Range' }
];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [platform, setPlatform] = useState('all');
  const [timeRange, setTimeRange] = useState('last30days');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Analytics</h1>
        <p className="text-muted-foreground">Track performance metrics and gain insights across your social media.</p>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              {platformFilters.map(({ value, label }) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="relative">
            <Select value={timeRange} onValueChange={(value) => {
              setTimeRange(value);
              setShowDatePicker(value === 'custom');
            }}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {showDatePicker && (
              <div className="absolute z-10 mt-2 bg-background border rounded-md shadow-md p-4">
                <DatePickerWithRange onClose={() => setShowDatePicker(false)} />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleRefreshData} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-5 mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart2 size={16} />
            <span className="hidden md:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <TrendingUp size={16} />
            <span className="hidden md:inline">Engagement</span>
          </TabsTrigger>
          <TabsTrigger value="audience" className="flex items-center gap-2">
            <Users size={16} />
            <span className="hidden md:inline">Audience</span>
          </TabsTrigger>
          <TabsTrigger value="competitors" className="flex items-center gap-2">
            <Share2 size={16} />
            <span className="hidden md:inline">Competitors</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText size={16} />
            <span className="hidden md:inline">Reports</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <OverviewDashboard platform={platform} timeRange={timeRange} />
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-6">
          <EngagementMetrics platform={platform} timeRange={timeRange} />
        </TabsContent>
        
        <TabsContent value="audience" className="space-y-6">
          <AudienceInsights platform={platform} timeRange={timeRange} />
        </TabsContent>
        
        <TabsContent value="competitors" className="space-y-6">
          <CompetitorAnalysis platform={platform} timeRange={timeRange} />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <ReportsGenerator platform={platform} timeRange={timeRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
