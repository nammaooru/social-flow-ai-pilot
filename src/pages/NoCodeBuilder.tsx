
import React, { useState } from 'react';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Wand, Save, Play, File, FileCode } from 'lucide-react';
import WorkflowBuilder from '@/components/nocode/WorkflowBuilder';
import PostCreator from '@/components/nocode/PostCreator';
import TemplateBuilder from '@/components/nocode/TemplateBuilder';
import RuleBuilder from '@/components/nocode/RuleBuilder';

const NoCodeBuilder = () => {
  const [activeTab, setActiveTab] = useState('workflow');
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Changes saved",
      description: "Your configuration has been saved successfully.",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wand className="h-8 w-8" />
            No-Code Builder
          </h1>
          <p className="text-muted-foreground mt-1">
            Build workflows, posts, templates, and automation rules without writing code
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Play className="h-4 w-4" />
            Test
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="workflow" className="flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            Workflow Builder
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <File className="h-4 w-4" />
            Post Creator
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            Template Builder
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            Rule Builder
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="workflow">
          <WorkflowBuilder />
        </TabsContent>
        
        <TabsContent value="posts">
          <PostCreator />
        </TabsContent>
        
        <TabsContent value="templates">
          <TemplateBuilder />
        </TabsContent>
        
        <TabsContent value="rules">
          <RuleBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NoCodeBuilder;
