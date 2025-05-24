import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Download, Calendar, CheckCircle, Plus, Edit } from "lucide-react";
import { CommonSettingsProps } from "@/pages/Settings";

export function BillingSettings({ role, onSettingChange }: CommonSettingsProps) {
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState({
    name: "Professional",
    price: "$29",
    billing: "monthly",
    nextBilling: "March 15, 2024",
    features: ["Up to 10 users", "Advanced analytics", "Priority support", "Custom branding"]
  });
  
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [newPlanDialogOpen, setNewPlanDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [newPaymentDialogOpen, setNewPaymentDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("professional");
  const [billingCycle, setBillingCycle] = useState("monthly");
  
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "1",
      cardNumber: "•••• •••• •••• 4242",
      expiryDate: "12/26",
      cardType: "Visa",
      isPrimary: true
    }
  ]);
  
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    name: "",
    billingAddress: "",
    city: "",
    country: ""
  });
  
  const [newPlan, setNewPlan] = useState({
    name: "",
    monthlyPrice: "",
    yearlyPrice: "",
    features: [""]
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
  
  const [plans, setPlans] = useState([
    { id: "basic", name: "Basic", price: { monthly: "$9", yearly: "$90" }, features: ["Up to 3 users", "Basic analytics", "Email support"] },
    { id: "professional", name: "Professional", price: { monthly: "$29", yearly: "$290" }, features: ["Up to 10 users", "Advanced analytics", "Priority support", "Custom branding"] },
    { id: "enterprise", name: "Enterprise", price: { monthly: "$99", yearly: "$990" }, features: ["Unlimited users", "Enterprise analytics", "24/7 support", "Custom integrations", "White-label"] }
  ]);
  
  const handlePlanChange = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (plan) {
      setCurrentPlan({
        name: plan.name,
        price: plan.price[billingCycle as keyof typeof plan.price],
        billing: billingCycle,
        nextBilling: "March 15, 2024",
        features: plan.features
      });
      
      toast({
        title: "Plan updated",
        description: `Successfully switched to ${plan.name} (${billingCycle})`,
      });
      
      setPlanDialogOpen(false);
      
      if (onSettingChange) {
        onSettingChange();
      }
    }
  };
  
  const handleCreateNewPlan = () => {
    if (!newPlan.name || !newPlan.monthlyPrice || !newPlan.yearlyPrice) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const planId = newPlan.name.toLowerCase().replace(/\s+/g, '-');
    const createdPlan = {
      id: planId,
      name: newPlan.name,
      price: { 
        monthly: newPlan.monthlyPrice.startsWith('$') ? newPlan.monthlyPrice : `$${newPlan.monthlyPrice}`,
        yearly: newPlan.yearlyPrice.startsWith('$') ? newPlan.yearlyPrice : `$${newPlan.yearlyPrice}`
      },
      features: newPlan.features.filter(f => f.trim() !== "")
    };
    
    setPlans(prev => [...prev, createdPlan]);
    
    toast({
      title: "Plan created",
      description: `New plan "${newPlan.name}" has been created successfully.`,
    });
    
    setNewPlan({ name: "", monthlyPrice: "", yearlyPrice: "", features: [""] });
    setNewPlanDialogOpen(false);
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  const handlePaymentMethodUpdate = () => {
    const updatedMethod = {
      id: Date.now().toString(),
      cardNumber: `•••• •••• •••• ${newPaymentMethod.cardNumber.slice(-4)}`,
      expiryDate: newPaymentMethod.expiryDate,
      cardType: "Visa",
      isPrimary: paymentMethods.length === 0
    };
    
    setPaymentMethods(prev => prev.map(method => ({ ...method, isPrimary: false })));
    setPaymentMethods(prev => [...prev, updatedMethod]);
    
    toast({
      title: "Payment method updated",
      description: "Your payment information has been successfully updated.",
    });
    
    setPaymentDialogOpen(false);
    setNewPaymentMethod({
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      name: "",
      billingAddress: "",
      city: "",
      country: ""
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  const handleAddNewPaymentMethod = () => {
    if (!newPaymentMethod.cardNumber || !newPaymentMethod.expiryDate || !newPaymentMethod.cvc || !newPaymentMethod.name) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const newMethod = {
      id: Date.now().toString(),
      cardNumber: `•••• •••• •••• ${newPaymentMethod.cardNumber.slice(-4)}`,
      expiryDate: newPaymentMethod.expiryDate,
      cardType: "Visa",
      isPrimary: false
    };
    
    setPaymentMethods(prev => [...prev, newMethod]);
    
    toast({
      title: "Payment method added",
      description: "New payment method has been added successfully.",
    });
    
    setNewPaymentDialogOpen(false);
    setNewPaymentMethod({
      cardNumber: "",
      expiryDate: "",
      cvc: "",
      name: "",
      billingAddress: "",
      city: "",
      country: ""
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  const addFeatureField = () => {
    setNewPlan(prev => ({ ...prev, features: [...prev.features, ""] }));
  };
  
  const updateFeature = (index: number, value: string) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }));
  };
  
  const removeFeature = (index: number) => {
    setNewPlan(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
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
                <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Edit className="h-4 w-4 mr-2" />
                      Change Plan
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Change Subscription Plan</DialogTitle>
                      <DialogDescription>
                        Select a new plan and billing cycle for your subscription.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Billing Cycle</Label>
                        <Select value={billingCycle} onValueChange={setBillingCycle}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly (Save 17%)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-4">
                        {plans.map((plan) => (
                          <div
                            key={plan.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedPlan === plan.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setSelectedPlan(plan.id)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">{plan.name}</h3>
                              <span className="text-lg font-bold">{plan.price[billingCycle as keyof typeof plan.price]}</span>
                            </div>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setPlanDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handlePlanChange}>
                          Update Plan
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={newPlanDialogOpen} onOpenChange={setNewPlanDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Plan
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Create New Plan</DialogTitle>
                      <DialogDescription>
                        Create a custom subscription plan with your preferred pricing and features.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="planName">Plan Name *</Label>
                        <Input
                          id="planName"
                          placeholder="e.g., Premium"
                          value={newPlan.name}
                          onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="monthlyPrice">Monthly Price *</Label>
                          <Input
                            id="monthlyPrice"
                            placeholder="$49"
                            value={newPlan.monthlyPrice}
                            onChange={(e) => setNewPlan(prev => ({ ...prev, monthlyPrice: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="yearlyPrice">Yearly Price *</Label>
                          <Input
                            id="yearlyPrice"
                            placeholder="$490"
                            value={newPlan.yearlyPrice}
                            onChange={(e) => setNewPlan(prev => ({ ...prev, yearlyPrice: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Plan Features</Label>
                        <div className="space-y-2">
                          {newPlan.features.map((feature, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                placeholder="Feature description"
                                value={feature}
                                onChange={(e) => updateFeature(index, e.target.value)}
                              />
                              {newPlan.features.length > 1 && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => removeFeature(index)}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button variant="outline" size="sm" onClick={addFeatureField}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Feature
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setNewPlanDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateNewPlan}>
                          Create Plan
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>Manage your payment information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded" />
                      <div>
                        <p className="font-medium">{method.cardNumber}</p>
                        <p className="text-sm text-muted-foreground">Expires {method.expiryDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.isPrimary && <Badge variant="secondary">Primary</Badge>}
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Update Payment Method
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Payment Method</DialogTitle>
                      <DialogDescription>
                        Enter your new payment information below.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={newPaymentMethod.cardNumber}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, cardNumber: e.target.value }))}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={newPaymentMethod.expiryDate}
                            onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, expiryDate: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            placeholder="123"
                            value={newPaymentMethod.cvc}
                            onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, cvc: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="name">Cardholder Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={newPaymentMethod.name}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="billingAddress">Billing Address</Label>
                        <Input
                          id="billingAddress"
                          placeholder="123 Main St"
                          value={newPaymentMethod.billingAddress}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, billingAddress: e.target.value }))}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            placeholder="New York"
                            value={newPaymentMethod.city}
                            onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, city: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Select value={newPaymentMethod.country} onValueChange={(value) => setNewPaymentMethod(prev => ({ ...prev, country: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="us">United States</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                              <SelectItem value="gb">United Kingdom</SelectItem>
                              <SelectItem value="de">Germany</SelectItem>
                              <SelectItem value="fr">France</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handlePaymentMethodUpdate}>
                          Update Payment Method
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={newPaymentDialogOpen} onOpenChange={setNewPaymentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Payment Method
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Payment Method</DialogTitle>
                      <DialogDescription>
                        Add a new payment method to your account.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="newCardNumber">Card Number *</Label>
                        <Input
                          id="newCardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={newPaymentMethod.cardNumber}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, cardNumber: e.target.value }))}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="newExpiryDate">Expiry Date *</Label>
                          <Input
                            id="newExpiryDate"
                            placeholder="MM/YY"
                            value={newPaymentMethod.expiryDate}
                            onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, expiryDate: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newCvc">CVC *</Label>
                          <Input
                            id="newCvc"
                            placeholder="123"
                            value={newPaymentMethod.cvc}
                            onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, cvc: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newName">Cardholder Name *</Label>
                        <Input
                          id="newName"
                          placeholder="John Doe"
                          value={newPaymentMethod.name}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newBillingAddress">Billing Address</Label>
                        <Input
                          id="newBillingAddress"
                          placeholder="123 Main St"
                          value={newPaymentMethod.billingAddress}
                          onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, billingAddress: e.target.value }))}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="newCity">City</Label>
                          <Input
                            id="newCity"
                            placeholder="New York"
                            value={newPaymentMethod.city}
                            onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, city: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newCountry">Country</Label>
                          <Select value={newPaymentMethod.country} onValueChange={(value) => setNewPaymentMethod(prev => ({ ...prev, country: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="us">United States</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                              <SelectItem value="gb">United Kingdom</SelectItem>
                              <SelectItem value="de">Germany</SelectItem>
                              <SelectItem value="fr">France</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setNewPaymentDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddNewPaymentMethod}>
                          Add Payment Method
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
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
