
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Palette, Globe } from "lucide-react";
import { CommonSettingsProps } from "@/pages/Settings";

export function WhiteLabelSettings({ onSettingChange }: CommonSettingsProps) {
  const { toast } = useToast();
  const [branding, setBranding] = useState({
    companyName: "Your Company",
    logo: "",
    favicon: "",
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    customDomain: "",
    hideFooter: false,
    customCSS: ""
  });
  
  const handleSave = () => {
    toast({
      title: "White label settings saved",
      description: "Your branding configuration has been updated successfully.",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  const handleInputChange = (field: string, value: string | boolean) => {
    setBranding(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">White Label</h3>
        <p className="text-sm text-muted-foreground">
          Customize your platform's branding and appearance to match your brand identity.
        </p>
      </div>
      
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
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Upload your logo</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Upload favicon</p>
                    <p className="text-xs text-gray-500">ICO, PNG 32x32px</p>
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
              <CardDescription>Configure your custom domain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customDomain">Custom Domain</Label>
                <Input
                  id="customDomain"
                  placeholder="app.yourcompany.com"
                  value={branding.customDomain}
                  onChange={(e) => handleInputChange("customDomain", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Point your domain to our servers for a fully branded experience
                </p>
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
        
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Customization</CardTitle>
              <CardDescription>Advanced branding options</CardDescription>
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
                  placeholder="/* Add your custom CSS here */"
                  value={branding.customCSS}
                  onChange={(e) => handleInputChange("customCSS", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Add custom CSS to further customize the appearance
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
