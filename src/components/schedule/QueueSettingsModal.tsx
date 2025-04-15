
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Clock,
  Plus,
  Trash,
  Upload,
  Download,
  Save
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface QueueSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveComplete: (slots: QueueSlot[]) => void;
  currentSlots: QueueSlot[];
}

interface QueueSlot {
  id: string;
  name: string;
  time: string;
  items: any[];
}

interface TimePreset {
  name: string;
  slots: {
    name: string;
    time: string;
  }[];
}

const DEFAULT_TIME_PRESETS: TimePreset[] = [
  {
    name: "Standard (4 slots)",
    slots: [
      { name: "Morning", time: "09:00" },
      { name: "Midday", time: "12:00" },
      { name: "Afternoon", time: "15:00" },
      { name: "Evening", time: "19:00" }
    ]
  },
  {
    name: "Business Hours (3 slots)",
    slots: [
      { name: "Morning", time: "10:00" },
      { name: "Midday", time: "13:00" },
      { name: "Afternoon", time: "16:00" }
    ]
  },
  {
    name: "Social Media Peak (5 slots)",
    slots: [
      { name: "Early Morning", time: "07:00" },
      { name: "Morning Commute", time: "09:00" },
      { name: "Lunch Break", time: "12:30" },
      { name: "After Work", time: "17:30" },
      { name: "Evening Peak", time: "20:00" }
    ]
  }
];

const QueueSettingsModal: React.FC<QueueSettingsModalProps> = ({ 
  open, 
  onOpenChange, 
  onSaveComplete,
  currentSlots 
}) => {
  const [slots, setSlots] = useState<QueueSlot[]>(currentSlots || []);
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("slots");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const addNewSlot = () => {
    const newSlot: QueueSlot = {
      id: crypto.randomUUID(),
      name: "New Slot",
      time: "12:00",
      items: []
    };
    setSlots([...slots, newSlot]);
  };

  const updateSlotName = (id: string, name: string) => {
    setSlots(slots.map(slot => slot.id === id ? { ...slot, name } : slot));
  };

  const updateSlotTime = (id: string, time: string) => {
    setSlots(slots.map(slot => slot.id === id ? { ...slot, time } : slot));
  };

  const removeSlot = (id: string) => {
    setSlots(slots.filter(slot => slot.id !== id));
  };

  const applyPreset = (presetName: string) => {
    const preset = DEFAULT_TIME_PRESETS.find(p => p.name === presetName);
    if (preset) {
      const newSlots: QueueSlot[] = preset.slots.map(slot => ({
        id: crypto.randomUUID(),
        name: slot.name,
        time: slot.time,
        items: []
      }));
      setSlots(newSlots);
      
      toast({
        title: "Preset applied",
        description: `Applied the "${presetName}" preset with ${newSlots.length} time slots.`,
      });
    }
  };

  const handleSave = () => {
    // Sort slots by time
    const sortedSlots = [...slots].sort((a, b) => {
      const timeA = a.time.split(':').map(Number);
      const timeB = b.time.split(':').map(Number);
      
      const hoursA = timeA[0];
      const hoursB = timeB[0];
      
      if (hoursA !== hoursB) {
        return hoursA - hoursB;
      }
      
      const minutesA = timeA[1];
      const minutesB = timeB[1];
      
      return minutesA - minutesB;
    });
    
    setIsSaving(true);
    
    setTimeout(() => {
      onSaveComplete(sortedSlots);
      setIsSaving(false);
      onOpenChange(false);
      
      toast({
        title: "Queue settings saved",
        description: `Successfully saved ${sortedSlots.length} time slots for your content queue.`,
      });
    }, 1000);
  };

  const handleImport = () => {
    // In a real app, this would open a file dialog
    toast({
      title: "Import time slots",
      description: "This feature would allow importing time slots from a file.",
    });
  };

  const handleExport = () => {
    // In a real app, this would trigger a file download
    toast({
      title: "Export time slots",
      description: "This feature would export your time slots to a file.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Queue Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="slots" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Slots
            </TabsTrigger>
            <TabsTrigger value="presets" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Import Presets
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="slots" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-medium">Queue Time Slots</Label>
              <Button onClick={addNewSlot} size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add Slot
              </Button>
            </div>
            
            {slots.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground border rounded-md">
                No time slots configured. Add a slot or apply a preset.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slots.map((slot) => (
                    <TableRow key={slot.id}>
                      <TableCell>
                        <Input 
                          value={slot.name} 
                          onChange={(e) => updateSlotName(slot.id, e.target.value)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={slot.time}
                          onValueChange={(value) => updateSlotTime(slot.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }).map((_, hour) => (
                              <React.Fragment key={hour}>
                                <SelectItem value={`${hour.toString().padStart(2, '0')}:00`}>
                                  {hour.toString().padStart(2, '0')}:00
                                </SelectItem>
                                <SelectItem value={`${hour.toString().padStart(2, '0')}:30`}>
                                  {hour.toString().padStart(2, '0')}:30
                                </SelectItem>
                              </React.Fragment>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeSlot(slot.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
          
          <TabsContent value="presets" className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-medium">Time Slot Presets</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleImport} className="gap-1">
                  <Upload className="h-4 w-4" />
                  Import
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport} className="gap-1">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Select a preset to apply</Label>
              <Select
                value={selectedPreset}
                onValueChange={(value) => {
                  setSelectedPreset(value);
                  applyPreset(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a preset" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_TIME_PRESETS.map((preset) => (
                    <SelectItem key={preset.name} value={preset.name}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedPreset && (
                <div className="border rounded-md p-4 mt-4">
                  <h4 className="font-medium mb-2">{selectedPreset} Details:</h4>
                  <ul className="space-y-1">
                    {DEFAULT_TIME_PRESETS.find(p => p.name === selectedPreset)?.slots.map((slot, index) => (
                      <li key={index} className="text-sm flex justify-between">
                        <span>{slot.name}</span>
                        <span className="text-muted-foreground">{slot.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? (
              <>
                <span className="animate-spin">
                  <Clock className="h-4 w-4" />
                </span>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QueueSettingsModal;
