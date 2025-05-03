
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, ArrowLeft, Plus, Save, X, List, Play, Pause, Eye, Edit, Trash, Clock, ToggleLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface WorkflowStep {
  id: string;
  type: string;
  name: string;
  config: Record<string, any>;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  active: boolean;
  createdAt: Date;
}

const WorkflowBuilder = () => {
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow>({
    id: crypto.randomUUID(),
    name: '',
    description: '',
    steps: [],
    active: false,
    createdAt: new Date()
  });
  const [activeTab, setActiveTab] = useState('design');

  const stepTypes = [
    { value: 'trigger', label: 'Trigger Event', description: 'Starts the workflow when a specific event occurs' },
    { value: 'condition', label: 'Condition Check', description: 'Only proceed if certain conditions are met' },
    { value: 'action', label: 'Perform Action', description: 'Execute an action like replying or liking' },
    { value: 'delay', label: 'Add Delay', description: 'Wait for a specified period before continuing' },
  ];

  const triggerOptions = [
    { value: 'new_comment', label: 'New Comment Received' },
    { value: 'new_follower', label: 'New Follower' },
    { value: 'post_liked', label: 'Post Liked' },
    { value: 'message_received', label: 'Direct Message Received' },
    { value: 'mentioned', label: 'Account Mentioned' }
  ];

  const conditionOptions = [
    { value: 'keyword_present', label: 'Contains Keyword' },
    { value: 'follower_count', label: 'Follower Count' },
    { value: 'is_verified', label: 'Is Verified Account' },
    { value: 'engagement_rate', label: 'Engagement Rate' },
    { value: 'previous_interaction', label: 'Has Previous Interaction' }
  ];

  const actionOptions = [
    { value: 'reply', label: 'Send Reply' },
    { value: 'like', label: 'Like Content' },
    { value: 'follow', label: 'Follow Account' },
    { value: 'add_tag', label: 'Add Tag' },
    { value: 'assign', label: 'Assign to Team Member' }
  ];

  const addStep = (type: string) => {
    const newStep: WorkflowStep = {
      id: crypto.randomUUID(),
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Step`,
      config: {}
    };
    
    setCurrentWorkflow({
      ...currentWorkflow,
      steps: [...currentWorkflow.steps, newStep]
    });
  };

  const removeStep = (stepId: string) => {
    setCurrentWorkflow({
      ...currentWorkflow,
      steps: currentWorkflow.steps.filter(step => step.id !== stepId)
    });
  };

  const updateStepName = (stepId: string, name: string) => {
    setCurrentWorkflow({
      ...currentWorkflow,
      steps: currentWorkflow.steps.map(step => 
        step.id === stepId ? { ...step, name } : step
      )
    });
  };

  const updateStepConfig = (stepId: string, config: Record<string, any>) => {
    setCurrentWorkflow({
      ...currentWorkflow,
      steps: currentWorkflow.steps.map(step => 
        step.id === stepId ? { ...step, config: { ...step.config, ...config } } : step
      )
    });
  };

  const saveWorkflow = () => {
    if (!currentWorkflow.name) {
      toast({
        title: "Validation Error",
        description: "Please provide a name for your workflow",
        variant: "destructive"
      });
      return;
    }

    if (currentWorkflow.steps.length === 0) {
      toast({
        title: "No Steps Added",
        description: "Please add at least one step to your workflow",
        variant: "destructive"
      });
      return;
    }

    // Add or update workflow
    const existingIndex = workflows.findIndex(w => w.id === currentWorkflow.id);
    if (existingIndex >= 0) {
      const updatedWorkflows = [...workflows];
      updatedWorkflows[existingIndex] = currentWorkflow;
      setWorkflows(updatedWorkflows);
      toast({
        title: "Workflow Updated",
        description: "Your workflow has been updated successfully"
      });
    } else {
      setWorkflows([...workflows, { ...currentWorkflow, createdAt: new Date() }]);
      toast({
        title: "Workflow Saved",
        description: "Your workflow has been saved successfully"
      });
    }

    // Reset for a new workflow
    setCurrentWorkflow({
      id: crypto.randomUUID(),
      name: '',
      description: '',
      steps: [],
      active: false,
      createdAt: new Date()
    });
    
    // Switch to the manage tab to show all workflows
    setActiveTab('manage');
  };

  const editWorkflow = (workflow: Workflow) => {
    setCurrentWorkflow(workflow);
    setActiveTab('design');
  };

  const deleteWorkflow = (workflowId: string) => {
    setWorkflows(workflows.filter(w => w.id !== workflowId));
    toast({
      title: "Workflow Deleted",
      description: "The workflow has been deleted successfully"
    });
  };

  const toggleWorkflowActive = (workflowId: string, active: boolean) => {
    setWorkflows(workflows.map(w => 
      w.id === workflowId ? { ...w, active } : w
    ));
    
    toast({
      title: active ? "Workflow Activated" : "Workflow Deactivated",
      description: `The workflow is now ${active ? 'active' : 'inactive'}`
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
            <h1 className="text-3xl font-bold mb-1">Workflow Builder</h1>
            <p className="text-muted-foreground">
              Create automated workflows to streamline your social media tasks
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/nocode/documentation">
              View Documentation
            </Link>
          </Button>
          <Button onClick={() => saveWorkflow()}>
            <Save className="mr-2 h-4 w-4" /> Save Workflow
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="design">Design Workflow</TabsTrigger>
          <TabsTrigger value="manage">Manage Workflows</TabsTrigger>
        </TabsList>
        
        <TabsContent value="design">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Details</CardTitle>
                  <CardDescription>Define your workflow properties</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Workflow Name</Label>
                    <Input 
                      id="name" 
                      value={currentWorkflow.name}
                      onChange={(e) => setCurrentWorkflow({...currentWorkflow, name: e.target.value})}
                      placeholder="Enter workflow name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input 
                      id="description" 
                      value={currentWorkflow.description}
                      onChange={(e) => setCurrentWorkflow({...currentWorkflow, description: e.target.value})}
                      placeholder="Describe what this workflow does"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="workflow-active"
                      checked={currentWorkflow.active}
                      onCheckedChange={(checked) => setCurrentWorkflow({...currentWorkflow, active: checked})}
                    />
                    <Label htmlFor="workflow-active">Activate workflow immediately</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Available Steps</CardTitle>
                  <CardDescription>Click to add steps to your workflow</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stepTypes.map(type => (
                    <Button 
                      key={type.value} 
                      variant="outline" 
                      className="w-full justify-start mb-2"
                      onClick={() => addStep(type.value)}
                    >
                      <Plus className="mr-2 h-4 w-4" /> 
                      {type.label}
                      <span className="text-xs text-muted-foreground ml-auto">{type.description}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Design</CardTitle>
                  <CardDescription>
                    {currentWorkflow.steps.length === 0 
                      ? "Add steps to build your workflow" 
                      : `${currentWorkflow.steps.length} step${currentWorkflow.steps.length !== 1 ? 's' : ''} in this workflow`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentWorkflow.steps.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center">
                      <p className="text-muted-foreground">
                        Your workflow steps will appear here.
                        <br />
                        Click a step type from the left panel to add it.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentWorkflow.steps.map((step, index) => (
                        <div key={step.id} className="relative">
                          <Card>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between">
                                <CardTitle className="text-lg">{step.name}</CardTitle>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0" 
                                  onClick={() => removeStep(step.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <CardDescription>
                                {stepTypes.find(t => t.value === step.type)?.label}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`step-${step.id}-name`}>Step Name</Label>
                                  <Input 
                                    id={`step-${step.id}-name`}
                                    value={step.name}
                                    onChange={(e) => updateStepName(step.id, e.target.value)}
                                  />
                                </div>
                                
                                {step.type === 'trigger' && (
                                  <div className="space-y-2">
                                    <Label htmlFor={`step-${step.id}-trigger-type`}>Trigger Type</Label>
                                    <Select 
                                      value={step.config.triggerType || ''}
                                      onValueChange={(value) => updateStepConfig(step.id, { triggerType: value })}
                                    >
                                      <SelectTrigger id={`step-${step.id}-trigger-type`}>
                                        <SelectValue placeholder="Select trigger type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {triggerOptions.map(option => (
                                          <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                                
                                {step.type === 'condition' && (
                                  <div className="space-y-2">
                                    <Label htmlFor={`step-${step.id}-condition-type`}>Condition Type</Label>
                                    <Select 
                                      value={step.config.conditionType || ''}
                                      onValueChange={(value) => updateStepConfig(step.id, { conditionType: value })}
                                    >
                                      <SelectTrigger id={`step-${step.id}-condition-type`}>
                                        <SelectValue placeholder="Select condition type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {conditionOptions.map(option => (
                                          <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    
                                    {step.config.conditionType && (
                                      <div className="mt-2">
                                        <Label htmlFor={`step-${step.id}-condition-value`}>Value</Label>
                                        <Input 
                                          id={`step-${step.id}-condition-value`}
                                          value={step.config.conditionValue || ''}
                                          onChange={(e) => updateStepConfig(step.id, { conditionValue: e.target.value })}
                                          placeholder="Enter condition value"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {step.type === 'action' && (
                                  <div className="space-y-2">
                                    <Label htmlFor={`step-${step.id}-action-type`}>Action Type</Label>
                                    <Select 
                                      value={step.config.actionType || ''}
                                      onValueChange={(value) => updateStepConfig(step.id, { actionType: value })}
                                    >
                                      <SelectTrigger id={`step-${step.id}-action-type`}>
                                        <SelectValue placeholder="Select action type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {actionOptions.map(option => (
                                          <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    
                                    {step.config.actionType === 'reply' && (
                                      <div className="mt-2">
                                        <Label htmlFor={`step-${step.id}-template`}>Response Template</Label>
                                        <Input 
                                          id={`step-${step.id}-template`}
                                          value={step.config.template || ''}
                                          onChange={(e) => updateStepConfig(step.id, { template: e.target.value })}
                                          placeholder="Enter template name or ID"
                                        />
                                      </div>
                                    )}
                                    
                                    {step.config.actionType === 'add_tag' && (
                                      <div className="mt-2">
                                        <Label htmlFor={`step-${step.id}-tag`}>Tag Name</Label>
                                        <Input 
                                          id={`step-${step.id}-tag`}
                                          value={step.config.tag || ''}
                                          onChange={(e) => updateStepConfig(step.id, { tag: e.target.value })}
                                          placeholder="Enter tag name"
                                        />
                                      </div>
                                    )}
                                    
                                    {step.config.actionType === 'assign' && (
                                      <div className="mt-2">
                                        <Label htmlFor={`step-${step.id}-team-member`}>Team Member</Label>
                                        <Input 
                                          id={`step-${step.id}-team-member`}
                                          value={step.config.teamMember || ''}
                                          onChange={(e) => updateStepConfig(step.id, { teamMember: e.target.value })}
                                          placeholder="Enter team member name or ID"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {step.type === 'delay' && (
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor={`step-${step.id}-delay-amount`}>Delay Amount</Label>
                                      <Input 
                                        id={`step-${step.id}-delay-amount`}
                                        type="number"
                                        min="1"
                                        value={step.config.delayAmount || ''}
                                        onChange={(e) => updateStepConfig(step.id, { delayAmount: e.target.value })}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`step-${step.id}-delay-unit`}>Unit</Label>
                                      <Select 
                                        value={step.config.delayUnit || 'minutes'}
                                        onValueChange={(value) => updateStepConfig(step.id, { delayUnit: value })}
                                      >
                                        <SelectTrigger id={`step-${step.id}-delay-unit`}>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="minutes">Minutes</SelectItem>
                                          <SelectItem value="hours">Hours</SelectItem>
                                          <SelectItem value="days">Days</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                          
                          {index < currentWorkflow.steps.length - 1 && (
                            <div className="flex justify-center my-2">
                              <ArrowRight className="text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    disabled={currentWorkflow.steps.length === 0} 
                    onClick={() => saveWorkflow()}
                    className="ml-auto"
                  >
                    <Save className="mr-2 h-4 w-4" /> Save Workflow
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Manage Workflows</CardTitle>
                  <CardDescription>View, edit, and manage your workflows</CardDescription>
                </div>
                <Button onClick={() => setActiveTab('design')}>
                  <Plus className="mr-2 h-4 w-4" /> Create New Workflow
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {workflows.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-muted-foreground">You haven't created any workflows yet.</p>
                  <Button onClick={() => setActiveTab('design')} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" /> Create Your First Workflow
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {workflows.map((workflow) => (
                    <Card key={workflow.id} className="overflow-hidden">
                      <div className={`h-2 ${workflow.active ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{workflow.name}</h3>
                              <Badge variant={workflow.active ? "default" : "outline"}>
                                {workflow.active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mt-1">{workflow.description || "No description provided"}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Created {formatDate(workflow.createdAt)}
                              </div>
                              <div>{workflow.steps.length} Steps</div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => editWorkflow(workflow)}>
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" /> Preview
                            </Button>
                            <Button 
                              variant={workflow.active ? "destructive" : "outline"} 
                              size="sm"
                              onClick={() => toggleWorkflowActive(workflow.id, !workflow.active)}
                            >
                              {workflow.active ? (
                                <><Pause className="h-4 w-4 mr-1" /> Deactivate</>
                              ) : (
                                <><Play className="h-4 w-4 mr-1" /> Activate</>
                              )}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteWorkflow(workflow.id)}>
                              <Trash className="h-4 w-4 mr-1" /> Delete
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

export default WorkflowBuilder;
