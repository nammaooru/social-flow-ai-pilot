
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Palette, Globe, User, Check, X, ExternalLink, Copy, RefreshCw, Shield, AlertCircle } from "lucide-react";
import { CommonSettingsProps } from "@/pages/Settings";

interface WhiteLabelUser {
  id: string;
  name: string;
  email: string;
  company: string;
  isActive: boolean;
}

interface DnsRecord {
  type: string;
  name: string;
  value: string;
  status: 'pending' | 'verified' | 'error';
  ttl?: number;
}

interface BrandingConfig {
  companyName: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  customDomain: string;
  hideFooter: boolean;
  customCSS: string;
  sslEnabled: boolean;
  domainStatus: 'pending' | 'active' | 'error' | 'verifying';
  dnsRecords: DnsRecord[];
  subdomainPrefix: string;
  redirectUrls: string[];
  autoRenewSsl: boolean;
  forceHttps: boolean;
  domainVerificationCode: string;
}

export function WhiteLabelSettings({ onSettingChange, role = "User" }: CommonSettingsProps) {
  const { toast } = useToast();
  const [selectedWhiteLabel, setSelectedWhiteLabel] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [faviconPreview, setFaviconPreview] = useState<string>("");
  const [isVerifyingDomain, setIsVerifyingDomain] = useState(false);
  const [isDnsChecking, setIsDnsChecking] = useState(false);

  // Mock data for White Label users
  const whiteLabelUsers: WhiteLabelUser[] = [
    { id: "1", name: "Acme Corp", email: "admin@acme.com", company: "Acme Corporation", isActive: true },
    { id: "2", name: "TechStart Inc", email: "admin@techstart.com", company: "TechStart Inc", isActive: true },
    { id: "3", name: "Digital Solutions", email: "admin@digitalsol.com", company: "Digital Solutions Ltd", isActive: true },
    { id: "4", name: "Global Tech", email: "admin@globaltech.com", company: "Global Tech Solutions", isActive: true },
    { id: "5", name: "Innovation Labs", email: "admin@innolabs.com", company: "Innovation Labs Inc", isActive: true },
  ];

  const [branding, setBranding] = useState<BrandingConfig>({
    companyName: selectedWhiteLabel ? whiteLabelUsers.find(u => u.id === selectedWhiteLabel)?.company || "Your Company" : "Your Company",
    logo: "",
    favicon: "",
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    customDomain: "",
    hideFooter: false,
    customCSS: "",
    sslEnabled: true,
    domainStatus: 'pending',
    subdomainPrefix: "",
    redirectUrls: [""],
    autoRenewSsl: true,
    forceHttps: true,
    domainVerificationCode: `whitelabel-verify-${Math.random().toString(36).substring(2, 15)}`,
    dnsRecords: [
      { type: 'A', name: '@', value: '192.168.1.100', status: 'pending', ttl: 3600 },
      { type: 'CNAME', name: 'www', value: 'app.yourplatform.com', status: 'pending', ttl: 3600 },
      { type: 'TXT', name: '@', value: '', status: 'pending', ttl: 300 }
    ]
  });

  // Debug log to see what role is being passed
  console.log("WhiteLabelSettings role:", role);
  
  const handleSave = () => {
    if (role === "Super Admin" && !selectedWhiteLabel) {
      toast({
        title: "Please select a White Label user",
        description: "You must select a White Label user to configure their branding.",
        variant: "destructive"
      });
      return;
    }

    const selectedUser = whiteLabelUsers.find(u => u.id === selectedWhiteLabel);
    toast({
      title: "White label settings saved",
      description: `Branding configuration has been updated successfully${selectedUser ? ` for ${selectedUser.name}` : ''}.`,
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };

  const handleWhiteLabelSelection = (userId: string) => {
    setSelectedWhiteLabel(userId);
    const selectedUser = whiteLabelUsers.find(u => u.id === userId);
    if (selectedUser) {
      setBranding(prev => ({
        ...prev,
        companyName: selectedUser.company,
        subdomainPrefix: selectedUser.name.toLowerCase().replace(/\s+/g, '-'),
        dnsRecords: prev.dnsRecords.map((record, index) => 
          index === 2 ? { ...record, value: `whitelabel-verify-${selectedUser.id}` } : record
        )
      }));
      
      toast({
        title: "White Label user selected",
        description: `Now configuring branding for ${selectedUser.name}`,
      });
    }
  };
  
  const handleInputChange = (field: string, value: string | boolean) => {
    setBranding(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (file: File, type: 'logo' | 'favicon') => {
    // Validate file size (1MB max)
    if (file.size > 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 1MB.",
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    const validTypes = type === 'logo' 
      ? ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
      : ['image/png', 'image/x-icon', 'image/vnd.microsoft.icon'];
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `Please upload a valid ${type === 'logo' ? 'image' : 'favicon'} file.`,
        variant: "destructive"
      });
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    
    if (type === 'logo') {
      setLogoFile(file);
      setLogoPreview(previewUrl);
      handleInputChange('logo', `/lovable-uploads/${file.name}`);
    } else {
      setFaviconFile(file);
      setFaviconPreview(previewUrl);
      handleInputChange('favicon', `/lovable-uploads/${file.name}`);
    }

    toast({
      title: `${type === 'logo' ? 'Logo' : 'Favicon'} uploaded`,
      description: "File has been successfully uploaded and processed.",
    });
  };

  const handleDomainVerification = async () => {
    if (!branding.customDomain) {
      toast({
        title: "No domain specified",
        description: "Please enter a custom domain before verification.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifyingDomain(true);
    setBranding(prev => ({ ...prev, domainStatus: 'verifying' }));

    try {
      // Simulate domain verification process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate verification success/failure
      const isVerified = Math.random() > 0.3; // 70% success rate for demo
      
      if (isVerified) {
        setBranding(prev => ({
          ...prev,
          domainStatus: 'active',
          dnsRecords: prev.dnsRecords.map(record => ({ ...record, status: 'verified' }))
        }));

        toast({
          title: "Domain verified successfully",
          description: `${branding.customDomain} has been verified and is now active.`,
        });
      } else {
        setBranding(prev => ({ ...prev, domainStatus: 'error' }));
        toast({
          title: "Domain verification failed",
          description: "Please check your DNS records and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      setBranding(prev => ({ ...prev, domainStatus: 'error' }));
      toast({
        title: "Verification error",
        description: "An error occurred during domain verification.",
        variant: "destructive"
      });
    } finally {
      setIsVerifyingDomain(false);
    }
  };

  const checkDnsRecords = async () => {
    if (!branding.customDomain) {
      toast({
        title: "No domain specified",
        description: "Please enter a custom domain before checking DNS.",
        variant: "destructive"
      });
      return;
    }

    setIsDnsChecking(true);

    try {
      // Simulate DNS checking
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate DNS record status updates
      setBranding(prev => ({
        ...prev,
        dnsRecords: prev.dnsRecords.map(record => ({
          ...record,
          status: Math.random() > 0.5 ? 'verified' : 'pending'
        }))
      }));

      toast({
        title: "DNS records checked",
        description: "DNS record status has been updated.",
      });
    } catch (error) {
      toast({
        title: "DNS check failed",
        description: "Unable to check DNS records. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDnsChecking(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "DNS record value has been copied to your clipboard.",
    });
  };

  const addRedirectUrl = () => {
    setBranding(prev => ({
      ...prev,
      redirectUrls: [...prev.redirectUrls, ""]
    }));
  };

  const removeRedirectUrl = (index: number) => {
    setBranding(prev => ({
      ...prev,
      redirectUrls: prev.redirectUrls.filter((_, i) => i !== index)
    }));
  };

  const updateRedirectUrl = (index: number, value: string) => {
    setBranding(prev => ({
      ...prev,
      redirectUrls: prev.redirectUrls.map((url, i) => i === index ? value : url)
    }));
  };

  const generateSslCertificate = async () => {
    if (!branding.customDomain) {
      toast({
        title: "Domain required",
        description: "Please configure a custom domain before generating SSL certificate.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Simulate SSL certificate generation
      toast({
        title: "Generating SSL certificate",
        description: "This may take a few minutes...",
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "SSL certificate generated",
        description: "Your SSL certificate has been successfully generated and installed.",
      });
    } catch (error) {
      toast({
        title: "SSL generation failed",
        description: "Unable to generate SSL certificate. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">White Label Settings</h3>
        <p className="text-sm text-muted-foreground">
          {role === "Super Admin" 
            ? "Configure branding and appearance for White Label users. Select a White Label user to customize their specific branding and domain settings." 
            : "Customize your platform's branding, appearance, and domain configuration to match your brand identity."}
        </p>
      </div>

      {role === "Super Admin" && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <User className="h-5 w-5" />
              Select White Label User
            </CardTitle>
            <CardDescription>Choose which White Label user to configure their branding and domain settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whiteLabelSelect" className="text-base font-medium">White Label User</Label>
                <Select value={selectedWhiteLabel} onValueChange={handleWhiteLabelSelection}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a White Label user to configure their branding" />
                  </SelectTrigger>
                  <SelectContent>
                    {whiteLabelUsers
                      .filter(user => user.isActive)
                      .map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-sm text-muted-foreground">{user.email} • {user.company}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedWhiteLabel && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Configuring branding for: <strong>{whiteLabelUsers.find(u => u.id === selectedWhiteLabel)?.name}</strong></span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show configuration only if White Label user is selected (for Super Admin) or if user is not Super Admin */}
      {(role !== "Super Admin" || selectedWhiteLabel) && (
        <Tabs defaultValue="branding" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="domain">Domain</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="branding" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Brand Assets
                </CardTitle>
                <CardDescription>Upload your logo and branding materials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={branding.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {logoPreview ? (
                        <div className="space-y-2">
                          <img src={logoPreview} alt="Logo preview" className="mx-auto h-16 w-auto object-contain" />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => document.getElementById('logo-upload')?.click()}
                          >
                            Change Logo
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">Upload your logo</p>
                          <p className="text-xs text-gray-500">PNG, JPG, SVG up to 1MB</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => document.getElementById('logo-upload')?.click()}
                          >
                            Choose File
                          </Button>
                        </div>
                      )}
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'logo');
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Favicon</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {faviconPreview ? (
                        <div className="space-y-2">
                          <img src={faviconPreview} alt="Favicon preview" className="mx-auto h-8 w-8 object-contain" />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => document.getElementById('favicon-upload')?.click()}
                          >
                            Change Favicon
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">Upload favicon</p>
                          <p className="text-xs text-gray-500">ICO, PNG 32x32px up to 1MB</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => document.getElementById('favicon-upload')?.click()}
                          >
                            Choose File
                          </Button>
                        </div>
                      )}
                      <input
                        id="favicon-upload"
                        type="file"
                        accept="image/png,image/x-icon,image/vnd.microsoft.icon"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'favicon');
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="colors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Color Scheme
                </CardTitle>
                <CardDescription>Customize your brand colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={branding.primaryColor}
                        onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={branding.primaryColor}
                        onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={branding.secondaryColor}
                        onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={branding.secondaryColor}
                        onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                        placeholder="#64748b"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Color Preview</h4>
                  <div className="flex gap-2">
                    <div 
                      className="w-12 h-12 rounded" 
                      style={{ backgroundColor: branding.primaryColor }}
                    />
                    <div 
                      className="w-12 h-12 rounded" 
                      style={{ backgroundColor: branding.secondaryColor }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="domain" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Domain Configuration
                </CardTitle>
                <CardDescription>Configure your custom domain and DNS settings for White Label branding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customDomain">Custom Domain</Label>
                    <Input
                      id="customDomain"
                      placeholder="app.yourcompany.com"
                      value={branding.customDomain}
                      onChange={(e) => handleInputChange("customDomain", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Your primary domain for the White Label application
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subdomainPrefix">Subdomain Prefix</Label>
                    <Input
                      id="subdomainPrefix"
                      placeholder="acme"
                      value={branding.subdomainPrefix}
                      onChange={(e) => handleInputChange("subdomainPrefix", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Creates: {branding.subdomainPrefix || 'subdomain'}.yourplatform.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button 
                    onClick={handleDomainVerification}
                    disabled={!branding.customDomain || isVerifyingDomain}
                    className="flex items-center gap-2"
                  >
                    {isVerifyingDomain ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    {isVerifyingDomain ? "Verifying..." : "Verify Domain"}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={checkDnsRecords}
                    disabled={!branding.customDomain || isDnsChecking}
                    className="flex items-center gap-2"
                  >
                    {isDnsChecking ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    {isDnsChecking ? "Checking..." : "Check DNS"}
                  </Button>

                  <div className={`flex items-center gap-2 text-sm ${
                    branding.domainStatus === 'active' ? 'text-green-600' : 
                    branding.domainStatus === 'error' ? 'text-red-600' : 
                    branding.domainStatus === 'verifying' ? 'text-blue-600' : 'text-yellow-600'
                  }`}>
                    {branding.domainStatus === 'active' ? <Check className="h-4 w-4" /> : 
                     branding.domainStatus === 'error' ? <X className="h-4 w-4" /> :
                     branding.domainStatus === 'verifying' ? <RefreshCw className="h-4 w-4 animate-spin" /> :
                     <AlertCircle className="h-4 w-4" />}
                    Status: {branding.domainStatus.charAt(0).toUpperCase() + branding.domainStatus.slice(1)}
                  </div>
                </div>

                {/* Redirect URLs */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Redirect URLs</Label>
                    <Button size="sm" variant="outline" onClick={addRedirectUrl}>
                      Add URL
                    </Button>
                  </div>
                  {branding.redirectUrls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="https://yourapp.com/callback"
                        value={url}
                        onChange={(e) => updateRedirectUrl(index, e.target.value)}
                      />
                      {branding.redirectUrls.length > 1 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeRedirectUrl(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground">
                    URLs that are allowed for authentication redirects
                  </p>
                </div>

                {/* SSL Configuration */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    SSL Certificate Configuration
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>SSL Enabled</Label>
                        <p className="text-xs text-muted-foreground">
                          Enable HTTPS for your domain
                        </p>
                      </div>
                      <Switch
                        checked={branding.sslEnabled}
                        onCheckedChange={(checked) => handleInputChange("sslEnabled", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-Renew SSL</Label>
                        <p className="text-xs text-muted-foreground">
                          Automatically renew certificates
                        </p>
                      </div>
                      <Switch
                        checked={branding.autoRenewSsl}
                        onCheckedChange={(checked) => handleInputChange("autoRenewSsl", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Force HTTPS</Label>
                        <p className="text-xs text-muted-foreground">
                          Redirect HTTP to HTTPS
                        </p>
                      </div>
                      <Switch
                        checked={branding.forceHttps}
                        onCheckedChange={(checked) => handleInputChange("forceHttps", checked)}
                      />
                    </div>

                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        onClick={generateSslCertificate}
                        disabled={!branding.sslEnabled}
                        className="flex items-center gap-2"
                      >
                        <Shield className="h-4 w-4" />
                        Generate SSL Certificate
                      </Button>
                    </div>
                  </div>
                </div>

                {/* DNS Records */}
                {branding.customDomain && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">DNS Configuration</h4>
                    <p className="text-xs text-muted-foreground">
                      Add these DNS records to your domain registrar to configure your White Label domain
                    </p>
                    
                    {branding.dnsRecords.map((record, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono bg-muted px-2 py-1 rounded font-medium">
                              {record.type}
                            </span>
                            <span className={`text-xs font-medium ${
                              record.status === 'verified' ? 'text-green-600' : 
                              record.status === 'error' ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {record.status === 'verified' ? '✓ Verified' : 
                               record.status === 'error' ? '✗ Error' : '⏳ Pending'}
                            </span>
                            {record.ttl && (
                              <span className="text-xs text-muted-foreground">
                                TTL: {record.ttl}s
                              </span>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(record.value || (index === 2 ? branding.domainVerificationCode : record.value))}
                            className="flex items-center gap-1"
                          >
                            <Copy className="h-3 w-3" />
                            Copy
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-muted-foreground font-medium">Name/Host:</span>
                            <p className="font-mono mt-1 p-2 bg-muted rounded">{record.name}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground font-medium">Value/Points to:</span>
                            <p className="font-mono mt-1 p-2 bg-muted rounded break-all">
                              {index === 2 ? branding.domainVerificationCode : record.value}
                            </p>
                          </div>
                        </div>
                        
                        {index === 2 && (
                          <p className="text-xs text-muted-foreground">
                            This TXT record is used for domain verification
                          </p>
                        )}
                      </div>
                    ))}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 bg-muted rounded-lg">
                      <ExternalLink className="h-3 w-3" />
                      <span>
                        Need help configuring DNS? Check our 
                        <a href="#" className="ml-1 text-primary hover:underline">domain setup guide</a>
                        or contact support for assistance.
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Customization</CardTitle>
                <CardDescription>Advanced branding options and custom styling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="hideFooter">Hide Platform Footer</Label>
                    <p className="text-sm text-muted-foreground">
                      Remove the default footer from all pages
                    </p>
                  </div>
                  <Switch
                    id="hideFooter"
                    checked={branding.hideFooter}
                    onCheckedChange={(checked) => handleInputChange("hideFooter", checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customCSS">Custom CSS</Label>
                  <textarea
                    id="customCSS"
                    className="w-full h-32 p-3 border rounded-md font-mono text-sm"
                    placeholder="/* Add your custom CSS here */
.custom-header {
  background: linear-gradient(45deg, #your-primary-color, #your-secondary-color);
}

.custom-button {
  border-radius: 8px;
  transition: all 0.3s ease;
}"
                    value={branding.customCSS}
                    onChange={(e) => handleInputChange("customCSS", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Add custom CSS to further customize the appearance. Changes will be applied globally.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Save button - show different states based on role and selection */}
      <div className="flex justify-end">
        {role === "Super Admin" ? (
          <Button 
            onClick={handleSave} 
            disabled={!selectedWhiteLabel}
            className={!selectedWhiteLabel ? "opacity-50" : ""}
          >
            {selectedWhiteLabel ? "Save Branding Configuration" : "Select White Label User First"}
          </Button>
        ) : (
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        )}
      </div>
    </div>
  );
}
