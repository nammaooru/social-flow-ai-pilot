
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { BarChart3, LayoutGrid, Maximize2, MessageSquare, Minimize2, Move, Plus, PlusCircle, Save, Settings, Trash2, ArrowLeft, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

interface Widget {
  id: string;
  type: string;
  title: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  settings: Record<string, any>;
}

interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: Widget[];
  isDefault: boolean;
  createdAt: Date;
}

const DashboardBuilder = () => {
  const { toast } = useToast();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [currentDashboard, setCurrentDashboard] = useState<Dashboard>({
    id: crypto.randomUUID(),
    name: '',
    description: '',
    widgets: [],
    isDefault: false,
    createdAt: new Date()
  });
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('design');
  
  const widgetTypes = [
    { value: 'analytics', label: 'Analytics Chart', icon: <BarChart3 className="h-4 w-4 mr-2" /> },
    { value: 'engagement', label: 'Engagement Feed', icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { value: 'metrics', label: 'Key Metrics', icon: <BarChart3 className="h-4 w-4 mr-2" /> },
    { value: 'scheduler', label: 'Schedule Preview', icon: <BarChart3 className="h-4 w-4 mr-2" /> },
    { value: 'content', label: 'Content Library', icon: <BarChart3 className="h-4 w-4 mr-2" /> }
  ];
  
  const addWidget = (type: string) => {
    const newWidget: Widget = {
      id: crypto.randomUUID(),
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Widget`,
      size: 'medium',
      position: { x: 0, y: currentDashboard.widgets.length },
      settings: {}
    };
    
    setCurrentDashboard({
      ...currentDashboard,
      widgets: [...currentDashboard.widgets, newWidget]
    });
    
    setSelectedWidgetId(newWidget.id);
  };
  
  const updateWidget = (id: string, field: keyof Widget, value: any) => {
    setCurrentDashboard({
      ...currentDashboard,
      widgets: currentDashboard.widgets.map(widget => 
        widget.id === id ? { ...widget, [field]: value } : widget
      )
    });
  };
  
  const removeWidget = (id: string) => {
    setCurrentDashboard({
      ...currentDashboard,
      widgets: currentDashboard.widgets.filter(widget => widget.id !== id)
    });
    
    if (selectedWidgetId === id) {
      setSelectedWidgetId(null);
    }
  };
  
  const getSelectedWidget = () => {
    return currentDashboard.widgets.find(widget => widget.id === selectedWidgetId);
  };
  
  const saveDashboard = () => {
    if (!currentDashboard.name) {
      toast({
        title: "Validation Error",
        description: "Please provide a name for your dashboard",
        variant: "destructive"
      });
      return;
    }

    // Add or update dashboard
    const existingIndex = dashboards.findIndex(d => d.id === currentDashboard.id);
    if (existingIndex >= 0) {
      const updatedDashboards = [...dashboards];
      updatedDashboards[existingIndex] = currentDashboard;
      setDashboards(updatedDashboards);
      toast({
        title: "Dashboard Updated",
        description: "Your dashboard has been updated successfully"
      });
    } else {
      const newDashboard = { ...currentDashboard, createdAt: new Date() };
      setDashboards([...dashboards, newDashboard]);
      toast({
        title: "Dashboard Saved",
        description: "Your dashboard has been saved successfully"
      });
    }

    // Reset for a new dashboard if we just created one
    if (existingIndex < 0) {
      setCurrentDashboard({
        id: crypto.randomUUID(),
        name: '',
        description: '',
        widgets: [],
        isDefault: false,
        createdAt: new Date()
      });
      setSelectedWidgetId(null);
    }
    
    // Switch to manage tab to show all dashboards
    setActiveTab('manage');
  };

  const editDashboard = (dashboard: Dashboard) => {
    setCurrentDashboard(dashboard);
    setSelectedWidgetId(null);
    setActiveTab('design');
  };

  const deleteDashboard = (dashboardId: string) => {
    setDashboards(dashboards.filter(d => d.id !== dashboardId));
    toast({
      title: "Dashboard Deleted",
      description: "The dashboard has been deleted successfully"
    });
  };

  const setDefaultDashboard = (dashboardId: string) => {
    setDashboards(dashboards.map(d => 
      ({ ...d, isDefault: d.id === dashboardId })
    ));
    
    toast({
      title: "Default Dashboard Set",
      description: "Your default dashboard has been updated"
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/nocode">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-1">Dashboard Builder</h1>
            <p className="text-muted-foreground">
              Create custom dashboards for different purposes and teams
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/nocode/documentation">
              View Documentation
            </Link>
          </Button>
          <Button onClick={() => saveDashboard()}>
            <Save className="mr-2 h-4 w-4" /> Save Dashboard
          </Button>
        </div>
      </div>

      <Tabs defaultValue="design" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="design">Design Dashboard</TabsTrigger>
          <TabsTrigger value="manage">Manage Dashboards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="design">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Details</CardTitle>
                  <CardDescription>Set up your dashboard information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dashboard-name">Dashboard Name</Label>
                    <Input 
                      id="dashboard-name" 
                      value={currentDashboard.name}
                      onChange={(e) => setCurrentDashboard({...currentDashboard, name: e.target.value})}
                      placeholder="Enter a name for this dashboard"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input 
                      id="description" 
                      value={currentDashboard.description}
                      onChange={(e) => setCurrentDashboard({...currentDashboard, description: e.target.value})}
                      placeholder="Describe the purpose of this dashboard"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="is-default"
                      checked={currentDashboard.isDefault}
                      onCheckedChange={(checked) => setCurrentDashboard({...currentDashboard, isDefault: checked})}
                    />
                    <Label htmlFor="is-default">Set as default dashboard</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Available Widgets</CardTitle>
                  <CardDescription>Add widgets to your dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {widgetTypes.map(type => (
                    <Button 
                      key={type.value} 
                      variant="outline" 
                      className="w-full justify-start mb-2"
                      onClick={() => addWidget(type.value)}
                    >
                      {type.icon} {type.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Tabs defaultValue="layout" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="layout">
                    <LayoutGrid className="h-4 w-4 mr-2" /> Layout
                  </TabsTrigger>
                  <TabsTrigger value="widget-settings" disabled={!selectedWidgetId}>
                    <Settings className="h-4 w-4 mr-2" /> Widget Settings
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="layout">
                  <Card>
                    <CardHeader>
                      <CardTitle>Dashboard Layout</CardTitle>
                      <CardDescription>
                        Arrange widgets by dragging them in the grid
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {currentDashboard.widgets.length === 0 ? (
                        <div className="border-2 border-dashed border-muted rounded-lg p-12 text-center">
                          <p className="text-muted-foreground">
                            Your dashboard is empty. Add widgets from the left panel to get started.
                          </p>
                          <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => addWidget('metrics')}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" /> Add Your First Widget
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 gap-4 min-h-[500px] border border-dashed rounded-lg p-4">
                          {currentDashboard.widgets.map(widget => {
                            const sizeClasses = {
                              small: 'col-span-1 h-40',
                              medium: 'col-span-2 h-48',
                              large: 'col-span-4 h-64'
                            };
                            
                            return (
                              <div 
                                key={widget.id}
                                className={`${sizeClasses[widget.size]} bg-background border rounded-lg p-2 cursor-move relative ${
                                  selectedWidgetId === widget.id ? 'ring-2 ring-primary' : ''
                                }`}
                                onClick={() => setSelectedWidgetId(widget.id)}
                              >
                                <div className="flex items-center justify-between mb-2 p-2">
                                  <div className="flex items-center">
                                    <Move className="h-4 w-4 text-muted-foreground mr-2" />
                                    <span className="font-medium truncate">{widget.title}</span>
                                  </div>
                                  <div className="flex space-x-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-7 w-7 p-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const newSize = widget.size === 'small' ? 'medium' : widget.size === 'medium' ? 'large' : 'small';
                                        updateWidget(widget.id, 'size', newSize);
                                      }}
                                    >
                                      {widget.size === 'large' ? 
                                        <Minimize2 className="h-4 w-4" /> : 
                                        <Maximize2 className="h-4 w-4" />
                                      }
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-7 w-7 p-0 hover:text-destructive"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeWidget(widget.id);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="h-full flex items-center justify-center p-2">
                                  <div className="text-center text-xs text-muted-foreground">
                                    {widgetTypes.find(t => t.value === widget.type)?.label || 'Widget'}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="mr-auto"
                        disabled={currentDashboard.widgets.length === 0}
                        onClick={() => setCurrentDashboard({...currentDashboard, widgets: []})}
                      >
                        Clear All
                      </Button>
                      <Button 
                        disabled={currentDashboard.widgets.length === 0}
                        onClick={() => saveDashboard()}
                      >
                        <Save className="mr-2 h-4 w-4" /> Save Dashboard
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="widget-settings">
                  {selectedWidgetId && getSelectedWidget() && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Widget Settings</CardTitle>
                        <CardDescription>
                          Configure the selected widget
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="widget-title">Widget Title</Label>
                          <Input 
                            id="widget-title" 
                            value={getSelectedWidget()?.title || ''}
                            onChange={(e) => updateWidget(selectedWidgetId, 'title', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="widget-size">Widget Size</Label>
                          <Select 
                            value={getSelectedWidget()?.size || 'medium'}
                            onValueChange={(value) => updateWidget(selectedWidgetId, 'size', value)}
                          >
                            <SelectTrigger id="widget-size">
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small (1/4 width)</SelectItem>
                              <SelectItem value="medium">Medium (1/2 width)</SelectItem>
                              <SelectItem value="large">Large (Full width)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {getSelectedWidget()?.type === 'analytics' && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="chart-type">Chart Type</Label>
                              <Select defaultValue="bar" onValueChange={(value) => 
                                updateWidget(selectedWidgetId, 'settings', { ...getSelectedWidget()?.settings, chartType: value })
                              }>
                                <SelectTrigger id="chart-type">
                                  <SelectValue placeholder="Select chart type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="bar">Bar Chart</SelectItem>
                                  <SelectItem value="line">Line Chart</SelectItem>
                                  <SelectItem value="pie">Pie Chart</SelectItem>
                                  <SelectItem value="area">Area Chart</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="data-source">Data Source</Label>
                              <Select defaultValue="engagement" onValueChange={(value) => 
                                updateWidget(selectedWidgetId, 'settings', { ...getSelectedWidget()?.settings, dataSource: value })
                              }>
                                <SelectTrigger id="data-source">
                                  <SelectValue placeholder="Select data source" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="engagement">Engagement Metrics</SelectItem>
                                  <SelectItem value="followers">Follower Growth</SelectItem>
                                  <SelectItem value="impressions">Impressions</SelectItem>
                                  <SelectItem value="conversions">Conversions</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}
                        
                        {getSelectedWidget()?.type === 'engagement' && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="content-type">Content Type</Label>
                              <Select defaultValue="all" onValueChange={(value) => 
                                updateWidget(selectedWidgetId, 'settings', { ...getSelectedWidget()?.settings, contentType: value })
                              }>
                                <SelectTrigger id="content-type">
                                  <SelectValue placeholder="Select content type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Content</SelectItem>
                                  <SelectItem value="comments">Comments Only</SelectItem>
                                  <SelectItem value="messages">Direct Messages</SelectItem>
                                  <SelectItem value="mentions">Mentions</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="filter-by">Filter By</Label>
                              <Select defaultValue="recent" onValueChange={(value) => 
                                updateWidget(selectedWidgetId, 'settings', { ...getSelectedWidget()?.settings, filter: value })
                              }>
                                <SelectTrigger id="filter-by">
                                  <SelectValue placeholder="Select filter" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="recent">Most Recent</SelectItem>
                                  <SelectItem value="unanswered">Unanswered</SelectItem>
                                  <SelectItem value="flagged">Flagged</SelectItem>
                                  <SelectItem value="priority">High Priority</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="mr-auto"
                          onClick={() => setSelectedWidgetId(null)}
                        >
                          Done
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => removeWidget(selectedWidgetId)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Remove Widget
                        </Button>
                      </CardFooter>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Manage Dashboards</CardTitle>
                  <CardDescription>View and manage your custom dashboards</CardDescription>
                </div>
                <Button onClick={() => {
                  setCurrentDashboard({
                    id: crypto.randomUUID(),
                    name: '',
                    description: '',
                    widgets: [],
                    isDefault: false,
                    createdAt: new Date()
                  });
                  setActiveTab('design');
                }}>
                  <Plus className="mr-2 h-4 w-4" /> Create New Dashboard
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {dashboards.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-muted-foreground">You haven't created any dashboards yet.</p>
                  <Button onClick={() => setActiveTab('design')} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" /> Create Your First Dashboard
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboards.map((dashboard) => (
                    <Card key={dashboard.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{dashboard.name}</h3>
                              {dashboard.isDefault && (
                                <Badge>Default</Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-sm mt-1">{dashboard.description || "No description provided"}</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-2">
                              <div className="mr-4">Created: {formatDate(dashboard.createdAt)}</div>
                              <div>{dashboard.widgets.length} Widgets</div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => editDashboard(dashboard)}>
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" /> Preview
                            </Button>
                            {!dashboard.isDefault && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setDefaultDashboard(dashboard.id)}
                              >
                                Set as Default
                              </Button>
                            )}
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => deleteDashboard(dashboard.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardBuilder;
