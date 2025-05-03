
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, HelpCircle, MessagesSquare } from 'lucide-react';

const Documentation = () => {
  const [activeTab, setActiveTab] = useState('overview');

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
            <h1 className="text-3xl font-bold mb-1">Documentation</h1>
            <p className="text-muted-foreground">
              Complete guide for the No-Code Builder Suite
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflow">Workflow Builder</TabsTrigger>
          <TabsTrigger value="post">Post Creator</TabsTrigger>
          <TabsTrigger value="template">Template Builder</TabsTrigger>
          <TabsTrigger value="rule">Rule Editor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>No-Code Builder Suite Overview</CardTitle>
              <CardDescription>A comprehensive suite of tools to manage your social media without coding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none dark:prose-invert">
                <p>
                  The No-Code Builder Suite allows you to create, manage, and automate various aspects of your social media 
                  presence without writing any code. The suite consists of five specialized builders:
                </p>
                
                <ul>
                  <li>
                    <strong>Workflow Builder</strong> - Create automated workflows across your social platforms with triggers,
                    conditions, and actions.
                  </li>
                  <li>
                    <strong>Post Creator</strong> - Design engaging posts with a drag-and-drop interface. Add text, images,
                    and interactive elements.
                  </li>
                  <li>
                    <strong>Template Builder</strong> - Configure response templates with variables for consistent and personalized
                    audience engagement.
                  </li>
                  <li>
                    <strong>Rule Editor</strong> - Set up automation rules that trigger specific actions when conditions are met.
                  </li>
                  <li>
                    <strong>Dashboard Builder</strong> - Customize your management dashboard layout with various widgets for
                    different needs.
                  </li>
                </ul>
                
                <h3>Getting Started</h3>
                <p>
                  To begin using the No-Code Builder Suite, navigate to each builder through the main No-Code page. Each builder
                  provides an intuitive interface to create and manage its specific elements.
                </p>
                
                <h3>Best Practices</h3>
                <ol>
                  <li>Start with simple configurations before creating complex automations</li>
                  <li>Use descriptive names for all your created items</li>
                  <li>Test your configurations before fully deploying them</li>
                  <li>Regularly review and update your automations</li>
                </ol>
                
                <p>
                  Select a specific builder tab above to learn more about each tool's capabilities and usage instructions.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workflow">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Builder Documentation</CardTitle>
              <CardDescription>Create automated workflows for your social media platforms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none dark:prose-invert">
                <h3>Overview</h3>
                <p>
                  The Workflow Builder allows you to create automated sequences of steps that execute when specific triggers occur.
                  Each workflow consists of a series of steps, including triggers, conditions, actions, and delays.
                </p>
                
                <h3>Creating a Workflow</h3>
                <ol>
                  <li>Navigate to the Workflow Builder</li>
                  <li>Enter a name and description for your workflow</li>
                  <li>Add steps from the "Available Steps" panel on the left</li>
                  <li>Configure each step with the required parameters</li>
                  <li>Save your workflow</li>
                </ol>
                
                <h3>Step Types</h3>
                <ul>
                  <li>
                    <strong>Trigger Event</strong> - The event that initiates the workflow (e.g., new comment, mention, message)
                  </li>
                  <li>
                    <strong>Condition Check</strong> - Validates if certain conditions are met before proceeding
                  </li>
                  <li>
                    <strong>Perform Action</strong> - Executes a specific action (like reply, like, flag)
                  </li>
                  <li>
                    <strong>Add Delay</strong> - Adds a time delay between steps
                  </li>
                </ul>
                
                <h3>Managing Workflows</h3>
                <p>
                  All created workflows are stored and can be edited, enabled/disabled, or deleted. You can view all your 
                  workflows in the workflows management section.
                </p>
                
                <h3>Example Use Cases</h3>
                <ul>
                  <li>Automatically respond to comments containing specific keywords</li>
                  <li>Flag messages from high-priority accounts for human review</li>
                  <li>Schedule follow-up actions after engagement with posts</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="post">
          <Card>
            <CardHeader>
              <CardTitle>Post Creator Documentation</CardTitle>
              <CardDescription>Design and schedule posts with a drag-and-drop interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none dark:prose-invert">
                <h3>Overview</h3>
                <p>
                  The Post Creator provides a visual interface for designing social media posts. You can add different 
                  elements like text blocks, images, and interactive components to create engaging content.
                </p>
                
                <h3>Creating a Post</h3>
                <ol>
                  <li>Navigate to the Post Creator</li>
                  <li>Enter a name for your post and select a platform</li>
                  <li>Add elements from the Elements panel</li>
                  <li>Configure each element with content and settings</li>
                  <li>Preview how your post will look</li>
                  <li>Schedule your post or save as a draft</li>
                </ol>
                
                <h3>Element Types</h3>
                <ul>
                  <li>
                    <strong>Text Block</strong> - Add formatted text content
                  </li>
                  <li>
                    <strong>Image</strong> - Upload and add images with captions
                  </li>
                  <li>
                    <strong>Call to Action</strong> - Add buttons with links
                  </li>
                  <li>
                    <strong>Poll</strong> - Create interactive polls
                  </li>
                </ul>
                
                <h3>Scheduling Options</h3>
                <ul>
                  <li>Schedule for a specific date and time</li>
                  <li>Use AI-recommended optimal posting times</li>
                  <li>Add to posting queue</li>
                  <li>Save as draft for later editing</li>
                </ul>
                
                <h3>Additional Features</h3>
                <ul>
                  <li>Post to multiple platforms simultaneously</li>
                  <li>Add first comments automatically</li>
                  <li>Generate optimized hashtags</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="template">
          <Card>
            <CardHeader>
              <CardTitle>Template Builder Documentation</CardTitle>
              <CardDescription>Create reusable templates for consistent engagement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none dark:prose-invert">
                <h3>Overview</h3>
                <p>
                  The Template Builder allows you to create reusable response templates with dynamic variables.
                  These templates help maintain consistency in your communication while personalizing responses.
                </p>
                
                <h3>Creating a Template</h3>
                <ol>
                  <li>Navigate to the Template Builder</li>
                  <li>Enter a name and select a category for your template</li>
                  <li>Add variables that will be replaced with actual values</li>
                  <li>Write your template content, inserting variables where needed</li>
                  <li>Preview how your template will look with variables applied</li>
                  <li>Save your template</li>
                </ol>
                
                <h3>Template Variables</h3>
                <p>
                  Variables are placeholders in your template that get replaced with actual values when the template is used.
                  Variables are formatted as <code>{"{variable_name}"}</code>.
                </p>
                <p>Common variables include:</p>
                <ul>
                  <li><code>{"{name}"}</code> - The name of the person you're responding to</li>
                  <li><code>{"{product}"}</code> - Product name</li>
                  <li><code>{"{order_number}"}</code> - Order or reference number</li>
                  <li><code>{"{custom_message}"}</code> - A custom message to add</li>
                </ul>
                
                <h3>AI Template Assistant</h3>
                <p>
                  The AI Template Assistant can help you create professional templates based on common scenarios.
                  You can select from suggested templates or request a custom template based on your needs.
                </p>
                
                <h3>Template Categories</h3>
                <ul>
                  <li>General Responses</li>
                  <li>Comment Replies</li>
                  <li>Direct Messages</li>
                  <li>Customer Support</li>
                  <li>Sales & Promotions</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rule">
          <Card>
            <CardHeader>
              <CardTitle>Rule Editor Documentation</CardTitle>
              <CardDescription>Set up automation rules to streamline your workflow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none dark:prose-invert">
                <h3>Overview</h3>
                <p>
                  The Rule Editor allows you to create conditional rules that automatically execute actions when specific 
                  conditions are met. Rules help automate repetitive tasks and streamline your workflow.
                </p>
                
                <h3>Creating a Rule</h3>
                <ol>
                  <li>Navigate to the Rule Editor</li>
                  <li>Enter a name and description for your rule</li>
                  <li>Select which platform(s) this rule applies to</li>
                  <li>Set the priority level for the rule</li>
                  <li>Add conditions that need to be met</li>
                  <li>Add actions that will execute when conditions are met</li>
                  <li>Save your rule</li>
                </ol>
                
                <h3>Conditions</h3>
                <p>Conditions determine when a rule should be triggered. You can set multiple conditions that must all be met.</p>
                <p>Common condition types:</p>
                <ul>
                  <li>Content contains specific keywords</li>
                  <li>User has a certain follower count</li>
                  <li>Comment length is above/below a threshold</li>
                  <li>User has commented before</li>
                </ul>
                
                <h3>Actions</h3>
                <p>Actions are what happens when all conditions are met. You can add multiple actions to a rule.</p>
                <p>Common action types:</p>
                <ul>
                  <li>Reply with a template</li>
                  <li>Like the content</li>
                  <li>Flag for review</li>
                  <li>Hide or block content</li>
                  <li>Assign to team member</li>
                </ul>
                
                <h3>Rule Priority</h3>
                <p>
                  When multiple rules could apply to the same content, the priority level determines which rule takes precedence.
                  Rules are processed in order from high priority to low priority.
                </p>
                
                <h3>Managing Rules</h3>
                <p>
                  All created rules are stored and can be edited, enabled/disabled, or deleted. You can view all your
                  rules in the rules management section.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button variant="outline" asChild>
          <Link to="/nocode">
            Return to No-Code Suite
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Documentation;
