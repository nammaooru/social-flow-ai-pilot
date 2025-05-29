
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Palette, Globe, User, Check, X, ExternalLink, Copy } from "lucide-react";
import { CommonSettingsProps } from "@/pages/Settings";

interface WhiteLabelUser {
  id: string;
  name: string;
  email: string;
  company: string;
  isActive: boolean;
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
  domainStatus: 'pending' | 'active' | 'error';
  dnsRecords: {
    type: string;
    name: string;
    value: string;
    status: 'pending' | 'verified';
  }[];
}

export function WhiteLabelSettings({ onSettingChange, role }: CommonSettingsProps) {
  const { toast } = useToast();
  const [selectedWhiteLabel, setSelectedWhiteLabel] = useState<string>("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [faviconPreview, setFaviconPreview] = useState<string>("");

  // Mock data for White Label users
  const whiteLabelUsers: WhiteLabelUser[] = [
    { id: "1", name: "Acme Corp", email: "admin@acme.com", company: "Acme Corporation", isActive: true },
    { id: "2", name: "TechStart Inc", email: "admin@techstart.com", company: "TechStart Inc", isActive: true },
    { id: "3", name: "Digital Solutions", email: "admin@digitalsol.com", company: "Digital Solutions Ltd", isActive: false },
  ];

  const [branding, setBranding] = useState<BrandingConfig>({
    companyName: "Your Company",
    logo: "",
    favicon: "",
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    customDomain: "",
    hideFooter: false,
    customCSS: "",
    sslEnabled: true,
    domainStatus: 'pending',
    dnsRecords: [
      { type: 'CNAME', name: 'www', value: 'app.yourplatform.com', status: 'pending' },
      { type: 'A', name: '@', value: '192.168.1.1', status: 'pending' }
    ]
  });
  
  const handleSave = () => {
    if (!selectedWhiteLabel && role === "Super Admin") {
      toast({
        title: "Please select a White Label user",
        description: "You must select a White Label user to configure their branding.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "White label settings saved",
      description: `Branding configuration has been updated successfully${selectedWhiteLabel ? ` for ${whiteLabelUsers.find(u => u.id === selectedWhiteLabel)?.name}` : ''}.`,
    });
    
    if (onSettingChange) {
      onSettingChange();
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
      description: "File has been successfully uploaded.",
    });
  };

  const handleDomainVerification = () => {
    // Simulate domain verification
    setBranding(prev => ({
      ...prev,
      domainStatus: 'active',
      dnsRecords: prev.dnsRecords.map(record => ({ ...record, status: 'verified' }))
    }));

    toast({
      title: "Domain verified",
      description: "Your custom domain has been successfully verified and is now active.",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "DNS record value has been copied to your clipboard.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">White Label Settings</h3>
        <p className="text-sm text-muted-foreground">
          {role === "Super Admin" 
            ? "Configure branding and appearance for White Label users." 
            : "Customize your platform's branding and appearance to match your brand identity."}
        </p>
      </div>

      {role === "Super Admin" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Select White Label User
            </CardTitle>
            <CardDescription>Choose which White Label user to configure</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="whiteLabelSelect">White Label User</Label>
              <Select value={selectedWhiteLabel} onValueChange={setSelectedWhiteLabel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a White Label user to configure" />
                </SelectTrigger>
                <SelectContent>
                  {whiteLabelUsers
                    .filter(user => user.isActive)
                    .map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-sm text-muted-foreground">{user.email}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="branding" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
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
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Domain Settings
              </CardTitle>
              <CardDescription>Configure your custom domain and DNS settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="customDomain">Custom Domain</Label>
                <div className="flex gap-2">
                  <Input
                    id="customDomain"
                    placeholder="app.yourcompany.com"
                    value={branding.customDomain}
                    onChange={(e) => handleInputChange("customDomain", e.target.value)}
                  />
                  <Button 
                    variant="outline"
                    onClick={handleDomainVerification}
                    disabled={!branding.customDomain}
                  >
                    Verify
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Point your domain to our servers for a fully branded experience
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SSL Certificate</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically provision SSL certificates for your domain
                  </p>
                </div>
                <Switch
                  checked={branding.sslEnabled}
                  onCheckedChange={(checked) => handleInputChange("sslEnabled", checked)}
                />
              </div>

              {branding.customDomain && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Domain Status:</span>
                    <div className={`flex items-center gap-1 text-sm ${
                      branding.domainStatus === 'active' ? 'text-green-600' : 
                      branding.domainStatus === 'error' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {branding.domainStatus === 'active' ? <Check className="h-4 w-4" /> : 
                       branding.domainStatus === 'error' ? <X className="h-4 w-4" /> : 
                       <Upload className="h-4 w-4" />}
                      {branding.domainStatus.charAt(0).toUpperCase() + branding.domainStatus.slice(1)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">DNS Records</h4>
                    <p className="text-xs text-muted-foreground">
                      Add these DNS records to your domain registrar to point your domain to our servers
                    </p>
                    
                    {branding.dnsRecords.map((record, index) => (
                      <div key={index} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{record.type}</span>
                            <span className={`text-xs ${
                              record.status === 'verified' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {record.status === 'verified' ? 'Verified' : 'Pending'}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(record.value)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-muted-foreground">Name:</span>
                            <p className="font-mono">{record.name}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Value:</span>
                            <p className="font-mono break-all">{record.value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ExternalLink className="h-3 w-3" />
                    <span>Need help? Check our documentation for DNS setup instructions</span>
                  </div>
                </div>
              )}
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
      
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={role === "Super Admin" && !selectedWhiteLabel}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
