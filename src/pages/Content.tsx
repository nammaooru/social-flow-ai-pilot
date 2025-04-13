
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, Upload, Image, Video, FileText, LayoutGrid } from 'lucide-react';
import ContentLibrary from '@/components/content/ContentLibrary';
import ContentTemplates from '@/components/content/ContentTemplates';
import UploadModal from '@/components/content/UploadModal';
import CreateTemplateModal from '@/components/content/CreateTemplateModal';
import { useToast } from '@/hooks/use-toast';

const Content = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const { toast } = useToast();

  // For demo purposes, we're bypassing authentication
  // In a real app, you would get the user ID from the authenticated session
  const demoUserId = '00000000-0000-0000-0000-000000000000';

  const { data: contentLibrary, isLoading: contentLoading, refetch: refetchContent } = useQuery({
    queryKey: ['contentLibrary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_library')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          title: "Error fetching content",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data || [];
    }
  });

  const { data: templates, isLoading: templatesLoading, refetch: refetchTemplates } = useQuery({
    queryKey: ['contentTemplates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          title: "Error fetching templates",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data || [];
    }
  });

  // Setup real-time subscriptions
  useEffect(() => {
    // Subscribe to changes in content_library
    const contentChannel = supabase
      .channel('content_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'content_library' 
        }, 
        () => {
          refetchContent();
        }
      )
      .subscribe();

    // Subscribe to changes in content_templates
    const templateChannel = supabase
      .channel('template_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'content_templates' 
        }, 
        () => {
          refetchTemplates();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(contentChannel);
      supabase.removeChannel(templateChannel);
    };
  }, [refetchContent, refetchTemplates]);

  const handleUploadComplete = () => {
    setIsUploadModalOpen(false);
    refetchContent();
    toast({
      title: "Upload successful",
      description: "Your content has been uploaded to the library.",
    });
  };

  const handleTemplateCreate = () => {
    setIsTemplateModalOpen(false);
    refetchTemplates();
    toast({
      title: "Template created",
      description: "Your content template has been saved.",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Content Management</h1>
        <div className="flex gap-2">
          {activeTab === 'library' && (
            <Button 
              onClick={() => setIsUploadModalOpen(true)}
              className="gap-2"
            >
              <Upload size={16} />
              Upload Content
            </Button>
          )}
          {activeTab === 'templates' && (
            <Button 
              onClick={() => setIsTemplateModalOpen(true)}
              className="gap-2"
            >
              <PlusCircle size={16} />
              Create Template
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="library" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="library" className="flex items-center gap-2">
            <LayoutGrid size={16} />
            Content Library
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText size={16} />
            Content Templates
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="library">
          <ContentLibrary 
            content={contentLibrary || []} 
            isLoading={contentLoading}
            onRefresh={refetchContent}
          />
        </TabsContent>
        
        <TabsContent value="templates">
          <ContentTemplates 
            templates={templates || []} 
            isLoading={templatesLoading}
            onRefresh={refetchTemplates}
          />
        </TabsContent>
      </Tabs>

      <UploadModal 
        open={isUploadModalOpen} 
        onOpenChange={setIsUploadModalOpen}
        onUploadComplete={handleUploadComplete}
      />
      
      <CreateTemplateModal
        open={isTemplateModalOpen}
        onOpenChange={setIsTemplateModalOpen}
        onTemplateCreate={handleTemplateCreate}
      />
    </div>
  );
};

export default Content;
