
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Workflow, MessageSquare, ListFilter, LayoutDashboard } from 'lucide-react';

const NoCodeBuilder = () => {
  const builderOptions = [
    {
      title: 'Workflow Builder',
      description: 'Create automated workflows across your social platforms',
      icon: <Workflow className="h-12 w-12 text-primary" />,
      path: '/nocode/workflow',
      color: 'bg-gradient-to-br from-blue-50 to-blue-100'
    },
    {
      title: 'Post Creator',
      description: 'Drag and drop interface to design engaging posts',
      icon: <FileText className="h-12 w-12 text-orange-500" />,
      path: '/nocode/post',
      color: 'bg-gradient-to-br from-orange-50 to-orange-100'
    },
    {
      title: 'Template Builder',
      description: 'Configure response templates for audience engagement',
      icon: <MessageSquare className="h-12 w-12 text-green-500" />,
      path: '/nocode/template',
      color: 'bg-gradient-to-br from-green-50 to-green-100'
    },
    {
      title: 'Rule Editor',
      description: 'Set up automation rules to streamline your workflow',
      icon: <ListFilter className="h-12 w-12 text-purple-500" />,
      path: '/nocode/rule',
      color: 'bg-gradient-to-br from-purple-50 to-purple-100'
    },
    {
      title: 'Dashboard Builder',
      description: 'Customize your management dashboard layout and widgets',
      icon: <LayoutDashboard className="h-12 w-12 text-indigo-500" />,
      path: '/nocode/dashboard',
      color: 'bg-gradient-to-br from-indigo-50 to-indigo-100'
    }
  ];

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-1">No-Code Builder Suite</h1>
          <p className="text-muted-foreground">
            Build automation, content, and workflows without coding
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/nocode/documentation">
            View Documentation
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {builderOptions.map((option) => (
          <Card key={option.title} className="overflow-hidden border-t-4 border-t-primary transition-all hover:shadow-md">
            <CardHeader className={`${option.color} pb-8`}>
              <div className="flex justify-center">{option.icon}</div>
            </CardHeader>
            <CardContent className="pt-6">
              <CardTitle className="text-xl mb-2">{option.title}</CardTitle>
              <CardDescription className="text-sm">{option.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={option.path}>Open Builder</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NoCodeBuilder;
