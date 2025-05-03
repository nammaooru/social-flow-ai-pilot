
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Check, Filter, ListChecks, Plus, Save, Settings, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface Action {
  id: string;
  type: string;
  value: string;
}

interface Rule {
  id: string;
  name: string;
  description: string;
  platform: string;
  priority: 'high' | 'medium' | 'low';
  conditions: Condition[];
  actions: Action[];
  active: boolean;
}

const RuleEditor = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<Rule[]>([]);
  const [currentRule, setCurrentRule] = useState<Rule>({
    id: crypto.randomUUID(),
    name: '',
    description: '',
    platform: 'all',
    priority: 'medium',
    conditions: [],
    actions: [],
    active: true
  });
  
  const platformOptions = [
    { value: 'all', label: 'All Platforms' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' }
  ];
  
  const priorityOptions = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];
  
  const conditionFieldOptions = [
    { value: 'content', label: 'Content Contains' },
    { value: 'username', label: 'Username Contains' },
    { value: 'follower_count', label: 'Follower Count' },
    { value: 'comment_length', label: 'Comment Length' },
    { value: 'is_following', label: 'Is Following Us' },
    { value: 'has_commented_before', label: 'Has Commented Before' }
  ];
  
  const conditionOperatorOptions = [
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Does Not Contain' },
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Does Not Equal' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'is_true', label: 'Is True' },
    { value: 'is_false', label: 'Is False' }
  ];
  
  const actionTypeOptions = [
    { value: 'reply', label: 'Reply with Template' },
    { value: 'like', label: 'Like' },
    { value: 'flag', label: 'Flag for Review' },
    { value: 'hide', label: 'Hide Comment' },
    { value: 'block', label: 'Block User' },
    { value: 'tag', label: 'Add Tag' },
    { value: 'assign', label: 'Assign to Team Member' }
  ];

  const addCondition = () => {
    const newCondition: Condition = {
      id: crypto.randomUUID(),
      field: 'content',
      operator: 'contains',
      value: ''
    };
    
    setCurrentRule({
      ...currentRule,
      conditions: [...currentRule.conditions, newCondition]
    });
  };
  
  const updateCondition = (id: string, field: keyof Condition, value: string) => {
    setCurrentRule({
      ...currentRule,
      conditions: currentRule.conditions.map(condition => 
        condition.id === id ? { ...condition, [field]: value } : condition
      )
    });
  };
  
  const removeCondition = (id: string) => {
    setCurrentRule({
      ...currentRule,
      conditions: currentRule.conditions.filter(condition => condition.id !== id)
    });
  };
  
  const addAction = () => {
    const newAction: Action = {
      id: crypto.randomUUID(),
      type: 'reply',
      value: ''
    };
    
    setCurrentRule({
      ...currentRule,
      actions: [...currentRule.actions, newAction]
    });
  };
  
  const updateAction = (id: string, field: keyof Action, value: string) => {
    setCurrentRule({
      ...currentRule,
      actions: currentRule.actions.map(action => 
        action.id === id ? { ...action, [field]: value } : action
      )
    });
  };
  
  const removeAction = (id: string) => {
    setCurrentRule({
      ...currentRule,
      actions: currentRule.actions.filter(action => action.id !== id)
    });
  };
  
  const saveRule = () => {
    if (!currentRule.name) {
      toast({
        title: "Validation Error",
        description: "Please provide a name for your rule",
        variant: "destructive"
      });
      return;
    }
    
    if (currentRule.conditions.length === 0) {
      toast({
        title: "No Conditions",
        description: "Your rule must have at least one condition",
        variant: "destructive"
      });
      return;
    }
    
    if (currentRule.actions.length === 0) {
      toast({
        title: "No Actions",
        description: "Your rule must have at least one action",
        variant: "destructive"
      });
      return;
    }
    
    // Validate all conditions have values
    const invalidCondition = currentRule.conditions.find(condition => !condition.value && condition.operator !== 'is_true' && condition.operator !== 'is_false');
    if (invalidCondition) {
      toast({
        title: "Invalid Condition",
        description: "All conditions must have values",
        variant: "destructive"
      });
      return;
    }
    
    // Validate all actions have values (if needed)
    const invalidAction = currentRule.actions.find(action => 
      (action.type === 'reply' || action.type === 'tag' || action.type === 'assign') && !action.value
    );
    if (invalidAction) {
      toast({
        title: "Invalid Action",
        description: `The action '${actionTypeOptions.find(o => o.value === invalidAction.type)?.label}' requires a value`,
        variant: "destructive"
      });
      return;
    }

    // Add or update rule
    const existingIndex = rules.findIndex(r => r.id === currentRule.id);
    if (existingIndex >= 0) {
      const updatedRules = [...rules];
      updatedRules[existingIndex] = currentRule;
      setRules(updatedRules);
    } else {
      setRules([...rules, currentRule]);
    }

    toast({
      title: "Rule Saved",
      description: "Your automation rule has been saved successfully"
    });

    // Reset for a new rule
    setCurrentRule({
      id: crypto.randomUUID(),
      name: '',
      description: '',
      platform: 'all',
      priority: 'medium',
      conditions: [],
      actions: [],
      active: true
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-1">Rule Editor</h1>
          <p className="text-muted-foreground">
            Create automation rules to streamline your social media workflow
          </p>
        </div>
        <Button onClick={() => saveRule()}>
          <Save className="mr-2 h-4 w-4" /> Save Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rule Details</CardTitle>
              <CardDescription>Define the basic rule properties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rule-name">Rule Name</Label>
                <Input 
                  id="rule-name" 
                  value={currentRule.name}
                  onChange={(e) => setCurrentRule({...currentRule, name: e.target.value})}
                  placeholder="Enter a name for this rule"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={currentRule.description}
                  onChange={(e) => setCurrentRule({...currentRule, description: e.target.value})}
                  placeholder="Describe what this rule does"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select 
                  value={currentRule.platform}
                  onValueChange={(value) => setCurrentRule({...currentRule, platform: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platformOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={currentRule.priority}
                  onValueChange={(value) => setCurrentRule({
                    ...currentRule, 
                    priority: value as 'high' | 'medium' | 'low'
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="rule-active"
                  checked={currentRule.active}
                  onCheckedChange={(checked) => 
                    setCurrentRule({...currentRule, active: checked})
                  }
                />
                <Label htmlFor="rule-active">Rule is active</Label>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center">
                  <Filter className="mr-2 h-5 w-5" /> 
                  Conditions
                </CardTitle>
                <CardDescription>
                  When all of these conditions are met...
                </CardDescription>
              </div>
              <Button onClick={addCondition}>
                <Plus className="mr-2 h-4 w-4" /> Add Condition
              </Button>
            </CardHeader>
            <CardContent>
              {currentRule.conditions.length === 0 ? (
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">
                    No conditions added yet. Rules need at least one condition to trigger actions.
                  </p>
                  <Button onClick={addCondition} variant="outline" className="mt-4">
                    <Plus className="mr-2 h-4 w-4" /> Add Your First Condition
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentRule.conditions.map((condition, index) => (
                    <Card key={condition.id} className="border border-muted">
                      <CardContent className="p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex-1 min-w-[200px]">
                            <Select
                              value={condition.field}
                              onValueChange={(value) => updateCondition(condition.id, 'field', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {conditionFieldOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex-1 min-w-[200px]">
                            <Select
                              value={condition.operator}
                              onValueChange={(value) => updateCondition(condition.id, 'operator', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {conditionOperatorOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {condition.operator !== 'is_true' && condition.operator !== 'is_false' && (
                            <div className="flex-1 min-w-[200px]">
                              <Input 
                                placeholder="Value" 
                                value={condition.value}
                                onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                              />
                            </div>
                          )}

                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeCondition(condition.id)}
                            className="shrink-0"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {index < currentRule.conditions.length - 1 && (
                          <div className="mt-2 text-center">
                            <Badge variant="outline">AND</Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" /> 
                  Actions
                </CardTitle>
                <CardDescription>
                  Then perform these actions...
                </CardDescription>
              </div>
              <Button onClick={addAction}>
                <Plus className="mr-2 h-4 w-4" /> Add Action
              </Button>
            </CardHeader>
            <CardContent>
              {currentRule.actions.length === 0 ? (
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">
                    No actions added yet. Define what should happen when the conditions are met.
                  </p>
                  <Button onClick={addAction} variant="outline" className="mt-4">
                    <Plus className="mr-2 h-4 w-4" /> Add Your First Action
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentRule.actions.map((action, index) => (
                    <Card key={action.id} className="border border-muted">
                      <CardContent className="p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex-1 min-w-[200px]">
                            <Select
                              value={action.type}
                              onValueChange={(value) => updateAction(action.id, 'type', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {actionTypeOptions.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {(action.type === 'reply' || action.type === 'tag' || action.type === 'assign') && (
                            <div className="flex-1 min-w-[200px]">
                              <Input 
                                placeholder={action.type === 'reply' ? "Template name" : action.type === 'tag' ? "Tag name" : "Team member"}
                                value={action.value}
                                onChange={(e) => updateAction(action.id, 'value', e.target.value)}
                              />
                            </div>
                          )}

                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeAction(action.id)}
                            className="shrink-0"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Card className="w-full">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                  <p className="text-sm font-medium">Rules are processed in order of priority</p>
                </div>
                <Button onClick={saveRule}>
                  <Check className="mr-2 h-4 w-4" /> Save Rule
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleEditor;
