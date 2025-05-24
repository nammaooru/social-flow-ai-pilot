
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Download, Calendar, CheckCircle } from "lucide-react";
import { CommonSettingsProps } from "@/pages/Settings";

export function BillingSettings({ role, onSettingChange }: CommonSettingsProps) {
  const { toast } = useToast();
  const [currentPlan] = useState({
    name: "Professional",
    price: "$29",
    billing: "monthly",
    nextBilling: "March 15, 2024",
    features: ["Up to 10 users", "Advanced analytics", "Priority support", "Custom branding"]
  });
  
  const [usage] = useState({
    users: { current: 7, limit: 10 },
    storage: { current: 2.5, limit: 10 },
    apiCalls: { current: 45000, limit: 100000 }
  });
  
  const [invoices] = useState([
    { id: "INV-001", date: "Feb 15, 2024", amount: "$29.00", status: "Paid" },
    { id: "INV-002", date: "Jan 15, 2024", amount: "$29.00", status: "Paid" },
    { id: "INV-003", date: "Dec 15, 2023", amount: "$29.00", status: "Paid" }
  ]);
  
  const handleUpgrade = () => {
    toast({
      title: "Upgrade initiated",
      description: "Redirecting to upgrade your plan...",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Download started",
      description: `Downloading invoice ${invoiceId}`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription, billing information, and payment methods.
        </p>
        {role && <Badge variant="outline" className="mt-2">Current role: {role}</Badge>}
      </div>
      
      <Tabs defaultValue="subscription" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Plan</span>
                <Badge className="text-sm">{currentPlan.name}</Badge>
              </CardTitle>
              <CardDescription>Your current subscription details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{currentPlan.price}</p>
                  <p className="text-sm text-muted-foreground">per {currentPlan.billing}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Next billing date</p>
                  <p className="text-sm text-muted-foreground">{currentPlan.nextBilling}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Plan Features</h4>
                <ul className="space-y-1">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleUpgrade}>Upgrade Plan</Button>
                <Button variant="outline">Change Billing Cycle</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
              <CardDescription>Manage your payment information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded" />
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/26</p>
                  </div>
                </div>
                <Badge variant="secondary">Primary</Badge>
              </div>
              <Button variant="outline" className="w-full">Update Payment Method</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Overview</CardTitle>
              <CardDescription>Monitor your current usage and limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Team Members</span>
                  <span>{usage.users.current} / {usage.users.limit}</span>
                </div>
                <Progress value={(usage.users.current / usage.users.limit) * 100} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Storage Used</span>
                  <span>{usage.storage.current}GB / {usage.storage.limit}GB</span>
                </div>
                <Progress value={(usage.storage.current / usage.storage.limit) * 100} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>API Calls</span>
                  <span>{usage.apiCalls.current.toLocaleString()} / {usage.apiCalls.limit.toLocaleString()}</span>
                </div>
                <Progress value={(usage.apiCalls.current / usage.apiCalls.limit) * 100} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Billing History
              </CardTitle>
              <CardDescription>Download your past invoices and receipts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{invoice.id}</p>
                      <p className="text-sm text-muted-foreground">{invoice.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={invoice.status === "Paid" ? "default" : "secondary"}>
                        {invoice.status}
                      </Badge>
                      <span className="font-medium">{invoice.amount}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
