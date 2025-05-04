
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

interface AnalyticsSettingsProps {
  role: string;
}

export function AnalyticsSettings({ role }: AnalyticsSettingsProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("tracking");
  
  // Only Super Admin and White Label can access advanced settings
  const canAccessAdvanced = role === "Super Admin" || role === "White Label";
  
  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your analytics settings have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Analytics Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your analytics preferences and integrations.
        </p>
      </div>
      
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-6">
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          {canAccessAdvanced && (
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Collection</CardTitle>
              <CardDescription>
                Configure what data is collected and how it's used.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="track-engagement" className="flex flex-col space-y-1">
                  <span>Track Engagement Metrics</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Collect data on likes, comments, shares, and other engagement.
                  </span>
                </Label>
                <Switch
                  id="track-engagement"
                  defaultChecked={true}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="track-demographics" className="flex flex-col space-y-1">
                  <span>Audience Demographics</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Collect data about your audience demographics.
                  </span>
                </Label>
                <Switch
                  id="track-demographics"
                  defaultChecked={true}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="track-conversion" className="flex flex-col space-y-1">
                  <span>Conversion Tracking</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Track conversions from your social media posts.
                  </span>
                </Label>
                <Switch
                  id="track-conversion"
                  defaultChecked={true}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="track-competitors" className="flex flex-col space-y-1">
                  <span>Competitor Analysis</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Track metrics from your competitors.
                  </span>
                </Label>
                <Switch
                  id="track-competitors"
                  defaultChecked={false}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Settings</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>
                Connect third-party analytics services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="google-analytics" className="flex flex-col space-y-1">
                  <span>Google Analytics</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Connect to your Google Analytics account.
                  </span>
                </Label>
                <Switch
                  id="google-analytics"
                  defaultChecked={false}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="facebook-pixel" className="flex flex-col space-y-1">
                  <span>Facebook Pixel</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Track conversions from Facebook ads.
                  </span>
                </Label>
                <Switch
                  id="facebook-pixel"
                  defaultChecked={false}
                />
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="ga-tracking-id">Google Analytics Tracking ID</Label>
                <div className="flex gap-2">
                  <input
                    id="ga-tracking-id"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="UA-XXXXXXXXX-X"
                  />
                  <Button variant="outline">Verify</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Integrations</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Configure automated reports for your team.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="weekly-report" className="flex flex-col space-y-1">
                  <span>Weekly Performance Report</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Send a performance summary every Monday.
                  </span>
                </Label>
                <Switch
                  id="weekly-report"
                  defaultChecked={true}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="monthly-report" className="flex flex-col space-y-1">
                  <span>Monthly Insights Report</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Send a detailed analysis on the 1st of each month.
                  </span>
                </Label>
                <Switch
                  id="monthly-report"
                  defaultChecked={true}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="campaign-report" className="flex flex-col space-y-1">
                  <span>Campaign Completion Reports</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Send a report when campaigns end.
                  </span>
                </Label>
                <Switch
                  id="campaign-report"
                  defaultChecked={false}
                />
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="report-recipients">Report Recipients</Label>
                <input
                  id="report-recipients"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  placeholder="email@example.com, email2@example.com"
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple email addresses with commas.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Report Settings</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Report Customization</CardTitle>
              <CardDescription>
                Customize the appearance and content of your reports.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-logo">Report Logo</Label>
                <Button variant="outline" className="w-full">Upload Logo</Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="report-metrics">Key Metrics to Include</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="report-metrics">
                    <SelectValue placeholder="Select metrics" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Metrics</SelectItem>
                    <SelectItem value="engagement">Engagement Only</SelectItem>
                    <SelectItem value="growth">Growth Metrics</SelectItem>
                    <SelectItem value="custom">Custom Selection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="report-format">Report Format</Label>
                <Select defaultValue="pdf">
                  <SelectTrigger id="report-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV File</SelectItem>
                    <SelectItem value="html">HTML Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Customization</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {canAccessAdvanced && (
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Retention</CardTitle>
                <CardDescription>
                  Configure how long analytics data is stored.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="retention-period">Data Retention Period</Label>
                  <Select defaultValue="12">
                    <SelectTrigger id="retention-period">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 months</SelectItem>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="anonymize-data" className="flex flex-col space-y-1">
                    <span>Anonymize Data After Retention Period</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Retain anonymized data for historical trends.
                    </span>
                  </Label>
                  <Switch
                    id="anonymize-data"
                    defaultChecked={true}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save Settings</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Custom Analytics</CardTitle>
                <CardDescription>
                  Configure custom analytics tracking and events.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-events">Custom Events</Label>
                  <textarea
                    id="custom-events"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter custom event JSON configuration"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use JSON format to define custom events to track.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api-endpoint">Custom Analytics API Endpoint</Label>
                  <input
                    id="api-endpoint"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="https://analytics-api.example.com/events"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save Custom Analytics</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
