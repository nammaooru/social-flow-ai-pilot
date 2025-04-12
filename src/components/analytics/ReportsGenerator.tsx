
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Download, Calendar, BarChart2, Users, 
  MessageSquare, PieChart, Globe, Layers, ChevronDown, 
  Check, ArrowRight, RefreshCw
} from 'lucide-react';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DatePickerWithRange } from './DateRangePicker';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

// Mock data for saved reports
const savedReports = [
  {
    id: 1,
    name: 'Monthly Performance Overview',
    description: 'Complete analysis of social media performance',
    created: '2023-11-15',
    type: 'comprehensive',
    schedule: 'monthly',
    platforms: ['instagram', 'facebook', 'twitter'],
    sections: ['engagement', 'audience', 'content', 'growth'],
    lastGenerated: '2023-12-01'
  },
  {
    id: 2,
    name: 'Weekly Content Performance',
    description: 'Analysis of content engagement and reach',
    created: '2023-10-22',
    type: 'focused',
    schedule: 'weekly',
    platforms: ['instagram', 'facebook'],
    sections: ['content', 'engagement'],
    lastGenerated: '2023-12-04'
  },
  {
    id: 3,
    name: 'Quarterly Audience Growth',
    description: 'Detailed analysis of audience demographics and growth',
    created: '2023-09-30',
    type: 'comprehensive',
    schedule: 'quarterly',
    platforms: ['all'],
    sections: ['audience', 'growth', 'competitor'],
    lastGenerated: '2023-10-01'
  },
  {
    id: 4,
    name: 'Competitor Comparison',
    description: 'Side-by-side analysis with top competitors',
    created: '2023-11-10',
    type: 'specialized',
    schedule: 'monthly',
    platforms: ['instagram', 'linkedin'],
    sections: ['competitor', 'content', 'engagement'],
    lastGenerated: '2023-12-01'
  },
  {
    id: 5,
    name: 'Custom Campaign Report',
    description: 'Performance metrics for the Summer Campaign',
    created: '2023-11-28',
    type: 'custom',
    schedule: 'once',
    platforms: ['instagram', 'facebook', 'twitter'],
    sections: ['engagement', 'content', 'conversion'],
    lastGenerated: '2023-11-28'
  }
];

// Report section options
const reportSections = [
  { id: 'overview', label: 'Overview Dashboard', icon: <BarChart2 className="h-4 w-4" /> },
  { id: 'engagement', label: 'Engagement Metrics', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'audience', label: 'Audience Insights', icon: <Users className="h-4 w-4" /> },
  { id: 'content', label: 'Content Performance', icon: <Layers className="h-4 w-4" /> },
  { id: 'growth', label: 'Growth Analysis', icon: <FileText className="h-4 w-4" /> },
  { id: 'competitor', label: 'Competitor Analysis', icon: <PieChart className="h-4 w-4" /> },
  { id: 'geography', label: 'Geographic Distribution', icon: <Globe className="h-4 w-4" /> }
];

// Platform options
const platformOptions = [
  { id: 'all', label: 'All Platforms', color: 'bg-gray-500' },
  { id: 'instagram', label: 'Instagram', color: 'bg-pink-500' },
  { id: 'facebook', label: 'Facebook', color: 'bg-blue-600' },
  { id: 'twitter', label: 'Twitter', color: 'bg-blue-400' },
  { id: 'linkedin', label: 'LinkedIn', color: 'bg-blue-800' }
];

// Export format options
const exportFormats = [
  { id: 'pdf', label: 'PDF Document', icon: 'pdf' },
  { id: 'excel', label: 'Excel Spreadsheet', icon: 'excel' },
  { id: 'ppt', label: 'PowerPoint Presentation', icon: 'ppt' },
  { id: 'csv', label: 'CSV Data File', icon: 'csv' }
];

interface ReportsGeneratorProps {
  platform: string;
  timeRange: string;
}

