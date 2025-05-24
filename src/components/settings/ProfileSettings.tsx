
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CommonSettingsProps } from "@/pages/Settings";

export function ProfileSettings({ onSettingChange }: CommonSettingsProps) {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe", 
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    bio: "Digital marketing professional with 5+ years of experience.",
    company: "Acme Corp",
    position: "Marketing Manager",
    website: "https://johndoe.com"
  });
  
  const handleSave = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
    
    if (onSettingChange) {
      onSettingChange();
    }
  };
  
  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your personal profile information and public details.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Update your profile picture and display name</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg" alt="Profile" />
            <AvatarFallback className="text-lg">JD</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Button variant="outline" size="sm">Change Picture</Button>
            <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={profile.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={profile.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              value={profile.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell us about yourself..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
          <CardDescription>Your work and business details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={profile.company}
              onChange={(e) => handleInputChange("company", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={profile.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={profile.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
