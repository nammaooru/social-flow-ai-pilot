
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, Calendar, Download } from "lucide-react";

interface BillingSettingsProps {
  role: string;
}

// Mock data for billing and plans
const mockPlans = [
  {
    id: "basic",
    name: "Basic",
    price: 29,
    interval: "month",
    description: "Essential tools for social media management.",
    features: [
      "5 social accounts",
      "50 scheduled posts per month",
      "Basic analytics",
      "Email support"
    ],
    current: false
  },
  {
    id: "pro",
    name: "Professional",
    price: 79,
    interval: "month",
    description: "Advanced tools for growing teams.",
    features: [
      "15 social accounts",
      "Unlimited scheduled posts",
      "Advanced analytics",
      "Priority support",
      "Team collaboration"
    ],
    current: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    interval: "month",
    description: "Complete solution for large organizations.",
    features: [
      "Unlimited social accounts",
      "Unlimited scheduled posts",
      "Custom analytics",
      "Dedicated support",
      "Advanced team permissions",
      "Custom integrations"
    ],
    current: false
  }
];

const mockInvoices = [
  {
    id: "INV-001",
    date: "2023-06-01",
    amount: "$79.00",
    status: "Paid"
  },
  {
    id: "INV-002",
    date: "2023-05-01",
    amount: "$79.00",
    status: "Paid"
  },
  {
    id: "INV-003",
    date: "2023-04-01",
    amount: "$79.00",
    status: "Paid"
  }
];

export function BillingSettings({ role }: BillingSettingsProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("subscription");
  const [billingInterval, setBillingInterval] = useState("month");
  
  const handlePlanChange = (planId: string) => {
    toast({
      title: "Plan changed",
      description: `Your subscription has been changed to the ${planId} plan.`,
    });
  };

  // Super Admin can create and manage plans, others can only subscribe
  const isAdmin = role === "Super Admin" || role === "White Label";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing & Subscription</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription, billing information, and view invoices.
        </p>
      </div>
      
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="payment">Payment Method</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscription" className="space-y-6">
          <div className="flex justify-end">
            <div className="inline-flex rounded-md shadow-sm mb-6" role="group">
              <button
                onClick={() => setBillingInterval("month")}
                className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${
                  billingInterval === "month"
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent hover:bg-muted"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval("year")}
                className={`px-4 py-2 text-sm font-medium border-t border-b border-r rounded-r-lg ${
                  billingInterval === "year"
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent hover:bg-muted"
                }`}
              >
                Yearly (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`${plan.current ? 'border-primary' : ''}`}
              >
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-2 flex items-baseline text-gray-900">
                    <span className="text-3xl font-bold tracking-tight">
                      ${billingInterval === "year" ? plan.price * 0.8 * 12 : plan.price}
                    </span>
                    <span className="ml-1 text-xl font-semibold">
                      /{billingInterval === "year" ? "year" : "month"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {plan.current ? (
                    <Button disabled className="w-full">Current Plan</Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handlePlanChange(plan.id)}
                    >
                      {isAdmin ? "Assign Plan" : "Upgrade"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {isAdmin && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Plan Management</CardTitle>
                <CardDescription>
                  Create and manage subscription plans for your customers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => {
                    toast({
                      title: "Feature coming soon",
                      description: "Plan management functionality is coming soon.",
                    });
                  }}
                >
                  Manage Plans
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Update your billing details and payment method.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center p-4 border rounded-md">
                <div className="mr-4">
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Visa ending in 4242</div>
                  <div className="text-sm text-muted-foreground">Expires 12/2025</div>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-name">Name on Card</Label>
                    <Input id="card-name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input id="card-number" placeholder="4242 4242 4242 4242" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry-month">Expiry Month</Label>
                    <Select>
                      <SelectTrigger id="expiry-month">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i} value={`${i + 1}`}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry-year">Expiry Year</Label>
                    <Select>
                      <SelectTrigger id="expiry-year">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(
                          { length: 10 },
                          (_, i) => new Date().getFullYear() + i
                        ).map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => {
                toast({
                  title: "Payment method updated",
                  description: "Your payment method has been updated successfully.",
                });
              }}>
                Save Payment Method
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
              <CardDescription>
                Update the billing address associated with your payments.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address-line1">Address Line 1</Label>
                <Input id="address-line1" placeholder="123 Main St" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address-line2">Address Line 2</Label>
                <Input id="address-line2" placeholder="Apt 4B" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="New York" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State / Province</Label>
                  <Input id="state" placeholder="NY" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postal-code">Postal Code</Label>
                  <Input id="postal-code" placeholder="10001" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select>
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => {
                toast({
                  title: "Billing address updated",
                  description: "Your billing address has been updated successfully.",
                });
              }}>
                Save Address
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>
                View and download your past invoices.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            invoice.status === "Paid"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
