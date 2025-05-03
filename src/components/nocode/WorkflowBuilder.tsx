
import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { 
  DragDropContext, 
  Draggable, 
  Droppable,
  DropResult 
} from '@hello-pangea/dnd';
import { 
  MessageSquare, 
  Image, 
  Clock, 
  Filter,
  Plus,
  Settings,
  Users,
  PlusCircle,
  List,
  BarChart2,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import NodeConfigPanel from './NodeConfigPanel';

// Define workflow node types
const nodeTypes = [
  { id: 'trigger', name: 'Social Trigger', icon: MessageSquare, category: 'triggers' },
  { id: 'content', name: 'Content Post', icon: Image, category: 'actions' },
  { id: 'schedule', name: 'Schedule', icon: Clock, category: 'actions' },
  { id: 'filter', name: 'Filter', icon: Filter, category: 'logic' },
  { id: 'audience', name: 'Audience', icon: Users, category: 'data' },
  { id: 'analytics', name: 'Analytics', icon: BarChart2, category: 'data' },
];

// Group node types by category
const nodeCategories = {
  triggers: { name: 'Triggers', nodes: nodeTypes.filter(node => node.category === 'triggers') },
  actions: { name: 'Actions', nodes: nodeTypes.filter(node => node.category === 'actions') },
  logic: { name: 'Logic', nodes: nodeTypes.filter(node => node.category === 'logic') },
  data: { name: 'Data', nodes: nodeTypes.filter(node => node.category === 'data') },
};

interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

const WorkflowBuilder = () => {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [connections, setConnections] = useState<{from: string, to: string}[]>([]);
  const { toast } = useToast();

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    // Dropped outside the droppable area
    if (!destination) return;

    // Node is being reordered within the canvas
    if (source.droppableId === 'canvas' && destination.droppableId === 'canvas') {
      // Reorder logic if needed
      return;
    }

    // New node from palette dropped onto canvas
    if (source.droppableId.startsWith('palette') && destination.droppableId === 'canvas') {
      const nodeTypeId = result.draggableId;
      const nodeType = nodeTypes.find(type => type.id === nodeTypeId);
      
      if (nodeType) {
        const newNode: WorkflowNode = {
          id: `${nodeTypeId}-${Date.now()}`,
          type: nodeTypeId,
          position: { x: 100, y: 100 }, // Default position, would be adjusted in real implementation
          data: { label: nodeType.name },
        };
        
        setNodes([...nodes, newNode]);
        toast({
          title: 'Node Added',
          description: `${nodeType.name} node has been added to your workflow.`,
        });
      }
    }
  };

  const handleNodeClick = (node: WorkflowNode) => {
    setSelectedNode(node);
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes(nodes.filter(node => node.id !== nodeId));
    setConnections(connections.filter(conn => conn.from !== nodeId && conn.to !== nodeId));
    
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
    }
    
    toast({
      title: 'Node Removed',
      description: 'The node has been removed from your workflow.',
    });
  };

  const handleUpdateNodeConfig = (nodeId: string, newData: any) => {
    setNodes(nodes.map(node => 
      node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
    ));
    
    toast({
      title: 'Node Updated',
      description: 'Node configuration has been updated.',
    });
  };

  return (
    <div className="flex h-[calc(100vh-240px)]">
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Node palette */}
        <div className="w-64 border-r pr-4 overflow-auto">
          <h3 className="font-medium mb-4">Workflow Components</h3>
          
          {Object.entries(nodeCategories).map(([categoryId, category]) => (
            <div key={categoryId} className="mb-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">{category.name}</h4>
              <Droppable droppableId={`palette-${categoryId}`} isDropDisabled={true}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2"
                  >
                    {category.nodes.map((nodeType, index) => (
                      <Draggable 
                        key={nodeType.id} 
                        draggableId={nodeType.id} 
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center p-2 border rounded-md hover:bg-accent cursor-grab"
                          >
                            <nodeType.icon className="h-4 w-4 mr-2" />
                            <span className="text-sm">{nodeType.name}</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
        
        {/* Canvas */}
        <div className="flex-1 relative border-r overflow-hidden">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <Button size="sm" variant="outline" className="bg-background">
              <Plus className="h-4 w-4 mr-1" />
              Add Node
            </Button>
            <Button size="sm" variant="outline" className="bg-background">
              <List className="h-4 w-4 mr-1" />
              Views
            </Button>
          </div>
          
          <Droppable droppableId="canvas">
            {(provided) => (
              <div 
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="w-full h-full bg-accent/10 relative p-4"
                style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 0)', backgroundSize: '20px 20px' }}
              >
                {nodes.map((node) => {
                  const nodeType = nodeTypes.find(type => type.id === node.type);
                  
                  return (
                    <div 
                      key={node.id} 
                      className="absolute p-3 border bg-background rounded-md shadow-sm cursor-pointer" 
                      style={{ 
                        left: `${node.position.x}px`, 
                        top: `${node.position.y}px`,
                        width: '180px'
                      }}
                      onClick={() => handleNodeClick(node)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {nodeType?.icon && (
                            <nodeType.icon className="h-4 w-4 mr-2" />
                          )}
                          <span className="font-medium text-sm">{node.data.label}</span>
                        </div>
                        <button 
                          className="h-5 w-5 flex items-center justify-center text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNode(node.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      {node.data.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {node.data.description}
                        </p>
                      )}
                    </div>
                  );
                })}
                {provided.placeholder}
                
                {/* Placeholder when empty */}
                {nodes.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <PlusCircle className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium mb-1">Start Building Your Workflow</h3>
                      <p className="text-muted-foreground text-sm max-w-md">
                        Drag components from the left panel to build your workflow, or use a template to get started quickly.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </div>
        
        {/* Configuration panel */}
        <div className="w-80 px-4">
          {selectedNode ? (
            <NodeConfigPanel
              node={selectedNode}
              onUpdateConfig={(data) => handleUpdateNodeConfig(selectedNode.id, data)}
              onClose={() => setSelectedNode(null)}
            />
          ) : (
            <div className="text-center py-8">
              <Settings className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium mb-1">Configure Workflow</h3>
              <p className="text-muted-foreground text-sm">
                Select a node to configure its settings.
              </p>
              <div className="mt-6">
                <Card className="text-left">
                  <CardHeader>
                    <CardTitle>Workflow Settings</CardTitle>
                    <CardDescription>Configure global workflow options</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Set up general settings for your workflow like name, triggers, and execution options.
                    </p>
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Workflow
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </DragDropContext>
    </div>
  );
};

export default WorkflowBuilder;
