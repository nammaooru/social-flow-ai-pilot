
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Plus, Save, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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
}

const WorkflowBuilder = () => {
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow>({
    id: crypto.randomUUID(),
    name: '',
    description: '',
    steps: [],
    active: false
  });

  const stepTypes = [
    { value: 'trigger', label: 'Trigger Event' },
    { value: 'condition', label: 'Condition Check' },
    { value: 'action', label: 'Perform Action' },
    { value: 'delay', label: 'Add Delay' },
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
    } else {
      setWorkflows([...workflows, currentWorkflow]);
    }

    toast({
      title: "Workflow Saved",
      description: "Your workflow has been saved successfully"
    });

    // Reset for a new workflow
    setCurrentWorkflow({
      id: crypto.randomUUID(),
      name: '',
      description: '',
      steps: [],
      active: false
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-1">Workflow Builder</h1>
          <p className="text-muted-foreground">
            Create automated workflows to streamline your social media tasks
          </p>
        </div>
        <Button onClick={() => saveWorkflow()}>
          <Save className="mr-2 h-4 w-4" /> Save Workflow
        </Button>
      </div>

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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Steps</CardTitle>
              <CardDescription>Drag and drop or click to add</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {stepTypes.map(type => (
                <Button 
                  key={type.value} 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => addStep(type.value)}
                >
                  <Plus className="mr-2 h-4 w-4" /> 
                  {type.label}
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
                          <div className="space-y-2">
                            <Label htmlFor={`step-${step.id}-name`}>Step Name</Label>
                            <Input 
                              id={`step-${step.id}-name`}
                              value={step.name}
                              onChange={(e) => updateStepName(step.id, e.target.value)}
                            />
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
    </div>
  );
};

export default WorkflowBuilder;
