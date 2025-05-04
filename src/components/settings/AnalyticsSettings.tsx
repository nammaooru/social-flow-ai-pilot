
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CommonSettingsProps } from "./SettingsComponentTypes";
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

interface AnalyticsSettingsProps extends CommonSettingsProps {
  role: string;
}

export function AnalyticsSettings({ role, onSettingChange }: AnalyticsSettingsProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("tracking");
  
  // Only Super Admin and White Label can access advanced settings
  const canAccessAdvanced = role === "Super Admin" || role === "White Label";
  
  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your analytics settings have been updated.",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
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
                Customize the appearance and content of reports.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="include-logo" className="flex flex-col space-y-1">
                  <span>Include Logo</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Add your company logo to reports.
                  </span>
                </Label>
                <Switch
                  id="include-logo"
                  defaultChecked={true}
                />
              </div>
              
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="include-executive-summary" className="flex flex-col space-y-1">
                  <span>Executive Summary</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Include an AI-generated summary of key insights.
                  </span>
                </Label>
                <Switch
                  id="include-executive-summary"
                  defaultChecked={true}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="report-format">Preferred Format</Label>
                <Select defaultValue="pdf">
                  <SelectTrigger id="report-format">
                    <SelectValue placeholder="Select a format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="google-sheets">Google Sheets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Customizations</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {canAccessAdvanced && (
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Configure advanced analytics settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="custom-events" className="flex flex-col space-y-1">
                    <span>Custom Events Tracking</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Track custom events and user interactions.
                    </span>
                  </Label>
                  <Switch
                    id="custom-events"
                    defaultChecked={false}
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="enhanced-ecommerce" className="flex flex-col space-y-1">
                    <span>Enhanced Ecommerce</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Track detailed shopping behavior.
                    </span>
                  </Label>
                  <Switch
                    id="enhanced-ecommerce"
                    defaultChecked={false}
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="ip-anonymization" className="flex flex-col space-y-1">
                    <span>IP Anonymization</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Anonymize user IP addresses for privacy compliance.
                    </span>
                  </Label>
                  <Switch
                    id="ip-anonymization"
                    defaultChecked={true}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data-retention">Data Retention Period</Label>
                  <Select defaultValue="26">
                    <SelectTrigger id="data-retention">
                      <SelectValue placeholder="Select a period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="14">14 months</SelectItem>
                      <SelectItem value="26">26 months</SelectItem>
                      <SelectItem value="38">38 months</SelectItem>
                      <SelectItem value="50">50 months</SelectItem>
                      <SelectItem value="do-not-expire">Do not expire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save Advanced Settings</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Export</CardTitle>
                <CardDescription>
                  Configure data export options for advanced analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="automated-export" className="flex flex-col space-y-1">
                    <span>Automated Data Export</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Automatically export data on a schedule.
                    </span>
                  </Label>
                  <Switch
                    id="automated-export"
                    defaultChecked={false}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="export-frequency">Export Frequency</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger id="export-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="export-destination">Export Destination</Label>
                  <Select defaultValue="s3">
                    <SelectTrigger id="export-destination">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="s3">Amazon S3</SelectItem>
                      <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                      <SelectItem value="azure">Azure Blob Storage</SelectItem>
                      <SelectItem value="sftp">SFTP Server</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destination-path">Destination Path/Bucket</Label>
                  <input
                    id="destination-path"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="analytics-exports/company-name/"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save Export Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