const ReportsGenerator: React.FC<ReportsGeneratorProps> = ({ platform, timeRange }) => {
  const [activeTab, setActiveTab] = useState('saved');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedReport, setSelectedReport] = useState<number | null>(null);
  
  // New report form state
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['all']);
  const [selectedSections, setSelectedSections] = useState<string[]>(['overview', 'engagement']);
  const [reportSchedule, setReportSchedule] = useState('once');
  const [exportFormat, setExportFormat] = useState('pdf');
  
  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setGenerationProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          setGenerationProgress(0);
        }, 500);
      }
    }, 300);
  };

  const toggleSection = (sectionId: string) => {
    if (selectedSections.includes(sectionId)) {
      setSelectedSections(selectedSections.filter(id => id !== sectionId));
    } else {
      setSelectedSections([...selectedSections, sectionId]);
    }
  };

  const togglePlatform = (platformId: string) => {
    if (platformId === 'all') {
      setSelectedPlatforms(['all']);
      return;
    }
    
    // Remove 'all' if it exists
    const newSelection = selectedPlatforms.filter(p => p !== 'all');
    
    if (newSelection.includes(platformId)) {
      setSelectedPlatforms(newSelection.filter(id => id !== platformId));
    } else {
      setSelectedPlatforms([...newSelection, platformId]);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-2/3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Report Manager</CardTitle>
                <CardDescription>Create, customize, and schedule analytics reports</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={activeTab === 'saved' ? 'default' : 'outline'} 
                  onClick={() => setActiveTab('saved')}
                >
                  Saved Reports
                </Button>
                <Button 
                  variant={activeTab === 'create' ? 'default' : 'outline'} 
                  onClick={() => setActiveTab('create')}
                >
                  Create New
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === 'saved' ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <Input 
                    placeholder="Search reports..." 
                    className="max-w-xs"
                  />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Report Types</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive</SelectItem>
                      <SelectItem value="focused">Focused</SelectItem>
                      <SelectItem value="specialized">Specialized</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  {savedReports.map((report) => (
                    <div 
                      key={report.id} 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedReport === report.id ? 'border-primary bg-muted/50' : 'hover:border-muted-foreground/50'
                      }`}
                      onClick={() => setSelectedReport(report.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <h3 className="font-medium">{report.name}</h3>
                            <Badge variant="outline" className="ml-2">
                              {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                          <div className="flex gap-1 flex-wrap">
                            {report.platforms.map((platform) => (
                              <Badge 
                                key={platform} 
                                variant="secondary"
                                className="text-xs"
                              >
                                {platform === 'all' ? 'All Platforms' : platform.charAt(0).toUpperCase() + platform.slice(1)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground mb-1">
                            {report.schedule === 'once' ? 'One-time report' : `${report.schedule.charAt(0).toUpperCase() + report.schedule.slice(1)} schedule`}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Last generated: {new Date(report.lastGenerated).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-name">Report Name</Label>
                    <Input 
                      id="report-name" 
                      placeholder="E.g., Monthly Performance Overview" 
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="report-schedule">Schedule</Label>
                    <Select value={reportSchedule} onValueChange={setReportSchedule}>
                      <SelectTrigger id="report-schedule">
                        <SelectValue placeholder="How often to generate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">One-time Report</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="report-description">Description</Label>
                  <Input 
                    id="report-description" 
                    placeholder="Brief description of what this report contains" 
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                  />
                </div>
                
                <div className="space-y-3 mt-6">
                  <Label>Data Range</Label>
                  <DatePickerWithRange className="max-w-md" />
                </div>

                <div className="space-y-3 mt-6">
                  <Label>Platforms to Include</Label>
                  <div className="flex flex-wrap gap-2">
                    {platformOptions.map((option) => (
                      <Badge 
                        key={option.id}
                        variant={selectedPlatforms.includes(option.id) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => togglePlatform(option.id)}
                      >
                        <div className={`h-2 w-2 rounded-full mr-1 ${option.color}`}></div>
                        {option.label}
                        {selectedPlatforms.includes(option.id) && (
                          <Check className="ml-1 h-3 w-3" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3 mt-6">
                  <Label>Report Sections</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {reportSections.map((section) => (
                      <div 
                        key={section.id}
                        className={`flex items-center p-2 border rounded-md cursor-pointer ${
                          selectedSections.includes(section.id) ? 'border-primary bg-muted/50' : ''
                        }`}
                        onClick={() => toggleSection(section.id)}
                      >
                        <Checkbox 
                          checked={selectedSections.includes(section.id)}
                          onCheckedChange={() => toggleSection(section.id)}
                          className="mr-2"
                        />
                        <div className="flex items-center">
                          <span className="mr-2">{section.icon}</span>
                          <span>{section.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3 mt-6">
                  <Label>Export Format</Label>
                  <div className="flex gap-3">
                    {exportFormats.map((format) => (
                      <div 
                        key={format.id}
                        className={`flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer ${
                          exportFormat === format.id ? 'border-primary bg-muted/50' : ''
                        }`}
                        onClick={() => setExportFormat(format.id)}
                      >
                        <div className="h-8 w-8 flex items-center justify-center bg-muted rounded-full mb-2">
                          <FileText className="h-4 w-4" />
                        </div>
                        <span className="text-sm">{format.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            {activeTab === 'saved' ? (
              <>
                <Button variant="outline">
                  Clone Selected
                </Button>
                <Button variant="outline">
                  Edit Selected
                </Button>
                <Button 
                  onClick={handleGenerateReport} 
                  disabled={isGenerating || selectedReport === null}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline">
                  Save as Template
                </Button>
                <Button onClick={handleGenerateReport} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
              </>
            )}
          </CardFooter>
        </Card>

        <Card className="md:w-1/3">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Download or share previously generated reports</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[460px] pr-4">
              <div className="space-y-4">
                {savedReports.slice().reverse().map((report) => (
                  <div key={report.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{report.name}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="text-xs text-muted-foreground mb-3">
                      Generated on {new Date(report.lastGenerated).toLocaleDateString()}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">PDF</Badge>
                        <Badge variant="outline" className="text-xs">12 Pages</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="h-7">
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {isGenerating && (
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle>Generating Report</CardTitle>
            <CardDescription>Please wait while we compile your report</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              <Progress value={generationProgress} className="h-2" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Data Collection</span>
                    <span>{generationProgress >= 25 ? 'Complete' : 'In Progress'}</span>
                  </div>
                  <Progress value={generationProgress >= 25 ? 100 : generationProgress * 4} className="h-1" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Data Processing</span>
                    <span>{generationProgress >= 50 ? 'Complete' : generationProgress >= 25 ? 'In Progress' : 'Pending'}</span>
                  </div>
                  <Progress value={generationProgress >= 50 ? 100 : generationProgress >= 25 ? (generationProgress - 25) * 4 : 0} className="h-1" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Report Generation</span>
                    <span>{generationProgress >= 75 ? 'Complete' : generationProgress >= 50 ? 'In Progress' : 'Pending'}</span>
                  </div>
                  <Progress value={generationProgress >= 75 ? 100 : generationProgress >= 50 ? (generationProgress - 50) * 4 : 0} className="h-1" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Export & Finalization</span>
                    <span>{generationProgress >= 100 ? 'Complete' : generationProgress >= 75 ? 'In Progress' : 'Pending'}</span>
                  </div>
                  <Progress value={generationProgress >= 100 ? 100 : generationProgress >= 75 ? (generationProgress - 75) * 4 : 0} className="h-1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ReportsGenerator;
